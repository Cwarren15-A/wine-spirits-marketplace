// API Service Layer for Wine & Spirits Marketplace
// Handles all backend communication with proper error handling and TypeScript types

import { products, getProductById, getFeaturedProducts, searchProducts } from './products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Price History Types
export interface PricePoint {
  date: string;           // ISO 'YYYY-MM-DD'
  price: number;          // USD
}

export interface PriceHistory {
  productId: string;
  points: PricePoint[];   // ordered oldest➞latest (≤ 60)
  lastUpdated: string;    // ISO timestamp
}

// Enhanced Product interface with rich information
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
  current_price?: number;
  price_change_24h?: number;
  fiveYearPriceChangePct?: number; // Added for trend tracking
  market_cap?: number;
  slug?: string; // Added for price API integration
  
  // Quality & Ratings
  average_rating?: number;
  total_reviews: number;
  wine_spectator_score?: number;
  robert_parker_score?: number;
  james_suckling_score?: number;
  
  // Visual & Media
  primary_image_url?: string;
  image_urls: string[];
  
  // Product Details
  tasting_notes?: string;
  food_pairings?: string[];
  serving_temperature?: string;
  aging_potential?: string;
  harvest_method?: string;
  fermentation_process?: string;
  
  // Provenance & Authentication
  vineyard_location?: string;
  estate_history?: string;
  production_methods?: string;
  sustainability_practices?: string[];
  certifications?: string[];
  
  // Trading Information
  available_quantity: number;
  minimum_order_quantity: number;
  last_traded_price?: number;
  price_range_52week?: { low: number; high: number };
  volume_traded_24h?: number;
  
  // Seller Information
  seller: {
    id: string;
    business_name: string;
    seller_rating: number;
    license_number: string;
    license_state: string;
    verification_status: 'verified' | 'pending' | 'unverified';
    years_in_business?: number;
    total_sales?: number;
  };
  
  // Compliance & Legal
  requires_adult_signature: boolean;
  shipping_restrictions?: string[];
  tax_information?: string;
  compliance_notes?: string;
  ttb_approved: boolean;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  featured?: boolean;
  rarity_score?: number;
  investment_grade?: boolean;
}

export interface OrderBook {
  bids: Array<{
    price: number;
    quantity: number;
    orders: number;
  }>;
  asks: Array<{
    price: number;
    quantity: number;
    orders: number;
  }>;
}

export interface SearchFacets {
  types: Array<{ key: string; count: number }>;
  regions: Array<{ key: string; count: number }>;
  varietals: Array<{ key: string; count: number }>;
  priceRanges: Array<{ key: string; count: number }>;
  vintages: Array<{ key: string; count: number }>;
  ratings: Array<{ key: string; count: number }>;
  producers: Array<{ key: string; count: number }>;
}

export interface SearchResults {
  products: Product[];
  total: number;
  facets: SearchFacets;
}

export interface CreateOrderDto {
  product_id: string;
  user_id: string;
  order_type: 'bid' | 'ask';
  price: number;
  quantity: number;
  age_verified: boolean;
  shipping_state: string;
}

export interface OrderResponse {
  success: boolean;
  id: string;
  message?: string;
}

