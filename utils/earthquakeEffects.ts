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
  // More realistic formula based on impact energy
  // Base magnitude from impact energy (logarithmic relationship)
  let baseMagnitude = 0;
  
  if (energyMt >= 100000) {
    baseMagnitude = 9.0; // Extinction-level impacts
  } else if (energyMt >= 10000) {
    baseMagnitude = 8.5; // Global catastrophe
  } else if (energyMt >= 1000) {
    baseMagnitude = 8.0; // Regional devastation
  } else if (energyMt >= 100) {
    baseMagnitude = 7.5; // Major regional impact
  } else if (energyMt >= 10) {
    baseMagnitude = 7.0; // Significant regional impact
  } else if (energyMt >= 1) {
    baseMagnitude = 6.5; // Local major impact
  } else if (energyMt >= 0.1) {
    baseMagnitude = 6.0; // Local significant impact
  } else if (energyMt >= 0.01) {
    baseMagnitude = 5.5; // Local moderate impact
  } else {
    baseMagnitude = 5.0; // Small local impact
  }
  
  // Distance attenuation - earthquakes can be felt at great distances
  // More gradual attenuation than before
  let attenuationFactor = 1.0;
  if (distance > 100) {
    // Gradual attenuation starting at 100km
    attenuationFactor = Math.max(0.1, 1.0 - Math.pow(distance / 2000, 0.8));
  }
  
  const magnitude = baseMagnitude * attenuationFactor;
  return Math.max(0, magnitude);
}

/**
 * Determine damage level based on earthquake magnitude
 */
function getDamageLevel(magnitude: number): { damage: EarthquakeEffect['damage'], intensity: string } {
  if (magnitude >= 8.0) {
    return { damage: 'catastrophic', intensity: 'Great earthquake - massive destruction' };
  } else if (magnitude >= 7.0) {
    return { damage: 'severe', intensity: 'Major earthquake - serious structural damage' };
  } else if (magnitude >= 6.0) {
    return { damage: 'moderate', intensity: 'Strong earthquake - considerable damage' };
  } else if (magnitude >= 5.0) {
    return { damage: 'moderate', intensity: 'Moderate earthquake - widespread minor damage' };
  } else if (magnitude >= 4.0) {
    return { damage: 'light', intensity: 'Light earthquake - some damage to weak structures' };
  } else if (magnitude >= 3.0) {
    return { damage: 'light', intensity: 'Weak earthquake - felt by many, minor vibrations' };
  } else if (magnitude >= 2.0) {
    return { damage: 'light', intensity: 'Micro earthquake - felt by some people' };
  } else if (magnitude >= 1.5) {
    return { damage: 'none', intensity: 'Very weak - detected by instruments, barely felt' };
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

      // Include cities with any noticeable effects (magnitude 1.5+)
      if (magnitude >= 1.5) {
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
 * Calculate realistic affected population based on earthquake magnitude and distance
 */
function calculateAffectedPopulation(effect: EarthquakeEffect): number {
  const { magnitude, city, distance } = effect;
  
  // Base affected percentage based on magnitude
  let affectedPercentage = 0;
  
  if (magnitude >= 8.0) {
    affectedPercentage = 0.95; // 95% of population affected
  } else if (magnitude >= 7.0) {
    affectedPercentage = 0.80; // 80% affected
  } else if (magnitude >= 6.0) {
    affectedPercentage = 0.60; // 60% affected
  } else if (magnitude >= 5.0) {
    affectedPercentage = 0.35; // 35% affected
  } else if (magnitude >= 4.0) {
    affectedPercentage = 0.15; // 15% affected
  } else if (magnitude >= 3.0) {
    affectedPercentage = 0.05; // 5% affected
  } else {
    affectedPercentage = 0.01; // 1% affected (barely noticeable)
  }
  
  // Distance modifier - closer impacts affect more people
  let distanceModifier = 1.0;
  if (distance > 500) {
    distanceModifier = Math.max(0.1, 1.0 - (distance - 500) / 1500);
  }
  
  return Math.round(city.population * affectedPercentage * distanceModifier);
}

/**
 * Enhanced casualty breakdown with fatalities and injuries
 */
export interface CasualtyBreakdown {
  totalCasualties: number;
  fatalities: number;
  injuries: number;
  affectedPopulation: number;
}

/**
 * Vulnerability rates for different damage levels (matching impact zones)
 */
const VULNERABILITY_RATES = {
  catastrophic: { fatality_rate: 0.12, injury_rate: 0.25 }, // Very high rates for catastrophic
  severe: { fatality_rate: 0.08, injury_rate: 0.20 },       // High rates for severe damage
  moderate: { fatality_rate: 0.02, injury_rate: 0.08 },     // Moderate rates
  light: { fatality_rate: 0.005, injury_rate: 0.02 },       // Low rates for light damage
  none: { fatality_rate: 0.0001, injury_rate: 0.001 }       // Minimal rates
};

/**
 * Calculate detailed casualty estimates with fatalities and injuries breakdown
 */
function calculateDetailedCasualties(effect: EarthquakeEffect, affectedPopulation: number): CasualtyBreakdown {
  const { damage } = effect;
  
  // Get vulnerability rates for this damage level
  const rates = VULNERABILITY_RATES[damage] || VULNERABILITY_RATES.none;
  
  const fatalities = Math.round(affectedPopulation * rates.fatality_rate);
  const injuries = Math.round(affectedPopulation * rates.injury_rate);
  const totalCasualties = fatalities + injuries;
  
  return {
    totalCasualties,
    fatalities,
    injuries,
    affectedPopulation
  };
}

/**
 * Get regional earthquake summary with detailed casualty breakdown
 */
export function getEarthquakeSummary(effects: EarthquakeEffect[]): {
  totalAffected: number;
  severelyCritical: number;
  moderate: number;
  light: number;
  estimatedCasualties: number;
  totalFatalities: number;
  totalInjuries: number;
  casualtyBreakdown: CasualtyBreakdown[];
} {
  let totalAffected = 0;
  let severelyCritical = 0;
  let moderate = 0;
  let light = 0;
  let estimatedCasualties = 0;
  let totalFatalities = 0;
  let totalInjuries = 0;
  const casualtyBreakdown: CasualtyBreakdown[] = [];

  for (const effect of effects) {
    // Calculate realistic affected population
    const affectedInThisCity = calculateAffectedPopulation(effect);
    totalAffected += affectedInThisCity;
    
    // Calculate detailed casualties with breakdown
    const casualtiesInThisCity = calculateDetailedCasualties(effect, affectedInThisCity);
    estimatedCasualties += casualtiesInThisCity.totalCasualties;
    totalFatalities += casualtiesInThisCity.fatalities;
    totalInjuries += casualtiesInThisCity.injuries;
    casualtyBreakdown.push(casualtiesInThisCity);

    // Count damage categories
    switch (effect.damage) {
      case 'catastrophic':
      case 'severe':
        severelyCritical++;
        break;
      case 'moderate':
        moderate++;
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
    estimatedCasualties,
    totalFatalities,
    totalInjuries,
    casualtyBreakdown,
  };
}