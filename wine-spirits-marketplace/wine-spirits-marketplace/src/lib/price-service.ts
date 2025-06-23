// Price Service for Historical Market Data
// Integrates with Liv-ex (wine) and WhiskyStats (spirits) APIs

import { PriceHistory, PricePoint } from "./api";

const LIVEX = "https://api.liv-ex.com/v2/prices";
const WHISKYSTATS = "https://www.whiskystats.com/api/prices";

// Simple in-memory cache for demo (replace with Redis in production)
const priceCache = new Map<string, { data: PriceHistory; expires: number }>();

export async function getPriceHistory(
  productId: string,
  slug: string,
  category: "wine" | "spirits"
): Promise<PriceHistory> {
  // Check cache first
  const cached = priceCache.get(`ph:${productId}`);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }

  try {
    const points = category === "wine" 
      ? await fetchLivex(slug)
      : await fetchWhiskystats(slug);

    const history: PriceHistory = {
      productId,
      points,
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 24 hours
    priceCache.set(`ph:${productId}`, {
      data: history,
      expires: Date.now() + (24 * 60 * 60 * 1000)
    });

    return history;
  } catch (error) {
    console.warn(`Failed to fetch price history for ${productId}:`, error);
    
    // Return mock data as fallback
    return generateMockPriceHistory(productId, category);
  }
}

async function fetchLivex(slug: string): Promise<PricePoint[]> {
  const livexKey = process.env.LIVEX_API_KEY;
  
  if (!livexKey) {
    throw new Error('LIVEX_API_KEY not configured');
  }

  const res = await fetch(`${LIVEX}?identifier=${slug}`, {
    headers: { 
      Authorization: `Bearer ${livexKey}`,
      'Content-Type': 'application/json'
    },
  });

  if (!res.ok) {
    throw new Error(`Liv-ex API error: ${res.status}`);
  }

  const json = await res.json();
  
  // Transform Liv-ex response to our format
  return json.series?.slice(-60).map((d: any) => ({
    date: d.date,
    price: d.price_usd,
  })) || [];
}

async function fetchWhiskystats(slug: string): Promise<PricePoint[]> {
  const res = await fetch(`${WHISKYSTATS}?item=${slug}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`WhiskyStats API error: ${res.status}`);
  }

  const json = await res.json();
  
  // Transform WhiskyStats response to our format
  return json.prices?.slice(-60).map((d: any) => ({
    date: d.date,
    price: d.usd,
  })) || [];
}

// Generate realistic mock price history for demo purposes
function generateMockPriceHistory(productId: string, category: "wine" | "spirits"): PriceHistory {
  const points: PricePoint[] = [];
  const basePrice = category === "wine" ? 150 : 300; // Different base prices
  const volatility = category === "wine" ? 0.15 : 0.25; // Spirits more volatile
  
  // Generate 60 days of mock price data
  for (let i = 59; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const trend = Math.sin(i / 10) * 0.1; // Long-term trend
    const noise = (Math.random() - 0.5) * volatility; // Daily volatility
    const priceMultiplier = 1 + trend + noise;
    
    points.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice * priceMultiplier * 100) / 100
    });
  }

  return {
    productId,
    points,
    lastUpdated: new Date().toISOString(),
  };
}

// Calculate percentage change over time period
export function calculatePriceChange(history: PriceHistory, days: number = 365 * 5): number {
  if (history.points.length < 2) return 0;
  
  const latestPrice = history.points[history.points.length - 1].price;
  const earliestPrice = history.points[0].price;
  
  return ((latestPrice / earliestPrice) - 1) * 100;
}

// Get recent price trend (last 30 days)
export function getRecentTrend(history: PriceHistory): 'up' | 'down' | 'stable' {
  if (history.points.length < 30) return 'stable';
  
  const recent30 = history.points.slice(-30);
  const first = recent30[0].price;
  const last = recent30[recent30.length - 1].price;
  const change = ((last / first) - 1) * 100;
  
  if (change > 2) return 'up';
  if (change < -2) return 'down';
  return 'stable';
}

// Utility to generate slug from product name (for API calls)
export function generateSlug(productName: string): string {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
} 