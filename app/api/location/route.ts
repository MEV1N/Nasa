import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json();
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Here you can add logic to:
    // 1. Fetch location data from a reverse geocoding API
    // 2. Store the clicked location in a database
    // 3. Get additional location information
    
    // For now, return basic location info
    const locationData = {
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      message: `Location clicked at coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };

    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Location API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Location API endpoint',
    endpoints: {
      POST: 'Send latitude and longitude to get location data'
    }
  });
}