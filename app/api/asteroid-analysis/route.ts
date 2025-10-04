import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize Gemini AI inside the function to catch errors
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    
    const { asteroid, location, impactData } = await request.json();

    if (!asteroid || !location || !impactData) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are a scientific assistant specializing in asteroid impact analysis. Provide detailed analysis of asteroid impacts including: energy calculations, crater size estimates, damage zone classifications, casualty projections, tsunami risk assessment, seismic effects, climate impact, and environmental consequences. Use scientific methodology and present findings in a structured, professional manner.

Analyze this asteroid impact scenario:

Asteroid Details:
- Name: ${asteroid.name}
- Diameter: ${asteroid.diameter} meters
- Velocity: ${asteroid.velocity} km/s
- Hazardous Classification: ${asteroid.hazardous ? 'Potentially Hazardous' : 'Non-Hazardous'}

Impact Location:
- Coordinates: ${location.lat}°, ${location.lng}°
- Location Name: ${location.name}

Impact Physics Data:
${JSON.stringify(impactData, null, 2)}

Please provide a comprehensive scientific analysis covering:
1. Impact energy and equivalence
2. Crater characteristics
3. Damage zone assessment
4. Population impact estimates
5. Secondary effects (tsunami, seismic, climate)
6. Environmental consequences

Provide a detailed, scientific analysis of this impact scenario.`;

    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    if (!analysis) {
      throw new Error('No analysis received from Gemini');
    }

    return NextResponse.json({ 
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Asteroid analysis API error:', error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate AI analysis",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to analyze asteroid impacts." },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to analyze asteroid impacts." },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to analyze asteroid impacts." },
    { status: 405 }
  );
}