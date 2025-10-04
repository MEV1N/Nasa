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
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let analysis;
    try {
      console.log('Sending prompt to Gemini...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      analysis = response.text();
      console.log('Received response from Gemini');
    } catch (geminiError) {
      console.log('Gemini API error:', geminiError);
      // Provide a fallback analysis
      analysis = `## Asteroid Impact Analysis

**Asteroid**: ${asteroid.name}
**Diameter**: ${asteroid.diameter} meters
**Velocity**: ${asteroid.velocity} km/s
**Location**: ${location.name} (${location.lat}°, ${location.lng}°)

### Impact Assessment

**Energy Release**: ${impactData.energyMt} megatons TNT equivalent
**Crater Diameter**: ${impactData.craterDiameter} meters

### Damage Zones
- **Severe Damage**: ${impactData.radii.severe} km radius
- **Moderate Damage**: ${impactData.radii.moderate} km radius
- **Light Damage**: ${impactData.radii.light} km radius

### Population Impact
${impactData.summary ? `
- **Affected Population**: ${impactData.summary.totalPopulation.toLocaleString()}
- **Estimated Fatalities**: ${impactData.summary.totalFatalities.toLocaleString()}
- **Estimated Injuries**: ${impactData.summary.totalInjuries.toLocaleString()}
- **Affected Area**: ${impactData.summary.affectedArea.toFixed(0)} km²
` : ''}
### Scientific Assessment

This impact would create significant regional devastation. The energy release is comparable to a major volcanic eruption or large nuclear weapon. The crater formation would permanently alter the local geography, while atmospheric effects could influence regional climate patterns.

**Note**: Analysis generated using fallback calculations due to AI service limitations.`;
    }

    if (!analysis) {
      throw new Error('No analysis received from Gemini or fallback');
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