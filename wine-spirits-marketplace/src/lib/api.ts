// API Library for Wine & Spirits Marketplace
export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'wine' | 'spirits' | 'beer' | 'sake';
  varietal: string;
  region: string;
  appellation?: string;
  vintage?: number;
  producer: string;
  alcohol_content: number;
  volume_ml: number;
  base_price: number;
  current_price: number;
  price_change_24h?: number;
  market_cap?: number;
  slug?: string;
  primary_image_url?: string;
  image_urls: string[];
  tasting_notes?: string;
  food_pairings?: string[];
  serving_temperature?: string;
  aging_potential?: string;
  available_quantity: number;
  minimum_order_quantity: number;
  last_traded_price?: number;
  volume_traded_24h?: number;
  featured?: boolean;
  investment_grade?: boolean;
  rarity_score?: number;
  average_rating?: number;
  total_reviews: number;
  wine_spectator_score?: number;
  robert_parker_score?: number;
  james_suckling_score?: number;
  fiveYearPriceChangePct?: number;
  price_range_52week?: { low: number; high: number };
  vineyard_location?: string;
  estate_history?: string;
  production_methods?: string;
  certifications?: string[];
  shipping_restrictions?: string[];
  seller: {
    business_name: string;
    verification_status: 'verified' | 'pending';
    seller_rating: number;
    license_number: string;
    license_state: string;
    years_in_business?: number;
    total_sales?: number;
  };
}

export interface OrderBook {
  bids: Array<{ price: number; quantity: number; }>;
  asks: Array<{ price: number; quantity: number; }>;
}

export interface PriceHistory {
  points: Array<{ price: number; timestamp: string; }>;
}

// Product API
export const productApi = {
  async getProduct(id: string): Promise<Product> {
    // Mock implementation - replace with actual API call
    return {
      id,
      name: "Château Margaux 2010",
      description: "Exceptional Bordeaux from a legendary vintage",
      type: 'wine' as const,
      varietal: "Cabernet Sauvignon Blend",
      region: "Bordeaux, France",
      vintage: 2010,
      producer: "Château Margaux",
      alcohol_content: 13.5,
      volume_ml: 750,
      base_price: 850,
      current_price: 920,
      price_change_24h: 2.5,
      slug: "chateau-margaux-2010",
      primary_image_url: "/images/wines/margaux-2010.jpg",
      image_urls: ["/images/wines/margaux-2010.jpg"],
      tasting_notes: "Rich and complex with notes of blackcurrant, cedar, and tobacco",
      food_pairings: ["Beef", "Lamb", "Game"],
      serving_temperature: "16-18°C",
      aging_potential: "2025-2045",
      available_quantity: 12,
      minimum_order_quantity: 1,
      last_traded_price: 915,
      featured: true,
      investment_grade: true,
      rarity_score: 9,
      average_rating: 4.8,
      total_reviews: 156,
      wine_spectator_score: 96,
      robert_parker_score: 98,
      fiveYearPriceChangePct: 45.2,
      price_range_52week: { low: 820, high: 950 },
      seller: {
        business_name: "Premium Wine Merchants",
        verification_status: 'verified' as const,
        seller_rating: 4.9,
        license_number: "ABC123456",
        license_state: "CA",
        years_in_business: 15,
        total_sales: 2500
      }
    };
  }
};

// Order Book API
export const orderBookApi = {
  async getMarketDepth(productId: string): Promise<OrderBook> {
    // Mock implementation
    return {
      bids: [
        { price: 915, quantity: 2 },
        { price: 910, quantity: 5 },
        { price: 905, quantity: 3 }
      ],
      asks: [
        { price: 925, quantity: 1 },
        { price: 930, quantity: 2 },
        { price: 935, quantity: 4 }
      ]
    };
  },

  async placeOrder(orderData: any): Promise<{ success: boolean }> {
    // Mock implementation
    console.log('Placing order:', orderData);
    return { success: true };
  }
};

// Utility functions
export const utils = {
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  },

  formatPercentage(pct: number): string {
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(1)}%`;
  },

  formatVolume(ml: number): string {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
  },

  formatAlcoholContent(abv: number): string {
    return `${abv}% ABV`;
  },

  getProductIcon(type: string): string {
    switch (type) {
      case 'wine': return '🍷';
      case 'spirits': return '🥃';
      case 'beer': return '🍺';
      case 'sake': return '🍶';
      default: return '🍷';
    }
  },

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (halfStar) stars += '⭐';
    return stars;
  },

  getVerificationBadge(status: string): string {
    return status === 'verified' ? '✅' : '⏳';
  }
}; 