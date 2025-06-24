// Price Service for Wine & Spirits Marketplace
export interface PriceHistory {
  points: Array<{ price: number; timestamp: string; }>;
}

export async function getPriceHistory(
  productId: string,
  slug: string,
  type: "wine" | "spirits"
): Promise<PriceHistory> {
  // Mock implementation - replace with actual API call
  const now = new Date();
  const points = [];
  
  // Generate 60 days of mock price history
  for (let i = 59; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic price fluctuations
    const basePrice = 920;
    const variation = (Math.sin(i / 10) * 20) + (Math.random() - 0.5) * 40;
    const price = basePrice + variation;
    
    points.push({
      price: Math.max(price, basePrice * 0.8), // Don't go below 80% of base
      timestamp: date.toISOString()
    });
  }
  
  return { points };
}

export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

export function calculateCompoundAnnualGrowthRate(
  startPrice: number,
  endPrice: number,
  years: number
): number {
  if (startPrice === 0 || years === 0) return 0;
  return (Math.pow(endPrice / startPrice, 1 / years) - 1) * 100;
}

export function getPriceVolatility(priceHistory: PriceHistory): number {
  if (priceHistory.points.length < 2) return 0;
  
  const prices = priceHistory.points.map(p => p.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  const variance = prices.reduce((sum, price) => {
    return sum + Math.pow(price - mean, 2);
  }, 0) / prices.length;
  
  return Math.sqrt(variance) / mean * 100; // Coefficient of variation as percentage
} 