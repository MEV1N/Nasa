import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Test basic Gemini connection
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const result = await model.generateContent("Say hello in JSON format: {\"message\": \"your response\"}");
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      apiKeyExists: !!process.env.GEMINI_API_KEY,
      response: text,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json(
      { 
        error: 'Gemini test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}