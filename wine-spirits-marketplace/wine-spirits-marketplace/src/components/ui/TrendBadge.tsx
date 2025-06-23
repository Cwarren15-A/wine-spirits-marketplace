import React from 'react';
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TrendBadgeProps {
  pct: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendBadge({ pct, className = "", size = 'md' }: TrendBadgeProps) {
  const isPositive = pct > 0;
  const isNeutral = Math.abs(pct) < 0.1;
  
  // Color classes based on trend
  const colorClass = isNeutral 
    ? "bg-slate-100 text-slate-600"
    : isPositive 
      ? "bg-emerald-100 text-emerald-700" 
      : "bg-rose-100 text-rose-700";
  
  // Icon based on trend
  const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;
  
  // Size classes
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-0.5 text-xs",
    lg: "px-2.5 py-1 text-sm"
  };
  
  const iconSizes = {
    sm: "size-2.5",
    md: "size-3",
    lg: "size-3.5"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClass} ${sizeClasses[size]} ${className}`}>
      <Icon className={iconSizes[size]} />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
} 