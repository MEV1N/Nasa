import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    console.log('Gemini API route called');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    
    // Initialize Gemini AI inside the function to catch errors
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    console.log('Gemini AI initialized successfully');
    
    const requestData = await request.json();
    console.log('Request data:', requestData);
    
    const { asteroidName, asteroidDiameter, asteroidVelocity, locationName, lat, lng, impactAngle, hazardous } = requestData;

    if (!asteroidName || !locationName || !lat || !lng) {
      console.log('Missing required parameters');
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found');
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a leading expert in asteroid impact physics and planetary science. Use advanced scientific models and precise calculations to analyze this asteroid impact scenario. Apply Collins et al. (2005) scaling laws, Holsapple & Housen crater formation models, and atmospheric physics for accurate results.

CRITICAL: Provide ONLY the JSON object with precise numerical calculations. No explanatory text.

Impact Scenario:
- Asteroid Name: ${asteroidName}
- Diameter: ${asteroidDiameter} km
- Impact Velocity: ${asteroidVelocity} km/s
- Geographic Location: ${locationName} (${lat}°, ${lng}°)
- Impact Angle: ${impactAngle}° from horizontal
- Hazard Classification: ${hazardous ? 'Potentially Hazardous Asteroid' : 'Non-Hazardous'}

Environmental Context:
- Surface Type: ${Math.abs(lat) < 60 && Math.abs(lng) < 50 ? 'Continental crust' : 'Oceanic/Mixed terrain'}
- Population Density: ${Math.abs(lat) < 40 ? 'High' : 'Moderate'}
- Terrain: Consider elevation, urban density, and geological composition

Apply these scientific methodologies:
1. Mass calculation using density 2.6-3.5 g/cm³ (S-type/C-type asteroids)
2. Kinetic energy with atmospheric entry losses
3. Crater scaling using π-scaling for complex craters
4. Overpressure calculations for blast damage
5. Thermal radiation effects and ignition thresholds
6. Seismic energy conversion (1-10% of kinetic energy)
7. Ejecta ballistics and secondary crater formation
8. Atmospheric effects and global climate impact

Return ONLY this JSON with maximum precision:

{
  "impactEnergy": <total energy in megatons TNT equivalent>,
  "craterDiameter": <final crater diameter in km using complex crater scaling>,
  "craterDepth": <crater depth in km (D/d ratio ~5-7 for complex craters)>,
  "damageRadii": {
    "severe": <radius in km where overpressure >100 kPa (complete destruction)>,
    "moderate": <radius in km where overpressure 10-100 kPa (heavy damage)>,
    "light": <radius in km where overpressure 1-10 kPa (light damage/glass breakage)>
  },
  "estimatedCasualties": <immediate fatalities using population density models>,
  "tsunamiRisk": <true if impact in water bodies, false otherwise>,
  "earthquakeMagnitude": <equivalent Richter magnitude from seismic energy>,
  "airblastRadius": <maximum radius of significant airblast effects in km>,
  "thermalRadius": <radius of 1st/2nd degree burns from thermal radiation in km>,
  "debrisField": <ejecta distribution radius in km>,
  "impactVelocityAtSurface": <final velocity after atmospheric deceleration in km/s>,
  "impactMass": <asteroid mass in kg>,
  "energyJoules": <total kinetic energy in joules>,
  "equivalentNukes": <equivalent number of Hiroshima bombs (15 kt each)>,
  "affectedArea": <total area experiencing >1 kPa overpressure in km²>,
  "globalEffects": {
    "dustInjection": <dust mass injected into stratosphere in kg>,
    "temperatureDrop": <global average temperature drop in Celsius>,
    "ozoneDepletion": <percentage ozone layer depletion>,
    "acidRain": <affected area of acid rain in km²>
  },
  "economicImpact": <estimated economic damage in billions USD>,
  "recoveryTime": <estimated recovery time for affected region in years>
}

Provide ONLY the JSON object with no additional text or formatting.`;

    // Generate response using Gemini
    console.log('Initializing Gemini model...');
    // Using Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let impactData;
    try {
      console.log('Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log('Received response from Gemini');

      const rawText = response.text();
      // Extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        impactData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed Gemini response');
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (geminiError) {
      console.error('Gemini API or parsing error:', geminiError);
      console.log('Falling back to enhanced scientific calculations...');
      
      // Enhanced precision fallback calculations using scientific models
      const diameter = parseFloat(asteroidDiameter) * 1000; // Convert to meters
      const velocity = parseFloat(asteroidVelocity) * 1000; // Convert to m/s
      const angle = impactAngle * Math.PI / 180; // Convert to radians
      
      // Density estimation based on asteroid type (2600-3500 kg/m³)
      const density = hazardous ? 3200 : 2800; // Hazardous tend to be denser
      
      // Mass calculation with spherical approximation
      const volume = (Math.PI / 6) * Math.pow(diameter, 3);
      const mass = density * volume;
      
      // Atmospheric entry effects (velocity reduction)
      const atmosphericFactor = diameter > 100 ? 0.95 : (diameter > 10 ? 0.85 : 0.70);
      const surfaceVelocity = velocity * atmosphericFactor;
      
      // Kinetic energy (with atmospheric losses)
      const energyJoules = 0.5 * mass * Math.pow(surfaceVelocity, 2);
      const energyMt = energyJoules / (4.184e15); // Convert to megatons TNT
      
      // Crater scaling using Collins et al. (2005) - complex crater formation
      const gravity = 9.81;
      const targetDensity = 2600; // Average crustal density
      const craterDiameter = 1.161 * Math.pow(energyJoules / (gravity * targetDensity), 0.22) * Math.pow(Math.sin(angle), 0.33);
      const craterDepth = craterDiameter / 6.5; // Depth-to-diameter ratio for complex craters
      
      // Overpressure damage zones (using TNT blast scaling)
      const cubeRootEnergy = Math.pow(energyMt * 1000, 1/3); // Convert to kilotons for scaling
      const severeRadius = cubeRootEnergy * 0.54; // >100 kPa overpressure
      const moderateRadius = cubeRootEnergy * 1.78; // 10-100 kPa overpressure  
      const lightRadius = cubeRootEnergy * 4.71; // 1-10 kPa overpressure
      
      // Thermal radiation effects
      const thermalRadius = Math.pow(energyMt, 0.4) * 7.2; // 1st/2nd degree burns
      
      // Airblast radius (significant structural damage)
      const airblastRadius = cubeRootEnergy * 2.1;
      
      // Seismic effects (1-5% of kinetic energy converts to seismic)
      const seismicEnergy = energyJoules * 0.03;
      const earthquakeMagnitude = Math.min(9.8, (2/3) * Math.log10(seismicEnergy) - 2.9);
      
      // Ejecta and debris field
      const debrisRadius = Math.pow(craterDiameter, 1.3) * 5; // Ejecta blanket
      
      // Population impact estimation (rough approximation)
      const populationDensity = Math.abs(lat) < 30 ? 150 : 50; // people per km²
      const affectedPopulation = Math.PI * Math.pow(moderateRadius, 2) * populationDensity;
      const casualtyRate = energyMt > 1000 ? 0.3 : (energyMt > 100 ? 0.15 : 0.05);
      const estimatedCasualties = Math.floor(affectedPopulation * casualtyRate);
      
      // Tsunami risk assessment
      const tsunamiRisk = (Math.abs(lat) < 60) && (surfaceVelocity/1000 > 12) && (diameter > 200);
      
      // Global effects estimation
      const dustMass = Math.pow(energyMt, 0.8) * 1e9; // kg of dust into atmosphere
      const tempDrop = energyMt > 1000 ? Math.log10(energyMt) * 0.8 : 0; // Global cooling
      const ozoneDepletion = energyMt > 10000 ? Math.min(25, Math.log10(energyMt) * 3) : 0;
      const acidRainArea = Math.PI * Math.pow(lightRadius * 2, 2);
      
      // Economic impact (very rough estimate)
      const economicImpact = affectedPopulation * 0.15; // $150k per affected person
      
      // Recovery time estimation
      const recoveryYears = energyMt > 1000 ? Math.min(50, Math.log10(energyMt) * 8) : Math.max(2, Math.log10(energyMt + 1) * 3);
      
      impactData = {
        impactEnergy: parseFloat(energyMt.toFixed(6)),
        craterDiameter: parseFloat((craterDiameter / 1000).toFixed(3)), // Convert to km
        craterDepth: parseFloat((craterDepth / 1000).toFixed(3)), // Convert to km
        damageRadii: {
          severe: parseFloat(severeRadius.toFixed(2)),
          moderate: parseFloat(moderateRadius.toFixed(2)),
          light: parseFloat(lightRadius.toFixed(2))
        },
        estimatedCasualties: Math.floor(estimatedCasualties),
        tsunamiRisk: tsunamiRisk,
        earthquakeMagnitude: parseFloat(earthquakeMagnitude.toFixed(2)),
        airblastRadius: parseFloat(airblastRadius.toFixed(2)),
        thermalRadius: parseFloat(thermalRadius.toFixed(2)),
        debrisField: parseFloat(debrisRadius.toFixed(1)),
        impactVelocityAtSurface: parseFloat((surfaceVelocity / 1000).toFixed(2)), // Convert back to km/s
        impactMass: Math.floor(mass),
        energyJoules: parseFloat(energyJoules.toExponential(3)),
        equivalentNukes: Math.floor(energyMt / 0.015), // Hiroshima bombs (15 kt each)
        affectedArea: parseFloat((Math.PI * Math.pow(lightRadius, 2)).toFixed(0)),
        globalEffects: {
          dustInjection: Math.floor(dustMass),
          temperatureDrop: parseFloat(tempDrop.toFixed(2)),
          ozoneDepletion: parseFloat(ozoneDepletion.toFixed(1)),
          acidRain: parseFloat(acidRainArea.toFixed(0))
        },
        economicImpact: parseFloat((economicImpact / 1000).toFixed(1)), // Convert to billions
        recoveryTime: parseFloat(recoveryYears.toFixed(1))
      };
    }

    return NextResponse.json({
      success: true,
      data: impactData,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Gemini impact calculation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Failed to calculate impact data',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Gemini API endpoint is working',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
}