// API Error Class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler with fallback to our curated data
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API request failed for ${endpoint}, using curated data:`, error);
    
    if (fallbackData) {
      return fallbackData;
    }
    
    throw new ApiError(0, 'Network error or server unavailable');
  }
}

// Product Catalog API
export const productApi = {
  async getProducts(): Promise<{ products: Product[]; total: number }> {
    const fallback = {
      products: products,
      total: products.length
    };

    return apiRequest<{ products: Product[]; total: number }>('/products', {}, fallback);
  },

  async getProduct(id: string): Promise<Product | null> {
    const fallback = getProductById(id) || null;
    
    return apiRequest<Product | null>(`/products/${id}`, {}, fallback);
  },

  async getFeaturedProducts(): Promise<{ products: Product[]; total: number }> {
    const featuredProducts = getFeaturedProducts();
    const fallback = {
      products: featuredProducts,
      total: featuredProducts.length
    };

    return apiRequest<{ products: Product[]; total: number }>('/products/featured', {}, fallback);
  },
};

// Search API
export const searchApi = {
  async searchProducts(params: { 
    query?: string; 
    type?: string; 
    region?: string; 
    priceMin?: number; 
    priceMax?: number;
    vintage?: number;
    rating?: number;
  }): Promise<SearchResults> {
    
    // Use our curated search function
    let filteredProducts = products;
    
    if (params.query) {
      filteredProducts = searchProducts(params.query);
    }
    
    if (params.type) {
      filteredProducts = filteredProducts.filter(p => p.type === params.type);
    }
    
    if (params.region) {
      filteredProducts = filteredProducts.filter(p => 
        p.region.toLowerCase().includes(params.region!.toLowerCase())
      );
    }
    
    if (params.priceMin) {
      filteredProducts = filteredProducts.filter(p => 
        (p.current_price || p.base_price) >= params.priceMin!
      );
    }
    
    if (params.priceMax) {
      filteredProducts = filteredProducts.filter(p => 
        (p.current_price || p.base_price) <= params.priceMax!
      );
    }
    
    if (params.vintage) {
      filteredProducts = filteredProducts.filter(p => p.vintage === params.vintage);
    }
    
    if (params.rating) {
      filteredProducts = filteredProducts.filter(p => 
        (p.average_rating || 0) >= params.rating!
      );
    }

    // Generate facets from filtered results
    const facets: SearchFacets = {
      types: Array.from(new Set(filteredProducts.map(p => p.type)))
        .map(type => ({ 
          key: type, 
          count: filteredProducts.filter(p => p.type === type).length 
        })),
      regions: Array.from(new Set(filteredProducts.map(p => p.region)))
        .map(region => ({ 
          key: region, 
          count: filteredProducts.filter(p => p.region === region).length 
        })),
      varietals: Array.from(new Set(filteredProducts.map(p => p.varietal)))
        .map(varietal => ({ 
          key: varietal, 
          count: filteredProducts.filter(p => p.varietal === varietal).length 
        })),
      priceRanges: [
        { key: '$0-$100', count: filteredProducts.filter(p => (p.current_price || p.base_price) <= 100).length },
        { key: '$100-$500', count: filteredProducts.filter(p => (p.current_price || p.base_price) > 100 && (p.current_price || p.base_price) <= 500).length },
        { key: '$500-$1000', count: filteredProducts.filter(p => (p.current_price || p.base_price) > 500 && (p.current_price || p.base_price) <= 1000).length },
        { key: '$1000+', count: filteredProducts.filter(p => (p.current_price || p.base_price) > 1000).length },
      ],
      vintages: Array.from(new Set(filteredProducts.map(p => p.vintage).filter(Boolean)))
        .map(vintage => ({ 
          key: vintage!.toString(), 
          count: filteredProducts.filter(p => p.vintage === vintage).length 
        })),
      ratings: [
        { key: '4.5+', count: filteredProducts.filter(p => (p.average_rating || 0) >= 4.5).length },
        { key: '4.0+', count: filteredProducts.filter(p => (p.average_rating || 0) >= 4.0).length },
        { key: '3.5+', count: filteredProducts.filter(p => (p.average_rating || 0) >= 3.5).length },
      ],
      producers: Array.from(new Set(filteredProducts.map(p => p.producer)))
        .slice(0, 10) // Top 10 producers
        .map(producer => ({ 
          key: producer, 
          count: filteredProducts.filter(p => p.producer === producer).length 
        }))
    };

    const fallback: SearchResults = {
      products: filteredProducts,
      total: filteredProducts.length,
      facets,
    };

    return apiRequest<SearchResults>('/search/products', {
      method: 'POST',
      body: JSON.stringify(params),
    }, fallback);
  },
};

// Order Book API
export const orderBookApi = {
  async placeOrder(orderData: CreateOrderDto): Promise<OrderResponse> {
    return apiRequest<OrderResponse>('/order-book/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }, { success: true, id: 'demo-order-id' });
  },

  async getMarketDepth(productId: string): Promise<OrderBook> {
    const product = getProductById(productId);
    const basePrice = product ? (product.current_price || product.base_price) : 100;
    
    const fallback: OrderBook = {
      bids: [
        { price: basePrice * 0.98, quantity: 2, orders: 1 },
        { price: basePrice * 0.96, quantity: 1, orders: 1 },
        { price: basePrice * 0.94, quantity: 3, orders: 2 },
      ],
      asks: [
        { price: basePrice * 1.02, quantity: 1, orders: 1 },
        { price: basePrice * 1.04, quantity: 2, orders: 1 },
        { price: basePrice * 1.06, quantity: 1, orders: 1 },
      ],
    };

    return apiRequest<OrderBook>(`/order-book/products/${productId}/depth`, {}, fallback);
  },
};

// Utility functions
export const utils = {
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  },

  formatPercentage: (percentage: number): string => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  },

  getProductIcon: (type: string): string => {
    switch (type) {
      case 'wine': return '🍷';
      case 'spirits': return '🥃';
      case 'beer': return '🍺';
      case 'sake': return '🍶';
      default: return '🍾';
    }
  },

  getRatingStars: (rating: number): string => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  },

  getVerificationBadge: (status: string): string => {
    switch (status) {
      case 'verified': return '✅';
      case 'pending': return '⏳';
      case 'unverified': return '❌';
      default: return '❓';
    }
  },

  formatAlcoholContent: (percentage: number): string => {
    return `${percentage}% ABV`;
  },

  formatVolume: (ml: number): string => {
    if (ml === 750) return '750ml (Standard)';
    if (ml === 375) return '375ml (Half Bottle)';
    if (ml === 1500) return '1.5L (Magnum)';
    return `${ml}ml`;
  }
}; 