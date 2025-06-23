import { NextResponse } from 'next/server';
import { runScheduledPriceUpdate } from '@/lib/openai-price-updater';

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

    // Run the price update
    const update = await runScheduledPriceUpdate(apiKey);
    
    return NextResponse.json(update);
  } catch (error) {
    console.error('Price update error:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
} 