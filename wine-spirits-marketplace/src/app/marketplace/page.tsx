import React from 'react';
import { ProductSearch } from '@/components/marketplace/product-search';
import { getFeaturedProducts } from '@/lib/products';

export default async function MarketplacePage() {
  // Get featured products for initial display
  const featuredProducts = getFeaturedProducts();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      <ProductSearch initialProducts={featuredProducts} />
    </div>
  );
} 