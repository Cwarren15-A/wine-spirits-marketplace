'use client';

import React from 'react';

interface PriceSparklineProps {
  data: number[];
  className?: string;
}

export function PriceSparkline({ data, className = '' }: PriceSparklineProps) {
  if (!data || data.length === 0) {
    return <div className={`bg-gray-100 rounded ${className}`} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((max - value) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // green or red

  return (
    <div className={`relative ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
} 