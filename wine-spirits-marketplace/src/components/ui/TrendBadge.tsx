'use client';

import React from 'react';

interface TrendBadgeProps {
  pct: number;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendBadge({ pct, size = 'md' }: TrendBadgeProps) {
  const isPositive = pct >= 0;
  const isNeutral = Math.abs(pct) < 0.1;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const colorClasses = isNeutral 
    ? 'bg-gray-100 text-gray-600'
    : isPositive 
      ? 'bg-green-100 text-green-700 border border-green-200' 
      : 'bg-red-100 text-red-700 border border-red-200';

  const icon = isNeutral ? '→' : isPositive ? '↗' : '↘';
  const sign = isPositive && !isNeutral ? '+' : '';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${colorClasses}`}>
      <span>{icon}</span>
      <span>{sign}{pct.toFixed(1)}%</span>
    </span>
  );
} 