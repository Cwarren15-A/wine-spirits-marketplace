"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface PriceSparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

export function PriceSparkline({ 
  data, 
  className = "", 
  color = "currentColor" 
}: PriceSparklineProps) {
  // Transform data for recharts
  const chartData = data.map((price, index) => ({ 
    index, 
    price 
  }));

  // Determine trend color based on first vs last price
  const trendColor = data.length >= 2 && data[data.length - 1] > data[0] 
    ? "#10b981" // green for upward trend
    : "#ef4444"; // red for downward trend

  const strokeColor = color === "currentColor" ? trendColor : color;

  return (
    <div className={`w-full h-10 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 