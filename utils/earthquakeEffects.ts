// utils/earthquakeEffects.ts

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
}

export interface EarthquakeEffect {
  city: CityData;
  distance: number; // km from impact
  magnitude: number; // Richter scale
  intensity: string; // Description
  damage: 'none' | 'light' | 'moderate' | 'severe' | 'catastrophic';
}

// Major cities database (simplified - in real app would use external API)
const MAJOR_CITIES: CityData[] = [
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, population: 8419000 },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, population: 3980000 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, population: 9540000 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, population: 2161000 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, population: 14094000 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, population: 5312000 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, population: 20411000 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, population: 21893000 },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5558, lng: -46.6396, population: 12396000 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, population: 21805000 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, population: 20901000 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6176, population: 12593000 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, population: 15636000 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792, population: 15388000 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6118, lng: -58.3960, population: 15000000 },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842, population: 13923000 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, population: 10770000 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, population: 10539000 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, population: 9733000 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, population: 10719000 },
];

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Calculate earthquake magnitude based on impact energy and distance
 */
function calculateEarthquakeMagnitude(energyMt: number, distance: number): number {
  // Simplified formula: impact energy converts to seismic energy
  // Higher energy impacts create stronger initial quakes that attenuate with distance
  const basemagnitude = Math.log10(energyMt) + 4; // Base magnitude from energy
  const attenuationFactor = Math.max(0, 1 - (distance / 1000)); // Attenuates over 1000km
  return Math.max(0, basemagnitude * attenuationFactor);
}

/**
 * Determine damage level based on earthquake magnitude
 */
function getDamageLevel(magnitude: number): { damage: EarthquakeEffect['damage'], intensity: string } {
  if (magnitude >= 8.0) {
    return { damage: 'catastrophic', intensity: 'Great earthquake - massive destruction' };
  } else if (magnitude >= 7.0) {
    return { damage: 'severe', intensity: 'Major earthquake - serious damage' };
  } else if (magnitude >= 6.0) {
    return { damage: 'moderate', intensity: 'Strong earthquake - considerable damage' };
  } else if (magnitude >= 4.0) {
    return { damage: 'light', intensity: 'Light earthquake - minor damage' };
  } else if (magnitude >= 2.0) {
    return { damage: 'light', intensity: 'Weak earthquake - felt by people' };
  } else {
    return { damage: 'none', intensity: 'No significant effects' };
  }
}

/**
 * Calculate earthquake effects for major cities based on asteroid impact
 */
export function calculateEarthquakeEffects(
  impactLocation: { lat: number; lng: number },
  energyMt: number,
  maxDistance: number = 2000 // Maximum distance to consider (km)
): EarthquakeEffect[] {
  const effects: EarthquakeEffect[] = [];

  for (const city of MAJOR_CITIES) {
    const distance = calculateDistance(
      impactLocation.lat, 
      impactLocation.lng, 
      city.lat, 
      city.lng
    );

    // Only include cities within maximum distance
    if (distance <= maxDistance) {
      const magnitude = calculateEarthquakeMagnitude(energyMt, distance);
      const { damage, intensity } = getDamageLevel(magnitude);

      // Only include cities with noticeable effects
      if (magnitude >= 2.0) {
        effects.push({
          city,
          distance,
          magnitude,
          intensity,
          damage,
        });
      }
    }
  }

  // Sort by distance (closest first)
  return effects.sort((a, b) => a.distance - b.distance);
}

/**
 * Get regional earthquake summary
 */
export function getEarthquakeSummary(effects: EarthquakeEffect[]): {
  totalAffected: number;
  severelyCritical: number;
  moderate: number;
  light: number;
  estimatedCasualties: number;
} {
  let totalAffected = 0;
  let severelyCritical = 0;
  let moderate = 0;
  let light = 0;
  let estimatedCasualties = 0;

  for (const effect of effects) {
    totalAffected += effect.city.population;

    switch (effect.damage) {
      case 'catastrophic':
      case 'severe':
        severelyCritical++;
        estimatedCasualties += effect.city.population * 0.01; // 1% casualty rate estimate
        break;
      case 'moderate':
        moderate++;
        estimatedCasualties += effect.city.population * 0.001; // 0.1% casualty rate
        break;
      case 'light':
        light++;
        break;
    }
  }

  return {
    totalAffected,
    severelyCritical,
    moderate,
    light,
    estimatedCasualties: Math.round(estimatedCasualties),
  };
}