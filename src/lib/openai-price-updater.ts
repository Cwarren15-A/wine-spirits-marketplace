// OpenAI Price Updater Service
// Uses OpenAI API to generate realistic price movements and market updates

import { products } from './products';
import type { Product } from './api';

interface PriceUpdate {
  productId: string;
  newPrice: number;
  priceChange24h: number;
  marketReason?: string;
  confidence: number;
}

interface MarketUpdate {
  timestamp: string;
  updates: PriceUpdate[];
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  totalProductsUpdated: number;
}

class OpenAIPriceUpdater {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePriceUpdates(productSubset?: Product[]): Promise<MarketUpdate> {
    const productsToUpdate = productSubset || this.selectRandomProducts();
    
    try {
      const prompt = this.buildPriceUpdatePrompt(productsToUpdate);
      const response = await this.callOpenAI(prompt);
      const updates = this.parsePriceUpdates(response, productsToUpdate);
      
      return {
        timestamp: new Date().toISOString(),
        updates,
        marketSentiment: this.calculateMarketSentiment(updates),
        totalProductsUpdated: updates.length
      };
    } catch (error) {
      console.error('Error generating price updates:', error);
      return this.generateFallbackUpdates(productsToUpdate);
    }
  }

  private selectRandomProducts(count: number = 8): Product[] {
    // Select a mix of price ranges for realistic market movement
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private buildPriceUpdatePrompt(products: Product[]): string {
    const productSummaries = products.map(p => 
      `${p.name} (${p.producer}) - Current: $${p.current_price || p.base_price} - Type: ${p.type} - Region: ${p.region}`
    ).join('\n');

    return `You are a wine and spirits market analyst. Generate realistic price movements for these luxury products based on current market conditions, seasonality, and typical collector behavior.

Products to update:
${productSummaries}

Please provide price updates in this JSON format:
{
  "updates": [
    {
      "productName": "Product Name",
      "newPrice": 1250.00,
      "priceChangePercent": 2.3,
      "reason": "Strong auction results for this vintage",
      "confidence": 0.85
    }
  ],
  "marketSentiment": "bullish",
  "marketNotes": "Brief market commentary"
}

Guidelines:
- Price changes should be realistic: -5% to +8% for most products
- Rare/collectible items can have larger swings: -10% to +15%
- Consider seasonal patterns (holidays, harvest seasons)
- Factor in wine/spirits type, age, rarity, and producer reputation
- Provide brief, realistic market reasons
- Confidence should reflect volatility (rare items = lower confidence)
- Mix of positive and negative movements for realism`;
  }

  private async callOpenAI(prompt: string): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert wine and spirits market analyst with deep knowledge of luxury collectibles pricing, auction results, and market trends.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private parsePriceUpdates(aiResponse: any, products: Product[]): PriceUpdate[] {
    const updates: PriceUpdate[] = [];
    
    for (const update of aiResponse.updates || []) {
      const product = products.find(p => 
        p.name.toLowerCase().includes(update.productName.toLowerCase()) ||
        update.productName.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (product) {
        const currentPrice = product.current_price || product.base_price;
        const newPrice = Math.round(update.newPrice * 100) / 100;
        const priceChange = ((newPrice - currentPrice) / currentPrice) * 100;
        
        updates.push({
          productId: product.id,
          newPrice,
          priceChange24h: Math.round(priceChange * 100) / 100,
          marketReason: update.reason,
          confidence: update.confidence || 0.75
        });
      }
    }
    
    return updates;
  }

  private calculateMarketSentiment(updates: PriceUpdate[]): 'bullish' | 'bearish' | 'neutral' {
    if (updates.length === 0) return 'neutral';
    
    const avgChange = updates.reduce((sum, update) => sum + update.priceChange24h, 0) / updates.length;
    
    if (avgChange > 1.5) return 'bullish';
    if (avgChange < -1.5) return 'bearish';
    return 'neutral';
  }

  private generateFallbackUpdates(products: Product[]): MarketUpdate {
    // Fallback realistic price movements if OpenAI fails
    const updates: PriceUpdate[] = products.slice(0, 5).map(product => {
      const currentPrice = product.current_price || product.base_price;
      const changePercent = (Math.random() - 0.5) * 8; // -4% to +4%
      const newPrice = Math.round(currentPrice * (1 + changePercent / 100) * 100) / 100;
      
      return {
        productId: product.id,
        newPrice,
        priceChange24h: Math.round(changePercent * 100) / 100,
        marketReason: 'Market fluctuation',
        confidence: 0.6
      };
    });

    return {
      timestamp: new Date().toISOString(),
      updates,
      marketSentiment: 'neutral',
      totalProductsUpdated: updates.length
    };
  }

  // Apply updates to product data (in production, this would update your database)
  applyUpdates(marketUpdate: MarketUpdate): Product[] {
    const updatedProducts = [...products];
    
    for (const update of marketUpdate.updates) {
      const productIndex = updatedProducts.findIndex(p => p.id === update.productId);
      if (productIndex !== -1) {
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          current_price: update.newPrice,
          price_change_24h: update.priceChange24h,
          updated_at: new Date()
        };
      }
    }
    
    return updatedProducts;
  }

  // Generate market commentary
  async generateMarketCommentary(): Promise<string> {
    try {
      const prompt = `Generate a brief, professional market update for a luxury wine and spirits marketplace. 
      
      Include:
      - Current market sentiment
      - Notable trends (vintage performance, regional highlights, etc.)
      - Seasonal factors affecting pricing
      - 2-3 sentences maximum
      - Professional, insider tone
      
      Format as a single paragraph suitable for a marketplace dashboard.`;

      const response = await this.callOpenAI(prompt);
      return response.commentary || "Market showing steady activity across premium wine and spirits categories.";
    } catch (error) {
      return "Market conditions remain stable with continued interest in premium collectibles.";
    }
  }
}

// Singleton instance
let priceUpdater: OpenAIPriceUpdater | null = null;

export function initializePriceUpdater(apiKey: string): OpenAIPriceUpdater {
  priceUpdater = new OpenAIPriceUpdater(apiKey);
  return priceUpdater;
}

export function getPriceUpdater(): OpenAIPriceUpdater | null {
  return priceUpdater;
}

// Utility functions for scheduled updates
export async function runScheduledPriceUpdate(apiKey: string): Promise<MarketUpdate> {
  const updater = initializePriceUpdater(apiKey);
  return await updater.generatePriceUpdates();
}

export async function getMarketInsights(apiKey: string): Promise<{
  commentary: string;
  updates: MarketUpdate;
}> {
  const updater = initializePriceUpdater(apiKey);
  
  const [commentary, updates] = await Promise.all([
    updater.generateMarketCommentary(),
    updater.generatePriceUpdates()
  ]);
  
  return { commentary, updates };
}
