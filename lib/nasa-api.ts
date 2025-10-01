const BASE_URL = "https://api.nasa.gov/neo/rest/v1";

export interface Asteroid {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data?: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

export interface AsteroidResponse {
  near_earth_objects: Asteroid[];
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
}

// Server-side function to fetch asteroids (used in API routes)
export const fetchAsteroidsFromNASA = async (
  apiKey: string,
  page: number = 0,
  size: number = 20
): Promise<AsteroidResponse> => {
  try {
    const url = `${BASE_URL}/neo/browse?api_key=${apiKey}&page=${page}&size=${size}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error(`429 Rate limit exceeded. The DEMO_KEY has limited requests per hour. Get your free API key from https://api.nasa.gov/`);
      }
      if (res.status === 403) {
        throw new Error(`403 Forbidden. Invalid API key. Please check your NASA_API_KEY in .env.local`);
      }
      throw new Error(`${res.status} NASA API error: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching asteroids from NASA:", error);
    throw error;
  }
};

// Mock data for when NASA API is unavailable
const getMockAsteroids = (): AsteroidResponse => ({
  near_earth_objects: [
    {
      id: "2465633",
      name: "(2009 JF1)",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2465633",
      absolute_magnitude_h: 23.2,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.0109,
          estimated_diameter_max: 0.0244
        }
      },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [{
        close_approach_date: "2022-05-09",
        relative_velocity: {
          kilometers_per_hour: "48978.6"
        },
        miss_distance: {
          kilometers: "4208086.5"
        }
      }]
    },
    {
      id: "3542519",
      name: "(2010 PK9)",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3542519",
      absolute_magnitude_h: 21.0,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.11,
          estimated_diameter_max: 0.25
        }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: "2022-07-23",
        relative_velocity: {
          kilometers_per_hour: "61155.0"
        },
        miss_distance: {
          kilometers: "1908227.9"
        }
      }]
    },
    {
      id: "54016154",
      name: "(2020 SO)",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=54016154",
      absolute_magnitude_h: 28.6,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.005,
          estimated_diameter_max: 0.012
        }
      },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [{
        close_approach_date: "2020-12-01",
        relative_velocity: {
          kilometers_per_hour: "2336.3"
        },
        miss_distance: {
          kilometers: "50394.4"
        }
      }]
    }
  ],
  page: {
    size: 20,
    total_elements: 3,
    total_pages: 1,
    number: 0
  },
  links: {
    self: "/api/asteroids?page=0&size=20"
  }
});

// Client-side function to fetch from our API route
export const fetchAsteroids = async (
  page: number = 0,
  size: number = 20
): Promise<AsteroidResponse> => {
  try {
    const res = await fetch(`/api/asteroids?page=${page}&size=${size}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      
      // If it's a rate limit or API key issue, provide mock data with a warning
      if (res.status === 429 || res.status === 403) {
        console.warn('NASA API unavailable, using mock data for demonstration');
        const mockData = getMockAsteroids();
        // Add a flag to indicate this is mock data
        (mockData as any)._isMockData = true;
        return mockData;
      }
      
      throw new Error(errorData.error || "Failed to fetch asteroids");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching asteroids:", error);
    
    // If all else fails, return mock data for demonstration
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      console.warn('Network error, using mock data for demonstration');
      const mockData = getMockAsteroids();
      (mockData as any)._isMockData = true;
      return mockData;
    }
    
    throw error;
  }
};

export const calculateImpactEnergy = (
  diameter: number,
  velocity: number,
  density: number = 2600
): number => {
  const radius = diameter / 2;
  const volume = (4 / 3) * Math.PI * Math.pow(radius * 1000, 3);
  const mass = volume * density;
  const kineticEnergy = 0.5 * mass * Math.pow(velocity * 1000, 2);
  const megatons = kineticEnergy / 4.184e15;
  return megatons;
};

export const calculateCraterSize = (
  diameter: number,
  velocity: number,
  angle: number = 45
): { radius: number; depth: number } => {
  const energy = calculateImpactEnergy(diameter, velocity);
  const radius = Math.pow(energy, 0.25) * 0.6;
  const depth = radius / 3;
  return { radius, depth };
};

export const getImpactEffects = (energy: number) => {
  if (energy < 1) {
    return {
      climate: "Minimal climate impact. Localized dust and debris.",
      biodiversity: "Minimal effect on wildlife. Possible injuries to nearby animals.",
      affectedArea: "< 1 km radius",
    };
  } else if (energy < 100) {
    return {
      climate: "Local climate disruption. Dust in atmosphere for weeks.",
      biodiversity: "Significant wildlife casualties in impact zone.",
      affectedArea: "1-10 km radius",
    };
  } else if (energy < 10000) {
    return {
      climate: "Regional climate effects. Dust blocking sunlight for months.",
      biodiversity: "Mass extinction event for local species. Food chain disruption.",
      affectedArea: "10-100 km radius",
    };
  } else {
    return {
      climate: "Global climate catastrophe. Nuclear winter scenario. Years of darkness.",
      biodiversity: "Mass extinction event. 70%+ of species at risk.",
      affectedArea: "Global impact",
    };
  }
};
