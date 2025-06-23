// Enhanced Product Card Component with Luxury Feel
// src/components/marketplace/LuxuryProductCard.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Product, utils } from '@/lib/api';
import { TrendBadge } from '@/components/ui/TrendBadge';
import { PriceSparkline } from '@/components/ui/PriceSparkline';

interface LuxuryProductCardProps {
  product: Product;
  index: number;
}

export function LuxuryProductCard({ product, index }: LuxuryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mock price history for sparkline
  const mockPriceHistory = Array.from({ length: 30 }, (_, i) => {
    const basePrice = product.current_price || product.base_price;
    const variation = (Math.sin(i / 5) + Math.random() * 0.1 - 0.05) * 0.1;
    return basePrice * (1 + variation);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative"
    >
      <Link href={`/marketplace/product/${product.id}`}>
        <motion.div
          className="luxury-card overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ 
            y: -12,
            rotateY: 2,
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(219, 39, 119, 0.1)',
            borderRadius: '24px',
            boxShadow: isHovered 
              ? '0 25px 60px rgba(190, 24, 93, 0.25), 0 0 0 1px rgba(219, 39, 119, 0.2)' 
              : '0 8px 32px rgba(190, 24, 93, 0.1)',
          }}
        >
          {/* Luxury Glow Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, rgba(219, 39, 119, 0.1), rgba(245, 158, 11, 0.1))',
              borderRadius: '24px',
            }}
          />

          {/* Product Image Section */}
          <div className="relative h-80 overflow-hidden">
            {/* Premium Badge Overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <AnimatePresence>
                {product.featured && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="luxury-badge featured"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>FEATURED</span>
                  </motion.div>
                )}
                {product.investment_grade && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1 }}
                    className="luxury-badge investment"
                  >
                    <Award className="w-3 h-3" />
                    <span>INVESTMENT</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance Indicators */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              {product.price_change_24h && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrendBadge pct={product.price_change_24h} size="sm" />
                </motion.div>
              )}
              {product.fiveYearPriceChangePct !== undefined && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TrendBadge pct={product.fiveYearPriceChangePct} size="sm" />
                </motion.div>
              )}
            </div>

            {/* Enhanced Image with Loading Animation */}
            <div className="relative w-full h-full bg-gradient-to-br from-wine-100 via-gold-50 to-wine-50">
              {!imageLoaded && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-16 h-16 border-4 border-wine-200 border-t-wine-600 rounded-full" />
                </motion.div>
              )}
              
              {product.primary_image_url ? (
                <motion.img
                  src={product.primary_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ 
                    scale: imageLoaded ? (isHovered ? 1.05 : 1) : 1.1, 
                    opacity: imageLoaded ? 1 : 0 
                  }}
                  transition={{ duration: 0.5 }}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    setImageLoaded(true);
                  }}
                />
              ) : (
                <motion.div
                  className="flex items-center justify-center h-full text-8xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {utils.getProductIcon(product.type)}
                </motion.div>
              )}

              {/* Hover Overlay with Quick Actions */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, y: 20 }}
                      className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
                    >
                      <Eye className="w-5 h-5 text-wine-600" />
                      <span className="text-wine-800 font-semibold">View Details</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Sparkline Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent">
              <div className="absolute bottom-2 left-4 right-4">
                <PriceSparkline 
                  data={mockPriceHistory} 
                  className="h-8"
                  color="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Product Information */}
          <div className="p-6">
            {/* Header with Vintage */}
            <motion.div 
              className="mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="luxury-label">
                  {product.type.toUpperCase()} • {product.vintage || 'NV'}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.floor(product.rarity_score || 0) 
                          ? 'bg-gold-500' 
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <h3 className="luxury-title text-xl font-bold text-wine-900 mb-1 group-hover:text-wine-700 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-wine-600 font-medium">
                {product.producer} • {product.region}
              </p>
            </motion.div>

            {/* Investment Performance Section */}
            {product.fiveYearPriceChangePct !== undefined && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-wine-50 rounded-xl border border-emerald-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    5-Year Performance
                  </span>
                  <TrendBadge pct={product.fiveYearPriceChangePct} size="md" />
                </div>
                <div className="text-xs text-slate-600">
                  CAGR: {((Math.pow(1 + (product.fiveYearPriceChangePct / 100), 1/5) - 1) * 100).toFixed(1)}%
                </div>
              </motion.div>
            )}

            {/* Price Section with Luxury Styling */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="border-t border-wine-100 pt-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="luxury-price text-2xl font-bold text-wine-900">
                    {utils.formatPrice(product.current_price || product.base_price)}
                  </div>
                  {product.current_price && product.current_price !== product.base_price && (
                    <div className="text-sm text-slate-500 line-through">
                      {utils.formatPrice(product.base_price)}
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="luxury-button px-6 py-2 text-sm font-semibold rounded-xl"
                >
                  Trade Now
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Premium Shimmer Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{
              background: [
                'linear-gradient(90deg, transparent, transparent)',
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                'linear-gradient(90deg, transparent, transparent)',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Additional CSS to add to globals.css
/*
.luxury-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-badge {
  @apply flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md;
}

.luxury-badge.featured {
  @apply bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg;
}

.luxury-badge.investment {
  @apply bg-gradient-to-r from-wine-600 to-wine-700 text-white shadow-lg;
}

.luxury-label {
  @apply text-sm text-wine-600 font-semibold tracking-wide;
}

.luxury-title {
  @apply font-serif;
  font-family: 'Playfair Display', Georgia, serif;
}

.luxury-price {
  @apply font-serif;
  font-family: 'Playfair Display', Georgia, serif;
}

.luxury-button {
  @apply bg-gradient-to-r from-wine-600 to-wine-700 text-white shadow-lg;
  @apply hover:from-wine-700 hover:to-wine-800 transition-all duration-300;
}
*/