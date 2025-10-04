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

    const prompt = `You are an expert asteroid impact physicist. Analyze the following asteroid impact scenario and provide ONLY the numerical data in JSON format. Do not include any explanatory text, just the JSON object.

Scenario:
- Asteroid: ${asteroidName}
- Diameter: ${asteroidDiameter} km
- Velocity: ${asteroidVelocity} km/s
- Impact Location: ${locationName} (${lat}°, ${lng}°)
- Impact Angle: ${impactAngle}°
- Hazardous Classification: ${hazardous ? 'Yes' : 'No'}

Calculate and return ONLY this JSON structure with precise numerical values:

{
  "impactEnergy": <energy in megatons TNT>,
  "craterDiameter": <crater diameter in kilometers>,
  "craterDepth": <crater depth in kilometers>,
  "damageRadii": {
    "severe": <severe damage radius in km>,
    "moderate": <moderate damage radius in km>,
    "light": <light damage radius in km>
  },
  "estimatedCasualties": <estimated immediate casualties>,
  "tsunamiRisk": <true/false>,
  "earthquakeMagnitude": <Richter scale magnitude>,
  "airblastRadius": <airblast radius in km>,
  "thermalRadius": <thermal damage radius in km>,
  "debrisField": <debris field radius in km>,
  "impactVelocityAtSurface": <final velocity in km/s>,
  "impactMass": <asteroid mass in kg>,
  "energyJoules": <energy in joules>,
  "equivalentNukes": <equivalent nuclear weapons>,
  "affectedArea": <total affected area in km²>
}

Provide ONLY the JSON object, no other text.`;

    // Generate response using Gemini
    console.log('Initializing Gemini model...');
    // Using Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
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
      console.log('Falling back to basic calculations...');
      // Fallback to basic calculations if Gemini parsing fails
      const diameter = parseFloat(asteroidDiameter);
      const velocity = parseFloat(asteroidVelocity);
      const mass = (Math.PI / 6) * Math.pow(diameter * 1000, 3) * 3000; // kg
      const energyJoules = 0.5 * mass * Math.pow(velocity * 1000, 2);
      const energyMt = energyJoules / (4.184e15);
      
      impactData = {
        impactEnergy: energyMt,
        craterDiameter: Math.pow(energyMt, 0.32) * 1.8,
        craterDepth: Math.pow(energyMt, 0.32) * 0.6,
        damageRadii: {
          severe: Math.pow(energyMt, 0.33) * 5,
          moderate: Math.pow(energyMt, 0.33) * 12,
          light: Math.pow(energyMt, 0.33) * 25
        },
        estimatedCasualties: Math.floor(Math.pow(energyMt, 0.7) * 10000),
        tsunamiRisk: velocity > 15 && (lat < 10 || lat > -10),
        earthquakeMagnitude: Math.min(9.5, 4 + Math.log10(energyMt)),
        airblastRadius: Math.pow(energyMt, 0.33) * 15,
        thermalRadius: Math.pow(energyMt, 0.4) * 8,
        debrisField: Math.pow(energyMt, 0.25) * 50,
        impactVelocityAtSurface: velocity * 0.85,
        impactMass: mass,
        energyJoules: energyJoules,
        equivalentNukes: energyMt / 0.015,
        affectedArea: Math.PI * Math.pow(Math.pow(energyMt, 0.33) * 25, 2)
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