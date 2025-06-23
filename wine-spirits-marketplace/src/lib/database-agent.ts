// Database Agent for Wine & Spirits Marketplace
// Automatically generates new products, updates prices, and maintains market data

import { Product } from './api';
import { products } from './products';

interface MarketTrend {
  region: string;
  type: 'wine' | 'spirits';
  trend: 'bullish' | 'bearish' | 'stable';
  volatility: number;
  seasonality: number;
}

interface ProductTemplate {
  type: 'wine' | 'spirits';
  category: string;
  priceRange: { min: number; max: number };
  rarityRange: { min: number; max: number };
  regions: string[];
  producers: string[];
  varietals: string[];
}

export class DatabaseAgent {
  private marketTrends: MarketTrend[] = [
    { region: 'Bordeaux', type: 'wine', trend: 'bullish', volatility: 0.15, seasonality: 0.8 },
    { region: 'Burgundy', type: 'wine', trend: 'bullish', volatility: 0.25, seasonality: 0.9 },
    { region: 'Napa Valley', type: 'wine', trend: 'stable', volatility: 0.12, seasonality: 0.6 },
    { region: 'Tuscany', type: 'wine', trend: 'bullish', volatility: 0.18, seasonality: 0.7 },
    { region: 'Champagne', type: 'wine', trend: 'stable', volatility: 0.10, seasonality: 0.5 },
    { region: 'Scotland', type: 'spirits', trend: 'bullish', volatility: 0.20, seasonality: 0.4 },
    { region: 'Japan', type: 'spirits', trend: 'bullish', volatility: 0.35, seasonality: 0.3 },
    { region: 'Kentucky', type: 'spirits', trend: 'stable', volatility: 0.15, seasonality: 0.2 },
    { region: 'Cognac', type: 'spirits', trend: 'stable', volatility: 0.12, seasonality: 0.3 }
  ];

  private productTemplates: ProductTemplate[] = [
    {
      type: 'wine',
      category: 'Bordeaux First Growth',
      priceRange: { min: 800, max: 3000 },
      rarityRange: { min: 9.0, max: 10.0 },
      regions: ['Pauillac', 'Saint-Estèphe', 'Saint-Julien', 'Margaux'],
      producers: ['Château Latour', 'Château Haut-Brion', 'Château Cos dEstournel'],
      varietals: ['Cabernet Sauvignon Blend', 'Merlot Blend']
    },
    {
      type: 'wine',
      category: 'Burgundy Grand Cru',
      priceRange: { min: 300, max: 2000 },
      rarityRange: { min: 8.5, max: 9.8 },
      regions: ['Côte de Nuits', 'Côte de Beaune'],
      producers: ['Domaine Leroy', 'Domaine Prieuré Roch', 'Domaine Hubert Lignier'],
      varietals: ['Pinot Noir', 'Chardonnay']
    },
    {
      type: 'wine',
      category: 'Super Tuscan',
      priceRange: { min: 150, max: 800 },
      rarityRange: { min: 7.5, max: 9.0 },
      regions: ['Bolgheri', 'Maremma', 'Chianti Classico'],
      producers: ['Tenuta Guado al Tasso', 'Castello di Fonterutoli', 'Isole e Olena'],
      varietals: ['Cabernet Sauvignon Blend', 'Sangiovese Blend']
    },
    {
      type: 'wine',
      category: 'Napa Cult',
      priceRange: { min: 200, max: 1500 },
      rarityRange: { min: 8.0, max: 9.5 },
      regions: ['Oakville', 'Rutherford', 'St. Helena', 'Calistoga'],
      producers: ['Colgin', 'Bryant Family', 'Dalla Valle', 'Grace Family'],
      varietals: ['Cabernet Sauvignon', 'Cabernet Sauvignon Blend']
    },
    {
      type: 'spirits',
      category: 'Single Malt Scotch',
      priceRange: { min: 150, max: 5000 },
      rarityRange: { min: 7.0, max: 9.5 },
      regions: ['Speyside', 'Highlands', 'Islay', 'Lowlands'],
      producers: ['Ardbeg', 'Springbank', 'Port Ellen', 'Brora'],
      varietals: ['Single Malt Scotch']
    },
    {
      type: 'spirits',
      category: 'Japanese Whisky',
      priceRange: { min: 300, max: 8000 },
      rarityRange: { min: 8.0, max: 10.0 },
      regions: ['Japan'],
      producers: ['Nikka', 'Chichibu', 'Mars Shinshu', 'Akkeshi'],
      varietals: ['Single Malt Japanese Whisky', 'Blended Japanese Whisky']
    },
    {
      type: 'spirits',
      category: 'Premium Cognac',
      priceRange: { min: 200, max: 2000 },
      rarityRange: { min: 7.5, max: 9.0 },
      regions: ['Cognac'],
      producers: ['Martell', 'Camus', 'Delamain', 'Pierre Ferrand'],
      varietals: ['Cognac']
    }
  ];

