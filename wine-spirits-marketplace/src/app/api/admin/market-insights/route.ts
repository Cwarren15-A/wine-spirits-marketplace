import { NextResponse } from 'next/server';
import { getMarketInsights } from '@/lib/openai-price-updater';

export async function POST() {
  try {
    // Get API key from server-side environment variable (not exposed to client)
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Get market insights
    const insights = await getMarketInsights(apiKey);
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Market insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate market insights' },
      { status: 500 }
    );
  }
} 