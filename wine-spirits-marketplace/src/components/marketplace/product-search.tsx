"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  description: string;
  type: 'wine' | 'spirits' | 'beer' | 'sake';
  varietal: string;
  region: string;
  vintage?: number;
  producer: string;
  base_price: number;
  average_rating?: number;
  wine_spectator_score?: number;
  primary_image_url?: string;
  seller: {
    business_name: string;
    seller_rating: number;
  };
}

interface SearchFacets {
  types: Array<{ key: string; count: number }>;
  regions: Array<{ key: string; count: number }>;
  varietals: Array<{ key: string; count: number }>;
  priceRanges: Array<{ key: string; count: number }>;
  vintages: Array<{ key: string; count: number }>;
}

interface SearchResults {
  products: Product[];
  total: number;
  facets: SearchFacets;
}

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    region: '',
    varietal: '',
    minPrice: '',
    maxPrice: '',
    vintage: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (filters.type) params.append('type', filters.type);
      if (filters.region) params.append('region', filters.region);
      if (filters.varietal) params.append('varietal', filters.varietal);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.vintage) params.append('vintage', filters.vintage);

      const response = await fetch(`http://localhost:3001/search/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Search failed');
        // Fallback to sample data for demo
        setResults(getSampleResults());
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to sample data for demo
      setResults(getSampleResults());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial results
    handleSearch();
  }, []);

  const getSampleResults = (): SearchResults => ({
    products: [
      {
        id: '1',
        name: '2019 Napa Valley Cabernet Sauvignon Reserve',
        description: 'Rich, full-bodied Cabernet with notes of blackcurrant, cedar, and vanilla.',
        type: 'wine',
        varietal: 'Cabernet Sauvignon',
        region: 'Napa Valley',
        vintage: 2019,
        producer: 'Napa Valley Premium Wines',
        base_price: 89.99,
        average_rating: 4.6,
        wine_spectator_score: 92,
        seller: {
          business_name: 'Napa Valley Premium Wines',
          seller_rating: 4.8,
        },
      },
      {
        id: '2',
        name: 'Small Batch Bourbon Whiskey 12 Year',
        description: 'Hand-selected barrels aged 12 years. Rich caramel and vanilla notes.',
        type: 'spirits',
        varietal: 'Bourbon',
        region: 'Kentucky',
        producer: 'Kentucky Bourbon Distillery',
        base_price: 129.99,
        average_rating: 4.7,
        seller: {
          business_name: 'Kentucky Bourbon Distillery',
          seller_rating: 4.9,
        },
      },
      {
        id: '3',
        name: '2020 Willamette Valley Pinot Noir',
        description: 'Elegant Pinot Noir showcasing the terroir of Willamette Valley.',
        type: 'wine',
        varietal: 'Pinot Noir',
        region: 'Willamette Valley',
        vintage: 2020,
        producer: 'Oregon Artisan Wines',
        base_price: 38.99,
        average_rating: 4.5,
        wine_spectator_score: 91,
        seller: {
          business_name: 'Oregon Artisan Wines',
          seller_rating: 4.7,
        },
      },
    ],
    total: 3,
    facets: {
      types: [
        { key: 'wine', count: 2 },
        { key: 'spirits', count: 1 },
      ],
      regions: [
        { key: 'Napa Valley', count: 1 },
        { key: 'Kentucky', count: 1 },
        { key: 'Willamette Valley', count: 1 },
      ],
      varietals: [
        { key: 'Cabernet Sauvignon', count: 1 },
        { key: 'Bourbon', count: 1 },
        { key: 'Pinot Noir', count: 1 },
      ],
      priceRanges: [
        { key: 'Under $50', count: 1 },
        { key: '$50-$100', count: 1 },
        { key: '$100-$250', count: 1 },
      ],
      vintages: [
        { key: '2020', count: 1 },
        { key: '2019', count: 1 },
      ],
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wine': return '🍷';
      case 'spirits': return '🥃';
      case 'beer': return '🍺';
      case 'sake': return '🍶';
      default: return '🍾';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
          Marketplace Search & Discovery
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          Phase 3: Advanced search with faceted filtering, Elasticsearch integration, and real-time results
        </p>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search wines, spirits, producers, regions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading} variant="wine">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <select
            className="px-3 py-2 border rounded-md"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="wine">Wine</option>
            <option value="spirits">Spirits</option>
            <option value="beer">Beer</option>
            <option value="sake">Sake</option>
          </select>

          <Input
            placeholder="Region"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          />

          <Input
            placeholder="Varietal"
            value={filters.varietal}
            onChange={(e) => setFilters({ ...filters, varietal: e.target.value })}
          />

          <Input
            placeholder="Min Price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />

          <Input
            placeholder="Max Price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />

          <Input
            placeholder="Vintage"
            type="number"
            value={filters.vintage}
            onChange={(e) => setFilters({ ...filters, vintage: e.target.value })}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Faceted Filters Sidebar */}
        {results && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Refine Results</CardTitle>
                <CardDescription>
                  {results.total} products found
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Facets */}
                <div>
                  <h4 className="font-semibold mb-2">Type</h4>
                  {results.facets.types.map((facet) => (
                    <div key={facet.key} className="flex justify-between text-sm">
                      <button
                        className="hover:text-purple-600"
                        onClick={() => setFilters({ ...filters, type: facet.key })}
                      >
                        {getTypeIcon(facet.key)} {facet.key}
                      </button>
                      <span className="text-slate-500">({facet.count})</span>
                    </div>
                  ))}
                </div>

                {/* Region Facets */}
                <div>
                  <h4 className="font-semibold mb-2">Region</h4>
                  {results.facets.regions.slice(0, 5).map((facet) => (
                    <div key={facet.key} className="flex justify-between text-sm">
                      <button
                        className="hover:text-purple-600"
                        onClick={() => setFilters({ ...filters, region: facet.key })}
                      >
                        {facet.key}
                      </button>
                      <span className="text-slate-500">({facet.count})</span>
                    </div>
                  ))}
                </div>

                {/* Price Range Facets */}
                <div>
                  <h4 className="font-semibold mb-2">Price Range</h4>
                  {results.facets.priceRanges.map((facet) => (
                    <div key={facet.key} className="flex justify-between text-sm">
                      <span>{facet.key}</span>
                      <span className="text-slate-500">({facet.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results */}
        <div className={`${results ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2">Searching products...</p>
            </div>
          ) : results && results.products.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {results.products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {getTypeIcon(product.type)} {product.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {product.producer} • {product.region}
                        </CardDescription>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatPrice(product.base_price)}
                        </div>
                        {product.vintage && (
                          <div className="text-sm text-slate-500">
                            {product.vintage}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        {product.average_rating && (
                          <span className="flex items-center">
                            ⭐ {product.average_rating.toFixed(1)}
                          </span>
                        )}
                        {product.wine_spectator_score && (
                          <span className="text-purple-600">
                            WS: {product.wine_spectator_score}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        🏷️ {product.seller.business_name}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">
                        View Details
                      </Button>
                      <Button variant="wine">
                        Place Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No products found</p>
              <p className="text-sm text-slate-400 mt-2">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 