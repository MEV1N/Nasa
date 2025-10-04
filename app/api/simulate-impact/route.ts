// app/api/simulate-impact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateHazardPolygons } from '@/utils/hazardPolygons';
import { calculatePopulationExposure, type PopulationExposure } from '@/utils/populationExposure';
import { calculateImpact } from '@/utils/impactPhysics';

export interface ImpactSimulationParams {
  lat: number;
  lon: number;
  diameter: number; // meters
  velocity: number; // km/s
  angle: number; // degrees
  density: number; // kg/m³
  material: string;
}

export interface ImpactZoneResult {
  zone: 'severe' | 'moderate' | 'light';
  population: number;
  fatalities: number;
  injuries: number;
  survivors: number;
  damageRadius: number; // km
}

export interface ComprehensiveImpactResult {
  impactLocation: {
    lat: number;
    lon: number;
  };
  asteroidData: {
    diameter: number;
    velocity: number;
    angle: number;
    density: number;
    material: string;
  };
  physicsResults: {
    energyMt: number;
    craterDiameter: number;
    radii: {
      severe: number;
      moderate: number;
      light: number;
    };
  };
  hazardPolygons: any[];
  populationAnalysis: PopulationExposure;
  zoneResults: ImpactZoneResult[];
  summary: {
    totalPopulation: number;
    totalFatalities: number;
    totalInjuries: number;
    totalSurvivors: number;
    affectedArea: number; // km²
  };
}

/**
 * Main impact simulation function that combines all components
 */
async function simulateImpact(
  lat: number, 
  lon: number, 
  asteroidParams: Omit<ImpactSimulationParams, 'lat' | 'lon'>
): Promise<ComprehensiveImpactResult> {
  
  // Step 1: Calculate basic impact physics
  const physicsResults = calculateImpact({
    diameter: asteroidParams.diameter,
    velocity: asteroidParams.velocity,
    angle: asteroidParams.angle,
    density: asteroidParams.density,
  });

  // Step 2: Generate hazard polygons based on damage radii
  const hazardPolygons = generateHazardPolygons(lat, lon, {
    diameter: asteroidParams.diameter,
    velocity: asteroidParams.velocity,
    angle: asteroidParams.angle,
    density: asteroidParams.density
  });

  // Step 3: Calculate population exposure for each zone
  const populationAnalysis = await calculatePopulationExposure(
    hazardPolygons,
    { lat, lng: lon }
    // Note: Raster data URL would be passed here in production
    // e.g., "/data/worldpop_100m.tif"
  );

  // Step 4: Create detailed zone results
  const zoneResults: ImpactZoneResult[] = populationAnalysis.casualties.map(casualty => ({
    zone: casualty.zone,
    population: casualty.population,
    fatalities: casualty.fatalities,
    injuries: casualty.injuries,
    survivors: casualty.survivors,
    damageRadius: physicsResults.radii[casualty.zone]
  }));

  // Step 5: Calculate affected area (π * r²)
  const maxRadius = Math.max(...Object.values(physicsResults.radii));
  const affectedArea = Math.PI * maxRadius * maxRadius;

  // Step 6: Compile comprehensive results
  const result: ComprehensiveImpactResult = {
    impactLocation: { lat, lon },
    asteroidData: {
      diameter: asteroidParams.diameter,
      velocity: asteroidParams.velocity,
      angle: asteroidParams.angle,
      density: asteroidParams.density,
      material: asteroidParams.material,
    },
    physicsResults,
    hazardPolygons,
    populationAnalysis,
    zoneResults,
    summary: {
      totalPopulation: populationAnalysis.totalPopulation,
      totalFatalities: populationAnalysis.summary.totalFatalities,
      totalInjuries: populationAnalysis.summary.totalInjuries,
      totalSurvivors: populationAnalysis.summary.totalSurvivors,
      affectedArea,
    }
  };

  return result;
}

/**
 * POST endpoint for comprehensive impact simulation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required parameters
    const { lat, lon, diameter, velocity, angle, density, material } = body;
    
    if (!lat || !lon || !diameter || !velocity) {
      return NextResponse.json({
        error: 'Missing required parameters: lat, lon, diameter, velocity',
        required: ['lat', 'lon', 'diameter', 'velocity', 'angle', 'density', 'material']
      }, { status: 400 });
    }

    // Set defaults for optional parameters
    const params: ImpactSimulationParams = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      diameter: parseFloat(diameter),
      velocity: parseFloat(velocity),
      angle: angle ? parseFloat(angle) : 45,
      density: density ? parseFloat(density) : 3000,
      material: material || 'rocky'
    };

    // Validate parameter ranges
    if (params.lat < -90 || params.lat > 90) {
      return NextResponse.json({ error: 'Latitude must be between -90 and 90' }, { status: 400 });
    }
    
    if (params.lon < -180 || params.lon > 180) {
      return NextResponse.json({ error: 'Longitude must be between -180 and 180' }, { status: 400 });
    }

    if (params.diameter <= 0 || params.velocity <= 0) {
      return NextResponse.json({ error: 'Diameter and velocity must be positive numbers' }, { status: 400 });
    }

    // Run comprehensive simulation
    const results = await simulateImpact(params.lat, params.lon, {
      diameter: params.diameter,
      velocity: params.velocity,
      angle: params.angle,
      density: params.density,
      material: params.material
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Impact simulation error:', error);
    return NextResponse.json({
      error: 'Internal server error during impact simulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint for testing with query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract parameters from query string
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const diameter = searchParams.get('diameter');
    const velocity = searchParams.get('velocity');
    const angle = searchParams.get('angle');
    const density = searchParams.get('density');
    const material = searchParams.get('material');

    if (!lat || !lon || !diameter || !velocity) {
      return NextResponse.json({
        error: 'Missing required parameters',
        required: ['lat', 'lon', 'diameter', 'velocity'],
        optional: ['angle', 'density', 'material'],
        example: '/api/simulate-impact?lat=40.7128&lon=-74.0060&diameter=100&velocity=20&angle=45&density=3000&material=rocky'
      }, { status: 400 });
    }

    const params: ImpactSimulationParams = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      diameter: parseFloat(diameter),
      velocity: parseFloat(velocity),
      angle: angle ? parseFloat(angle) : 45,
      density: density ? parseFloat(density) : 3000,
      material: material || 'rocky'
    };

    const results = await simulateImpact(params.lat, params.lon, {
      diameter: params.diameter,
      velocity: params.velocity,
      angle: params.angle,
      density: params.density,
      material: params.material
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('Impact simulation error:', error);
    return NextResponse.json({
      error: 'Internal server error during impact simulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}