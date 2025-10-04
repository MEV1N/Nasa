// utils/populationExposure.ts

/**
 * Vulnerability rates for different damage zones
 */
const VULNERABILITY_RATES = {
  severe: { 
    fatality_rate: 0.5,    // 50% fatality rate in severe zones
    injury_rate: 0.3       // 30% injury rate in severe zones
  },
  moderate: { 
    fatality_rate: 0.1,    // 10% fatality rate in moderate zones
    injury_rate: 0.2       // 20% injury rate in moderate zones
  },
  light: { 
    fatality_rate: 0.01,   // 1% fatality rate in light zones
    injury_rate: 0.05      // 5% injury rate in light zones
  },
};

export interface CasualtyEstimate {
  zone: 'severe' | 'moderate' | 'light';
  population: number;
  fatalities: number;
  injuries: number;
  survivors: number;
}

export interface PopulationExposure {
  totalPopulation: number;
  casualties: CasualtyEstimate[];
  summary: {
    totalFatalities: number;
    totalInjuries: number;
    totalSurvivors: number;
  };
}

/**
 * Get population exposure from raster data for a given hazard polygon
 * This is a placeholder for future raster-based calculations
 */
async function getPopulationExposure(rasterUrl: string, hazardPolygon: any): Promise<number> {
  // For now, return 0 to fall back to city-based calculations
  // In future implementations, this would use GeoTIFF and geoblaze
  console.log('Raster-based population calculation not implemented, using city-based fallback');
  return 0;
}

/**
 * Estimate casualties for a given population and damage zone
 */
function estimateCasualties(population: number, zone: 'severe' | 'moderate' | 'light'): CasualtyEstimate {
  const vulnerabilityRate = VULNERABILITY_RATES[zone];
  const fatalities = Math.round(population * vulnerabilityRate.fatality_rate);
  const injuries = Math.round(population * vulnerabilityRate.injury_rate);
  const survivors = population - fatalities - injuries;

  return {
    zone,
    population,
    fatalities,
    injuries,
    survivors: Math.max(0, survivors)
  };
}

/**
 * Calculate population exposure and casualties for hazard polygons
 * Uses fallback city-based calculations when raster data is unavailable
 */
export async function calculatePopulationExposure(
  hazardPolygons: any[],
  impactLocation: { lat: number; lng: number },
  rasterUrl?: string
): Promise<PopulationExposure> {
  const casualties: CasualtyEstimate[] = [];
  let totalPopulation = 0;

  // Try to use raster data if available
  if (rasterUrl) {
    try {
      for (const polygon of hazardPolygons) {
        const zoneType = polygon.properties.zone as 'severe' | 'moderate' | 'light';
        const population = await getPopulationExposure(rasterUrl, polygon);
        
        if (population > 0) {
          totalPopulation += population;
          const casualtyEstimate = estimateCasualties(population, zoneType);
          casualties.push(casualtyEstimate);
        }
      }
    } catch (error) {
      console.warn('Raster-based population calculation failed, using fallback method');
    }
  }

  // Fallback to city-based estimation if raster data fails or unavailable
  if (totalPopulation === 0) {
    const cityBasedExposure = calculateCityBasedExposure(impactLocation, hazardPolygons);
    return cityBasedExposure;
  }

  // Calculate summary statistics
  const summary = {
    totalFatalities: casualties.reduce((sum, c) => sum + c.fatalities, 0),
    totalInjuries: casualties.reduce((sum, c) => sum + c.injuries, 0),
    totalSurvivors: casualties.reduce((sum, c) => sum + c.survivors, 0),
  };

  return {
    totalPopulation,
    casualties,
    summary
  };
}

/**
 * Fallback city-based population exposure calculation
 */
function calculateCityBasedExposure(
  impactLocation: { lat: number; lng: number },
  hazardPolygons: any[]
): PopulationExposure {
  // Simplified city-based calculation using major cities
  const MAJOR_CITIES = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, population: 8419000 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, population: 3980000 },
    { name: 'London', lat: 51.5074, lng: -0.1278, population: 9540000 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, population: 2161000 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, population: 14094000 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, population: 5312000 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, population: 20411000 },
    { name: 'Beijing', lat: 39.9042, lng: 116.4074, population: 21893000 },
    { name: 'São Paulo', lat: -23.5558, lng: -46.6396, population: 12396000 },
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332, population: 21805000 },
  ];

  const casualties: CasualtyEstimate[] = [];
  let totalPopulation = 0;

  // Get radius from hazard polygons
  const severeRadius = extractRadiusFromPolygon(hazardPolygons.find(p => p.properties.zone === 'severe'));
  const moderateRadius = extractRadiusFromPolygon(hazardPolygons.find(p => p.properties.zone === 'moderate'));
  const lightRadius = extractRadiusFromPolygon(hazardPolygons.find(p => p.properties.zone === 'light'));

  MAJOR_CITIES.forEach(city => {
    const distance = calculateDistance(impactLocation.lat, impactLocation.lng, city.lat, city.lng);
    
    let zone: 'severe' | 'moderate' | 'light' | null = null;
    let affectedPopulation = 0;
    
    if (distance <= severeRadius) {
      zone = 'severe';
      affectedPopulation = city.population;
    } else if (distance <= moderateRadius) {
      zone = 'moderate';
      // Reduce population based on distance from severe zone
      const distanceFromSevere = distance - severeRadius;
      const moderateZoneWidth = moderateRadius - severeRadius;
      const populationReduction = Math.min(0.8, distanceFromSevere / moderateZoneWidth * 0.6);
      affectedPopulation = Math.round(city.population * (1 - populationReduction));
    } else if (distance <= lightRadius) {
      zone = 'light';
      // Further reduce population for light damage zone
      const distanceFromModerate = distance - moderateRadius;
      const lightZoneWidth = lightRadius - moderateRadius;
      const populationReduction = Math.min(0.9, 0.5 + (distanceFromModerate / lightZoneWidth * 0.4));
      affectedPopulation = Math.round(city.population * (1 - populationReduction));
    }

    if (zone && affectedPopulation > 0) {
      totalPopulation += affectedPopulation;
      const casualtyEstimate = estimateCasualties(affectedPopulation, zone);
      casualties.push(casualtyEstimate);
    }
  });

  // Calculate summary statistics
  const summary = {
    totalFatalities: casualties.reduce((sum, c) => sum + c.fatalities, 0),
    totalInjuries: casualties.reduce((sum, c) => sum + c.injuries, 0),
    totalSurvivors: casualties.reduce((sum, c) => sum + c.survivors, 0),
  };

  return {
    totalPopulation,
    casualties,
    summary
  };
}

/**
 * Extract radius from turf circle polygon (approximation)
 */
function extractRadiusFromPolygon(polygon: any): number {
  if (!polygon || !polygon.geometry || !polygon.geometry.coordinates) return 0;
  
  // For turf circles, we can approximate radius from the first coordinate
  const coords = polygon.geometry.coordinates[0];
  if (coords.length < 2) return 0;
  
  // Calculate distance from center to first point
  const centerLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;
  const centerLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
  
  return calculateDistance(centerLat, centerLng, coords[0][1], coords[0][0]);
}

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