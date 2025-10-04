// utils/citiesDatabase.ts

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number;
}

// Major world cities database - expanded list for better coverage
export const WORLD_CITIES: City[] = [
  // North America
  { name: "New York", country: "USA", latitude: 40.7128, longitude: -74.0060, population: 8336817 },
  { name: "Los Angeles", country: "USA", latitude: 34.0522, longitude: -118.2437, population: 3979576 },
  { name: "Chicago", country: "USA", latitude: 41.8781, longitude: -87.6298, population: 2693976 },
  { name: "Houston", country: "USA", latitude: 29.7604, longitude: -95.3698, population: 2320268 },
  { name: "Philadelphia", country: "USA", latitude: 39.9526, longitude: -75.1652, population: 1584064 },
  { name: "Phoenix", country: "USA", latitude: 33.4484, longitude: -112.0740, population: 1608139 },
  { name: "San Antonio", country: "USA", latitude: 29.4241, longitude: -98.4936, population: 1547253 },
  { name: "San Diego", country: "USA", latitude: 32.7157, longitude: -117.1611, population: 1423851 },
  { name: "Dallas", country: "USA", latitude: 32.7767, longitude: -96.7970, population: 1343573 },
  { name: "San Jose", country: "USA", latitude: 37.3382, longitude: -121.8863, population: 1021795 },
  { name: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, population: 2731571 },
  { name: "Montreal", country: "Canada", latitude: 45.5017, longitude: -73.5673, population: 1704694 },
  { name: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207, population: 631486 },
  { name: "Mexico City", country: "Mexico", latitude: 19.4326, longitude: -99.1332, population: 9209944 },

  // South America
  { name: "São Paulo", country: "Brazil", latitude: -23.5505, longitude: -46.6333, population: 12325232 },
  { name: "Rio de Janeiro", country: "Brazil", latitude: -22.9068, longitude: -43.1729, population: 6748000 },
  { name: "Buenos Aires", country: "Argentina", latitude: -34.6118, longitude: -58.3960, population: 2890151 },
  { name: "Lima", country: "Peru", latitude: -12.0464, longitude: -77.0428, population: 9751717 },
  { name: "Bogotá", country: "Colombia", latitude: 4.7110, longitude: -74.0721, population: 7412566 },
  { name: "Santiago", country: "Chile", latitude: -33.4489, longitude: -70.6693, population: 5614000 },

  // Europe
  { name: "London", country: "UK", latitude: 51.5074, longitude: -0.1278, population: 9304016 },
  { name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522, population: 2161000 },
  { name: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050, population: 3669491 },
  { name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038, population: 3223334 },
  { name: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964, population: 2873494 },
  { name: "Amsterdam", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, population: 821752 },
  { name: "Barcelona", country: "Spain", latitude: 41.3851, longitude: 2.1734, population: 1620343 },
  { name: "Vienna", country: "Austria", latitude: 48.2082, longitude: 16.3738, population: 1897491 },
  { name: "Stockholm", country: "Sweden", latitude: 59.3293, longitude: 18.0686, population: 975551 },
  { name: "Oslo", country: "Norway", latitude: 59.9139, longitude: 10.7522, population: 697549 },
  { name: "Copenhagen", country: "Denmark", latitude: 55.6761, longitude: 12.5683, population: 644431 },
  { name: "Warsaw", country: "Poland", latitude: 52.2297, longitude: 21.0122, population: 1790658 },
  { name: "Prague", country: "Czech Republic", latitude: 50.0755, longitude: 14.4378, population: 1318982 },
  { name: "Budapest", country: "Hungary", latitude: 47.4979, longitude: 19.0402, population: 1752286 },
  { name: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6176, population: 12615279 },
  { name: "St. Petersburg", country: "Russia", latitude: 59.9311, longitude: 30.3609, population: 5398064 },

  // Asia
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503, population: 37435191 },
  { name: "Delhi", country: "India", latitude: 28.7041, longitude: 77.1025, population: 32941308 },
  { name: "Shanghai", country: "China", latitude: 31.2304, longitude: 121.4737, population: 28516904 },
  { name: "Dhaka", country: "Bangladesh", latitude: 23.8103, longitude: 90.4125, population: 22478116 },
  { name: "São Paulo Metro", country: "Brazil", latitude: -23.5505, longitude: -46.6333, population: 22429800 },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357, population: 21750020 },
  { name: "Mexico City Metro", country: "Mexico", latitude: 19.4326, longitude: -99.1332, population: 21804515 },
  { name: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074, population: 21766214 },
  { name: "Mumbai", country: "India", latitude: 19.0760, longitude: 72.8777, population: 20667656 },
  { name: "Osaka", country: "Japan", latitude: 34.6937, longitude: 135.5023, population: 18967459 },
  { name: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011, population: 16459472 },
  { name: "Chongqing", country: "China", latitude: 29.4316, longitude: 106.9123, population: 16382376 },
  { name: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784, population: 15636243 },
  { name: "Buenos Aires Metro", country: "Argentina", latitude: -34.6118, longitude: -58.3960, population: 15624000 },
  { name: "Kolkata", country: "India", latitude: 22.5726, longitude: 88.3639, population: 14974073 },
  { name: "Manila", country: "Philippines", latitude: 14.5995, longitude: 120.9842, population: 14808137 },
  { name: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792, population: 14368332 },
  { name: "Rio de Janeiro Metro", country: "Brazil", latitude: -22.9068, longitude: -43.1729, population: 13634274 },
  { name: "Tianjin", country: "China", latitude: 39.3434, longitude: 117.3616, population: 13589078 },
  { name: "Kinshasa", country: "DR Congo", latitude: -4.4419, longitude: 15.2663, population: 12691000 },
  { name: "Guangzhou", country: "China", latitude: 23.1291, longitude: 113.2644, population: 12458130 },
  { name: "Lahore", country: "Pakistan", latitude: 31.5204, longitude: 74.3587, population: 12642423 },
  { name: "Bangalore", country: "India", latitude: 12.9716, longitude: 77.5946, population: 12326532 },
  { name: "Shenzhen", country: "China", latitude: 22.5431, longitude: 114.0579, population: 12084391 },
  { name: "Seoul", country: "South Korea", latitude: 37.5665, longitude: 126.9780, population: 9776000 },
  { name: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456, population: 10562088 },
  { name: "Chennai", country: "India", latitude: 13.0827, longitude: 80.2707, population: 10971108 },
  { name: "Lima Metro", country: "Peru", latitude: -12.0464, longitude: -77.0428, population: 10719188 },
  { name: "Bogotá Metro", country: "Colombia", latitude: 4.7110, longitude: -74.0721, population: 10779000 },
  { name: "Ho Chi Minh City", country: "Vietnam", latitude: 10.8231, longitude: 106.6297, population: 9077158 },
  { name: "Hyderabad", country: "India", latitude: 17.3850, longitude: 78.4867, population: 10004144 },
  { name: "Wuhan", country: "China", latitude: 30.5928, longitude: 114.3055, population: 8364977 },
  { name: "Kuala Lumpur", country: "Malaysia", latitude: 3.1390, longitude: 101.6869, population: 1808259 },
  { name: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198, population: 5453566 },
  { name: "Bangkok", country: "Thailand", latitude: 13.7563, longitude: 100.5018, population: 10539415 },
  { name: "Taipei", country: "Taiwan", latitude: 25.0330, longitude: 121.5654, population: 2704810 },
  { name: "Hong Kong", country: "China", latitude: 22.3193, longitude: 114.1694, population: 7428887 },

  // Middle East
  { name: "Tehran", country: "Iran", latitude: 35.6892, longitude: 51.3890, population: 8693706 },
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708, population: 3331420 },
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753, population: 7009639 },
  { name: "Baghdad", country: "Iraq", latitude: 33.3152, longitude: 44.3661, population: 7216000 },

  // Africa
  { name: "Johannesburg", country: "South Africa", latitude: -26.2041, longitude: 28.0473, population: 4803262 },
  { name: "Cape Town", country: "South Africa", latitude: -33.9249, longitude: 18.4241, population: 4617560 },
  { name: "Alexandria", country: "Egypt", latitude: 31.2001, longitude: 29.9187, population: 5200000 },
  { name: "Casablanca", country: "Morocco", latitude: 33.5731, longitude: -7.5898, population: 3359818 },
  { name: "Addis Ababa", country: "Ethiopia", latitude: 9.1450, longitude: 38.7451, population: 3352000 },
  { name: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219, population: 4922000 },

  // Oceania
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093, population: 5312163 },
  { name: "Melbourne", country: "Australia", latitude: -37.8136, longitude: 144.9631, population: 5061439 },
  { name: "Brisbane", country: "Australia", latitude: -27.4698, longitude: 153.0251, population: 2568927 },
  { name: "Perth", country: "Australia", latitude: -31.9505, longitude: 115.8605, population: 2192229 },
  { name: "Auckland", country: "New Zealand", latitude: -36.8485, longitude: 174.7633, population: 1657200 },
];

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export interface AffectedCity extends City {
  distance: number;
  damageLevel: 'severe' | 'moderate' | 'light';
  estimatedCasualties: number;
  survivalRate: number;
}