  private wineVintages = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
  private spiritsAges = [12, 15, 18, 21, 25, 30];

  // Generate new products automatically
  async generateNewProducts(count: number = 5): Promise<Product[]> {
    const newProducts: Product[] = [];
    
    for (let i = 0; i < count; i++) {
      const template = this.getRandomTemplate();
      const product = await this.createProductFromTemplate(template);
      newProducts.push(product);
    }
    
    return newProducts;
  }

  // Update existing product prices based on market trends
  async updateProductPrices(): Promise<void> {
    for (const product of products) {
      const trend = this.getMarketTrend(product.region, product.type);
      const priceUpdate = this.calculatePriceUpdate(product, trend);
      
      // Update current price and price change
      product.current_price = Math.round((product.current_price || product.base_price) * priceUpdate.multiplier * 100) / 100;
      product.price_change_24h = priceUpdate.change24h;
      product.updated_at = new Date();
      
      // Update 52-week range if needed
      if (product.price_range_52week) {
        if (product.current_price < product.price_range_52week.low) {
          product.price_range_52week.low = product.current_price;
        }
        if (product.current_price > product.price_range_52week.high) {
          product.price_range_52week.high = product.current_price;
        }
      }
    }
  }

  // Generate market intelligence reports
  generateMarketReport(): string {
    const totalProducts = products.length;
    const averagePrice = products.reduce((sum, p) => sum + (p.current_price || p.base_price), 0) / totalProducts;
    const investmentGradeCount = products.filter(p => p.investment_grade).length;
    
    const topPerformers = products
      .filter(p => p.fiveYearPriceChangePct !== undefined)
      .sort((a, b) => (b.fiveYearPriceChangePct || 0) - (a.fiveYearPriceChangePct || 0))
      .slice(0, 5);

    return `
# Wine & Spirits Market Intelligence Report
Generated: ${new Date().toISOString()}

## Market Overview
- Total Products: ${totalProducts}
- Average Price: $${averagePrice.toLocaleString()}
- Investment Grade: ${investmentGradeCount} (${((investmentGradeCount/totalProducts)*100).toFixed(1)}%)

## Top Performers (5-Year)
${topPerformers.map((p, i) => 
  `${i+1}. ${p.name} - ${p.fiveYearPriceChangePct?.toFixed(1)}%`
).join('\n')}

## Market Trends
${this.marketTrends.map(trend => 
  `- ${trend.region} ${trend.type}: ${trend.trend.toUpperCase()} (volatility: ${(trend.volatility*100).toFixed(0)}%)`
).join('\n')}
    `.trim();
  }

  // Private helper methods
  private getRandomTemplate(): ProductTemplate {
    return this.productTemplates[Math.floor(Math.random() * this.productTemplates.length)];
  }

