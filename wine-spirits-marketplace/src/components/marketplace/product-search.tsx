"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchApi, utils, type Product } from '@/lib/api';
import { TrendBadge } from '@/components/ui/TrendBadge';

interface ProductSearchProps {
  initialProducts?: Product[];
}

export function ProductSearch({ initialProducts = [] }: ProductSearchProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    priceMin: '',
    priceMax: '',
    vintage: '',
    rating: '',
  });
  const [sortBy, setSortBy] = useState('featured');
  const [total, setTotal] = useState(initialProducts.length);

  // Only load products when filters change, not on initial mount
  useEffect(() => {
    // Skip loading on initial mount if we have initial products
    if (initialProducts.length > 0 && products.length === initialProducts.length && 
        !searchQuery && !filters.type && !filters.region && !filters.priceMin && 
        !filters.priceMax && !filters.vintage && !filters.rating) {
      return;
    }
    loadProducts();
  }, [filters, sortBy, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        query: searchQuery || undefined,
        type: filters.type || undefined,
        region: filters.region || undefined,
        priceMin: filters.priceMin ? parseFloat(filters.priceMin) : undefined,
        priceMax: filters.priceMax ? parseFloat(filters.priceMax) : undefined,
        vintage: filters.vintage ? parseInt(filters.vintage) : undefined,
        rating: filters.rating ? parseFloat(filters.rating) : undefined,
      };

      const result = await searchApi.searchProducts(params);
      
      // Sort products
      const sortedProducts = [...result.products];
      switch (sortBy) {
        case 'price-low':
          sortedProducts.sort((a, b) => (a.current_price || a.base_price) - (b.current_price || b.base_price));
          break;
        case 'price-high':
          sortedProducts.sort((a, b) => (b.current_price || b.base_price) - (a.current_price || a.base_price));
          break;
        case 'rating':
          sortedProducts.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
          break;
        case 'vintage':
          sortedProducts.sort((a, b) => (b.vintage || 0) - (a.vintage || 0));
          break;
        case 'rarity':
          sortedProducts.sort((a, b) => (b.rarity_score || 0) - (a.rarity_score || 0));
          break;
        case 'performance':
          sortedProducts.sort((a, b) => (b.fiveYearPriceChangePct || 0) - (a.fiveYearPriceChangePct || 0));
          break;
        default: // featured
          sortedProducts.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (b.rarity_score || 0) - (a.rarity_score || 0);
          });
      }

      setProducts(sortedProducts);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      region: '',
      priceMin: '',
      priceMax: '',
      vintage: '',
      rating: '',
    });
    setSearchQuery('');
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/marketplace/product/${product.id}`} className="group">
      <div className="card-premium rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        {/* Product Image */}
        <div className="relative h-64 bg-gradient-to-br from-wine-100 to-gold-100 flex items-center justify-center">
          {product.primary_image_url ? (
            <img
              src={product.primary_image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`text-6xl ${product.primary_image_url ? 'hidden' : ''}`}>
            {utils.getProductIcon(product.type)}
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                ⭐ FEATURED
              </span>
            )}
            {product.investment_grade && (
              <span className="bg-wine-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                💎 INVESTMENT
              </span>
            )}
          </div>

          {/* Price Change & 5-Year Performance */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.price_change_24h && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.price_change_24h > 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {utils.formatPercentage(product.price_change_24h)}
              </span>
            )}
            {product.fiveYearPriceChangePct !== undefined && (
              <TrendBadge pct={product.fiveYearPriceChangePct} size="sm" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-wine-600 font-medium">
                {product.type.toUpperCase()} • {product.vintage || 'NV'}
              </span>
              <span className="text-sm text-slate-500">
                {utils.getVerificationBadge(product.seller.verification_status)}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-wine-900 mb-1 group-hover:text-wine-700 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-sm text-wine-600 mb-2">
              {product.producer} • {product.region}
            </p>
          </div>

          {/* Investment Performance */}
          {product.fiveYearPriceChangePct !== undefined && (
            <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-wine-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">5-Year Performance</span>
                <TrendBadge pct={product.fiveYearPriceChangePct} size="md" />
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Investment-grade collectible with strong market performance
              </div>
            </div>
          )}

          {/* Price */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-wine-900">
                  {utils.formatPrice(product.current_price || product.base_price)}
                </div>
                {product.current_price && product.current_price !== product.base_price && (
                  <div className="text-sm text-slate-500 line-through">
                    {utils.formatPrice(product.base_price)}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <button className="btn-premium px-4 py-2 text-sm font-semibold rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-premium mb-4">
          Premium Wine & Spirits Collection
        </h1>
        <p className="text-xl text-slate-600">
          Discover investment-grade wines and rare spirits from verified sellers
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card-premium rounded-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search wines, spirits, producers, regions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-premium px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            >
              <option value="">All Types</option>
              <option value="wine">Wine</option>
              <option value="spirits">Spirits</option>
            </select>

            <input
              type="text"
              placeholder="Region"
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            />

            <input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            />

            <input
              type="number"
              placeholder="Vintage"
              value={filters.vintage}
              onChange={(e) => setFilters(prev => ({ ...prev, vintage: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            />

            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={clearFilters}
              className="text-wine-600 hover:text-wine-800 text-sm font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-600">
          {loading ? 'Searching...' : `${total} products found`}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
        >
          <option value="featured">Featured First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="vintage">Newest Vintage</option>
          <option value="rarity">Rarity Score</option>
          <option value="performance">5-Year Performance</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-premium rounded-xl p-6 animate-pulse">
              <div className="h-64 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍷</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
          <p className="text-slate-600 mb-4">Try adjusting your search criteria</p>
          <button
            onClick={clearFilters}
            className="btn-premium px-6 py-3 rounded-lg font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
} 