/**
 * Find cities affected by the impact within damage radii
 */
export function findAffectedCities(
  impactLat: number,
  impactLng: number,
  damageRadii: {
    severe: number;
    moderate: number;
    light: number;
  }
): AffectedCity[] {
  const affectedCities: AffectedCity[] = [];

  WORLD_CITIES.forEach(city => {
    const distance = calculateDistance(impactLat, impactLng, city.latitude, city.longitude);
    
    let damageLevel: 'severe' | 'moderate' | 'light' | null = null;
    let estimatedCasualties = 0;
    let survivalRate = 1.0;

    if (distance <= damageRadii.severe) {
      damageLevel = 'severe';
      estimatedCasualties = Math.round(city.population * 0.8); // 80% casualties in severe zone
      survivalRate = 0.2;
    } else if (distance <= damageRadii.moderate) {
      damageLevel = 'moderate';
      estimatedCasualties = Math.round(city.population * 0.3); // 30% casualties in moderate zone
      survivalRate = 0.7;
    } else if (distance <= damageRadii.light) {
      damageLevel = 'light';
      estimatedCasualties = Math.round(city.population * 0.05); // 5% casualties in light zone
      survivalRate = 0.95;
    }

    if (damageLevel) {
      affectedCities.push({
        ...city,
        distance,
        damageLevel,
        estimatedCasualties,
        survivalRate
      });
    }
  });

  // Sort by damage level (severe first) then by distance
  return affectedCities.sort((a, b) => {
    const damageOrder = { severe: 0, moderate: 1, light: 2 };
    if (damageOrder[a.damageLevel] !== damageOrder[b.damageLevel]) {
      return damageOrder[a.damageLevel] - damageOrder[b.damageLevel];
    }
    return a.distance - b.distance;
  });
}