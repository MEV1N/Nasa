import { NextRequest, NextResponse } from 'next/server';
import { fetchAsteroidsFromNASA } from '@/lib/nasa-api';

export async function GET(request: NextRequest) {
  try {
    // Get the NASA API key from environment variables
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    if (!process.env.NASA_API_KEY) {
      console.warn('NASA_API_KEY environment variable is not set, using DEMO_KEY');
      console.warn('Note: DEMO_KEY has limited requests. Get your free API key from https://api.nasa.gov/');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const size = Math.min(parseInt(searchParams.get('size') || '20'), 20); // Limit to 20 per request

    // Validate parameters
    if (page < 0 || size < 1) {
      return NextResponse.json(
        { error: 'Invalid page or size parameters' },
        { status: 400 }
      );
    }

    // Fetch data from NASA API
    const data = await fetchAsteroidsFromNASA(apiKey, page, size);

    // Return the data
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Route Error:', error);
    console.warn('NASA API unavailable, falling back to mock data for demonstration');
    
    // Import mock data function
    const { getMockAsteroids } = await import('@/lib/nasa-api');
    const mockData = getMockAsteroids();
    
    // Add a flag to indicate this is mock data
    (mockData as any)._isMockData = true;
    (mockData as any)._mockReason = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(mockData);
  }
}

// Add CORS headers if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}