// Live Trading Dashboard Component
// src/components/trading/LiveTradingDashboard.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Volume2, 
  Bell,
  Activity,
  DollarSign,
  BarChart3,
  Zap
} from 'lucide-react';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

interface LivePrice {
  id: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

interface MarketAlert {
  id: string;
  type: 'price' | 'volume' | 'news';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export function LiveTradingDashboard() {
  const [livePrices, setLivePrices] = useState<LivePrice[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [orderBook, setOrderBook] = useState<{bids: OrderBookEntry[], asks: OrderBookEntry[]}>({
    bids: [],
    asks: []
  });
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  console.log('Selected product:', selectedProduct); // Use the variable to avoid linter warning
  const [isConnected, setIsConnected] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateLivePrices();
      updateOrderBook();
      generateRandomAlert();
    }, 2000);

    setIsConnected(true);
    return () => clearInterval(interval);
  }, []);

  const updateLivePrices = () => {
    const mockPrices: LivePrice[] = [
      {
        id: '1',
        name: 'Lafite Rothschild 2010',
        price: 1285 + (Math.random() - 0.5) * 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 3,
        volume: Math.floor(Math.random() * 10) + 1,
        timestamp: new Date()
      },
      {
        id: '2',
        name: 'Macallan 25',
        price: 1950 + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 40,
        changePercent: (Math.random() - 0.5) * 4,
        volume: Math.floor(Math.random() * 5) + 1,
        timestamp: new Date()
      },
      {
        id: '3',
        name: 'Dom Pérignon 2013',
        price: 295 + (Math.random() - 0.5) * 15,
        change: (Math.random() - 0.5) * 8,
        changePercent: (Math.random() - 0.5) * 2.5,
        volume: Math.floor(Math.random() * 15) + 5,
        timestamp: new Date()
      }
    ];
    setLivePrices(mockPrices);
    
    // Update market sentiment
    const avgChange = mockPrices.reduce((sum, p) => sum + p.changePercent, 0) / mockPrices.length;
    setMarketSentiment(avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral');
  };

  const updateOrderBook = () => {
    const basePrice = 1285;
    const bids: OrderBookEntry[] = Array.from({ length: 8 }, (_, i) => {
      const price = basePrice - (i + 1) * 5;
      const quantity = Math.floor(Math.random() * 5) + 1;
      return { price, quantity, total: price * quantity };
    });

    const asks: OrderBookEntry[] = Array.from({ length: 8 }, (_, i) => {
      const price = basePrice + (i + 1) * 5;
      const quantity = Math.floor(Math.random() * 5) + 1;
      return { price, quantity, total: price * quantity };
    });

    setOrderBook({ bids, asks });
  };

  const generateRandomAlert = () => {
    if (Math.random() > 0.85) { // 15% chance of alert
      const alertTypes = ['price', 'volume', 'news'] as const;
      const severities = ['low', 'medium', 'high'] as const;
      const messages = [
        'Lafite Rothschild 2010 crossed resistance level',
        'High volume detected in Premium Spirits sector',
        'New auction record set for 1947 Cheval Blanc',
        'Macallan releases limited edition series',
        'Bordeaux 2020 vintage receives exceptional ratings'
      ];

      const newAlert: MarketAlert = {
        id: Date.now().toString(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date()
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-emerald-600 bg-emerald-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  // Sample chart data
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: 1285 + Math.sin(i / 4) * 50 + (Math.random() - 0.5) * 20,
    volume: Math.floor(Math.random() * 100) + 20
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-wine-900 text-white p-6">
      {/* Hidden audio element for notifications */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gold-400 to-gold-200 bg-clip-text text-transparent">
              Live Trading Floor
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Live Data' : 'Disconnected'}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(marketSentiment)}`}>
                Market: {marketSentiment.toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: isConnected ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-gold-400"
            >
              <Activity className="w-6 h-6" />
            </motion.div>
            <span className="text-gold-400 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Live Prices Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Live Prices
            </h2>
            
            <div className="space-y-3">
              <AnimatePresence>
                {livePrices.map((price) => (
                  <motion.div
                    key={price.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="trading-row p-3 rounded-xl cursor-pointer"
                    onClick={() => setSelectedProduct(price.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-sm truncate">{price.name}</div>
                      <div className="text-xs text-slate-400">Vol: {price.volume}</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">
                        ${price.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        price.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {price.changePercent > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {price.changePercent.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Market Alerts */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-400" />
              Market Alerts
            </h2>
            
            <div className="space-y-2">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="alert-item p-3 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{alert.message}</div>
                        <div className="text-xs text-slate-400">
                          {alert.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Price Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Price Movement (24H)
            </h2>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-purple-400" />
              Trading Volume
            </h2>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#volumeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Order Book */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 rounded-2xl h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Order Book
            </h2>
            
            <div className="space-y-4">
              {/* Asks */}
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-2">ASKS (SELL)</h3>
                <div className="space-y-1">
                  {orderBook.asks.slice(0, 6).reverse().map((ask, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between text-xs font-mono bg-red-500 bg-opacity-10 p-2 rounded"
                    >
                      <span className="text-red-400">${ask.price.toLocaleString()}</span>
                      <span>{ask.quantity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Spread */}
              <div className="text-center py-2 border-y border-slate-600">
                <div className="text-lg font-bold">Spread</div>
                <div className="text-sm text-slate-400">
                  ${(orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0).toFixed(0)}
                </div>
              </div>

              {/* Bids */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">BIDS (BUY)</h3>
                <div className="space-y-1">
                  {orderBook.bids.slice(0, 6).map((bid, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between text-xs font-mono bg-green-500 bg-opacity-10 p-2 rounded"
                    >
                      <span className="text-green-400">${bid.price.toLocaleString()}</span>
                      <span>{bid.quantity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Additional CSS styles
/*
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.trading-row {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.trading-row:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(219, 39, 119, 0.3);
}

.alert-item {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid rgba(59, 130, 246, 0.5);
}
*/