  private async createProductFromTemplate(template: ProductTemplate): Promise<Product> {
    const region = template.regions[Math.floor(Math.random() * template.regions.length)];
    const producer = template.producers[Math.floor(Math.random() * template.producers.length)];
    const varietal = template.varietals[Math.floor(Math.random() * template.varietals.length)];
    
    const basePrice = Math.round(
      template.priceRange.min + 
      Math.random() * (template.priceRange.max - template.priceRange.min)
    );
    
    const rarity = template.rarityRange.min + 
      Math.random() * (template.rarityRange.max - template.rarityRange.min);

    const vintage = template.type === 'wine' 
      ? this.wineVintages[Math.floor(Math.random() * this.wineVintages.length)]
      : undefined;

    const age = template.type === 'spirits'
      ? this.spiritsAges[Math.floor(Math.random() * this.spiritsAges.length)]
      : undefined;

    const productName = this.generateProductName(producer, template.category, vintage, age);
    
    return {
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: productName,
      description: this.generateDescription(template.category, producer, region),
      type: template.type,
      varietal,
      region,
      vintage,
      producer,
      alcohol_content: template.type === 'wine' ? 13 + Math.random() * 3 : 40 + Math.random() * 20,
      volume_ml: template.type === 'wine' ? 750 : 700,
      base_price: basePrice,
      current_price: basePrice * (0.95 + Math.random() * 0.1),
      price_change_24h: (Math.random() - 0.5) * 10,
      fiveYearPriceChangePct: 20 + Math.random() * 80,
      slug: this.generateSlug(productName),
      average_rating: 4.0 + Math.random() * 1.0,
      total_reviews: Math.floor(Math.random() * 200) + 20,
      wine_spectator_score: template.type === 'wine' ? Math.floor(85 + Math.random() * 15) : undefined,
      robert_parker_score: template.type === 'wine' ? Math.floor(85 + Math.random() * 15) : undefined,
      primary_image_url: `/images/${template.type}s/${this.generateSlug(productName)}.jpg`,
      image_urls: [`/images/${template.type}s/${this.generateSlug(productName)}.jpg`],
      tasting_notes: this.generateTastingNotes(template.type, varietal),
      food_pairings: this.generateFoodPairings(template.type),
      serving_temperature: template.type === 'wine' ? '60-65°F' : 'Room temperature',
      aging_potential: template.type === 'wine' ? '15-25 years' : 'Peak maturity reached',
      vineyard_location: `${region}, ${this.getCountryForRegion(region)}`,
      estate_history: this.generateEstateHistory(producer),
      production_methods: this.generateProductionMethods(template.type),
      certifications: this.generateCertifications(template.type, region),
      available_quantity: Math.floor(Math.random() * 20) + 1,
      minimum_order_quantity: 1,
      last_traded_price: basePrice * (0.98 + Math.random() * 0.04),
      price_range_52week: {
        low: basePrice * 0.85,
        high: basePrice * 1.15
      },
      seller: this.generateSeller(region),
      requires_adult_signature: true,
      ttb_approved: true,
      created_at: new Date(),
      updated_at: new Date(),
      featured: Math.random() < 0.2,
      rarity_score: Math.round(rarity * 10) / 10,
      investment_grade: rarity > 8.0
    };
  }

  private generateProductName(producer: string, category: string, vintage?: number, age?: number): string {
    const names = [
      'Reserve', 'Estate', 'Single Vineyard', 'Cuvée Prestige', 'Limited Edition',
      'Master Selection', 'Heritage', 'Exceptional', 'Premier', 'Grand Cru'
    ];
    
    const name = names[Math.floor(Math.random() * names.length)];
    
    if (vintage) {
      return `${producer} ${name} ${vintage}`;
    } else if (age) {
      return `${producer} ${age} Year Old ${name}`;
    } else {
      return `${producer} ${name}`;
    }
  }

