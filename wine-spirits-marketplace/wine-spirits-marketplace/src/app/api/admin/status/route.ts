import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if API key is configured (don't expose the actual key)
    const apiKey = process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      openaiConfigured: !!apiKey,
      model: 'gpt-4o-mini'
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
} 