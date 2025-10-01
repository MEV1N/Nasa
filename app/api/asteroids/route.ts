import { NextRequest, NextResponse } from 'next/server';
import { fetchAsteroidsFromNASA } from '@/lib/nasa-api';

export async function GET(request: NextRequest) {
  try {
    // Get the NASA API key from environment variables
    const apiKey = process.env.NASA_API_KEY;
    
    if (!apiKey) {
      console.error('NASA_API_KEY environment variable is not set');
      console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('NASA')));
      console.error('Node environment:', process.env.NODE_ENV);
      console.error('Vercel environment:', process.env.VERCEL_ENV);
      
      return NextResponse.json(
        { 
          error: 'NASA API key not configured',
          message: 'Please set the NASA_API_KEY environment variable in your Vercel project settings',
          debug: {
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV,
            availableNasaKeys: Object.keys(process.env).filter(key => key.includes('NASA'))
          }
        },
        { status: 500 }
      );
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
    
    // Return appropriate error response
    if (error instanceof Error) {
      // Check for common NASA API errors
      if (error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please get your own NASA API key from https://api.nasa.gov/ and replace DEMO_KEY in .env.local',
            code: 'RATE_LIMITED'
          },
          { status: 429 }
        );
      }
      
      if (error.message.includes('403')) {
        return NextResponse.json(
          { 
            error: 'Invalid API key. Please check your NASA API key in .env.local',
            code: 'INVALID_KEY'
          },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          code: 'API_ERROR'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
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