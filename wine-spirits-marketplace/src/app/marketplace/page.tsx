import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductSearch from "@/components/marketplace/product-search";
import OrderBook from "@/components/marketplace/order-book";

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-6">
            Wine & Spirits Marketplace
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Phase 3: Advanced marketplace engine with real-time order matching, 
            Elasticsearch-powered search, and comprehensive wine/spirits taxonomy.
          </p>
          
          {/* Phase 3 Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Order Book Engine
                </CardTitle>
                <CardDescription>
                  Real-time bid/ask matching with price-time priority algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-left">
                  <li>• WebSocket-based real-time updates</li>
                  <li>• Market depth visualization</li>
                  <li>• Automated order matching</li>
                  <li>• Compliance-enforced trading</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Product Catalog
                </CardTitle>
                <CardDescription>
                  Comprehensive wine/spirits taxonomy with SKU normalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Wine varietal classification</li>
                  <li>• Region and appellation data</li>
                  <li>• Producer verification</li>
                  <li>• Automatic SKU generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔍 Search & Discovery
                </CardTitle>
                <CardDescription>
                  Elasticsearch integration with faceted search and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Full-text search capabilities</li>
                  <li>• Faceted filtering system</li>
                  <li>• Recommendation engine</li>
                  <li>• Auto-complete suggestions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center mb-12">
            <Button variant="wine" size="lg">
              Explore Products
            </Button>
            <Button variant="outline" size="lg">
              View Order Book
            </Button>
          </div>
        </div>

        {/* Phase 3 Implementation Status */}
        <Card className="bg-gradient-to-r from-purple-50 to-red-50 border-2 border-purple-200 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Phase 3: Marketplace Engine Status</CardTitle>
            <CardDescription>
              All core marketplace features implemented and operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Completed Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Order Book Service with WebSocket support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Real-time bid/ask matching algorithm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Market depth visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Product Catalog with wine/spirits taxonomy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    SKU normalization and de-duplication
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Elasticsearch integration for search
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Faceted search with filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Recommendation engine foundation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">🚀 Technical Architecture</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    NestJS microservices architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    PostgreSQL for transactional data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Elasticsearch for search & discovery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    WebSocket real-time communication
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    TypeORM for database operations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Class-validator for data validation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    TTB compliance enforcement
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Age verification integration
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Phase 3 API Endpoints</CardTitle>
            <CardDescription>
              RESTful APIs and WebSocket connections for marketplace operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Product Catalog</h4>
                <ul className="text-sm space-y-1 font-mono">
                  <li>GET /products</li>
                  <li>POST /products</li>
                  <li>GET /products/:id</li>
                  <li>GET /products/sku/:sku</li>
                  <li>GET /products/taxonomy/*</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Order Book</h4>
                <ul className="text-sm space-y-1 font-mono">
                  <li>POST /order-book/orders</li>
                  <li>GET /order-book/products/:id/depth</li>
                  <li>GET /order-book/users/:id/orders</li>
                  <li>WS /order-book (real-time)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Search & Discovery</h4>
                <ul className="text-sm space-y-1 font-mono">
                  <li>GET /search/products</li>
                  <li>GET /search/autocomplete</li>
                  <li>GET /search/recommendations/:id</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demos */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Interactive Phase 3 Demos
          </h2>
          
          {/* Search Demo */}
          <div className="mb-16">
            <ProductSearch />
          </div>

          {/* Order Book Demo */}
          <div className="mb-16">
            <OrderBook />
          </div>
        </div>
      </div>

      {/* Next Phase Preview */}
      <div className="border-t bg-gradient-to-r from-slate-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Coming Next: Phase 4</h2>
            <p className="text-xl mb-8 text-slate-300">
              Compliance & Identity Management
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Age Verification</h4>
                <p className="text-sm text-slate-300">
                  Persona API integration for KYC and ID verification
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">License Verification</h4>
                <p className="text-sm text-slate-300">
                  TTB permit validation and state license cross-checking
                </p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Risk & Fraud Detection</h4>
                <p className="text-sm text-slate-300">
                  Behavioral analytics and transaction monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 