  private generateDescription(category: string, producer: string, region: string): string {
    const descriptions = {
      'Bordeaux First Growth': `Exceptional ${category} from ${producer}, showcasing the finest terroir of ${region} with decades of aging potential.`,
      'Burgundy Grand Cru': `Elegant and complex Grand Cru from ${producer}, representing the pinnacle of ${region} winemaking tradition.`,
      'Super Tuscan': `Modern Italian excellence from ${producer}, blending tradition with innovation in the heart of ${region}.`,
      'Napa Cult': `Cult status Cabernet from ${producer}, representing the finest expression of ${region} terroir.`,
      'Single Malt Scotch': `Exceptional single malt from ${producer}, showcasing the distinctive character of ${region}.`,
      'Japanese Whisky': `Masterful Japanese whisky from ${producer}, representing the harmony and precision of Japanese distilling.`,
      'Premium Cognac': `Luxurious cognac from ${producer}, aged to perfection in the cellars of ${region}.`
    };
    
    return descriptions[category as keyof typeof descriptions] || 
           `Premium ${category} from ${producer}, crafted with exceptional attention to detail in ${region}.`;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateTastingNotes(type: 'wine' | 'spirits', varietal: string): string {
    const wineNotes = [
      'Blackcurrant, cedar, tobacco with elegant tannins',
      'Cherry, earth, spice with silky texture',
      'Citrus, mineral, oak with crisp acidity',
      'Plum, chocolate, vanilla with rich mouthfeel'
    ];
    
    const spiritNotes = [
      'Honey, vanilla, oak with smooth finish',
      'Smoke, peat, sea salt with complex layers',
      'Dried fruits, spice, leather with long finish',
      'Caramel, nuts, chocolate with warming sensation'
    ];
    
    const notes = type === 'wine' ? wineNotes : spiritNotes;
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private generateFoodPairings(type: 'wine' | 'spirits'): string[] {
    const winePairings = [
      ['Grilled steak', 'Aged cheese', 'Dark chocolate'],
      ['Roasted lamb', 'Mushroom risotto', 'Truffle dishes'],
      ['Seafood', 'Goat cheese', 'Light salads'],
      ['Game birds', 'Root vegetables', 'Herb-crusted dishes']
    ];
    
    const spiritPairings = [
      ['Dark chocolate', 'Cigars', 'Aged cheese'],
      ['Smoked salmon', 'Nuts', 'Dried fruits'],
      ['Grilled meats', 'Spiced desserts', 'Coffee']
    ];
    
    const pairings = type === 'wine' ? winePairings : spiritPairings;
    return pairings[Math.floor(Math.random() * pairings.length)];
  }

  private getCountryForRegion(region: string): string {
    const regionMap: { [key: string]: string } = {
      'Bordeaux': 'France', 'Burgundy': 'France', 'Champagne': 'France', 'Cognac': 'France',
      'Tuscany': 'Italy', 'Piedmont': 'Italy', 'Bolgheri': 'Italy',
      'Napa Valley': 'USA', 'Sonoma': 'USA', 'Alexander Valley': 'USA',
      'Speyside': 'Scotland', 'Highlands': 'Scotland', 'Islay': 'Scotland',
      'Japan': 'Japan', 'Kentucky': 'USA'
    };
    
    return regionMap[region] || 'Unknown';
  }

  private generateEstateHistory(producer: string): string {
    const histories = [
      `${producer} has been crafting exceptional wines for generations, with a commitment to traditional methods.`,
      `Founded in the early 20th century, ${producer} represents the pinnacle of regional winemaking excellence.`,
      `${producer} is a family-owned estate with deep roots in the local terroir and winemaking tradition.`,
      `With decades of experience, ${producer} continues to innovate while respecting traditional practices.`
    ];
    
    return histories[Math.floor(Math.random() * histories.length)];
  }

  private generateProductionMethods(type: 'wine' | 'spirits'): string {
    const wineMethods = [
      'Traditional fermentation, French oak aging, minimal intervention',
      'Hand-harvested grapes, temperature-controlled fermentation, extended aging',
      'Organic farming, native yeast fermentation, careful oak selection',
      'Biodynamic practices, gravity-flow winery, traditional techniques'
    ];
    
    const spiritMethods = [
      'Traditional pot still distillation, oak barrel aging',
      'Copper pot stills, charred oak barrels, careful maturation',
      'Double distillation, sherry cask finishing, expert blending',
      'Single cask maturation, natural color, non-chill filtered'
    ];
    
    const methods = type === 'wine' ? wineMethods : spiritMethods;
    return methods[Math.floor(Math.random() * methods.length)];
  }

  private generateCertifications(type: 'wine' | 'spirits', region: string): string[] {
    const wineCerts = ['Estate Grown', 'Organic', 'Sustainable'];
    const spiritCerts = ['Single Malt', 'Age Statement', 'Cask Strength'];
    
    const baseCerts = type === 'wine' ? wineCerts : spiritCerts;
    const regionCert = `${region} ${type === 'wine' ? 'AOC' : 'Region'}`;
    
    return [regionCert, ...baseCerts.slice(0, Math.floor(Math.random() * 2) + 1)];
  }

  private generateSeller(region: string): Product['seller'] {
    const sellers = [
      {
        id: 'auto-seller-1',
        business_name: `${region} Fine Wine Merchants`,
        seller_rating: 4.5 + Math.random() * 0.5,
        license_number: `TTB-AUTO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        license_state: 'CA',
        verification_status: 'verified' as const,
        years_in_business: Math.floor(Math.random() * 20) + 5,
        total_sales: Math.floor(Math.random() * 5000) + 500
      }
    ];
    
    return sellers[0];
  }

  private getMarketTrend(region: string, type: 'wine' | 'spirits'): MarketTrend {
    const trend = this.marketTrends.find(t => 
      region.includes(t.region) && t.type === type
    );
    
    return trend || { 
      region, 
      type, 
      trend: 'stable', 
      volatility: 0.1, 
      seasonality: 0.5 
    };
  }

  private calculatePriceUpdate(product: Product, trend: MarketTrend): { multiplier: number; change24h: number } {
    const baseVolatility = trend.volatility;
    const seasonalEffect = Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI) * trend.seasonality;
    
    let trendEffect = 0;
    switch (trend.trend) {
      case 'bullish':
        trendEffect = 0.02;
        break;
      case 'bearish':
        trendEffect = -0.02;
        break;
      default:
        trendEffect = 0;
    }
    
    const randomEffect = (Math.random() - 0.5) * baseVolatility;
    const totalEffect = trendEffect + seasonalEffect * 0.01 + randomEffect;
    
    return {
      multiplier: 1 + totalEffect,
      change24h: totalEffect * 100
    };
  }
}

// Singleton instance
export const databaseAgent = new DatabaseAgent();

// Auto-update scheduler (runs every hour in production)
export function startDatabaseAgent() {
  console.log('🤖 Database Agent started - monitoring wine & spirits market...');
  
  // Update prices every hour
  setInterval(async () => {
    try {
      await databaseAgent.updateProductPrices();
      console.log('📊 Market prices updated');
    } catch (error) {
      console.error('❌ Price update failed:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
  
  // Generate new products daily
  setInterval(async () => {
    try {
      const newProducts = await databaseAgent.generateNewProducts(3);
      console.log(`🆕 Generated ${newProducts.length} new products`);
    } catch (error) {
      console.error('❌ Product generation failed:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
  
  // Generate market report weekly
  setInterval(() => {
    try {
      const report = databaseAgent.generateMarketReport();
      console.log('📈 Market Intelligence Report:\n', report);
    } catch (error) {
      console.error('❌ Report generation failed:', error);
    }
  }, 7 * 24 * 60 * 60 * 1000); // 7 days
} 