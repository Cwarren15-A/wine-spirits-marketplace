"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderBookEntry {
  price: number;
  quantity: number;
  orders: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface RecentTrade {
  id: string;
  price: number;
  quantity: number;
  timestamp: Date;
  type: 'buy' | 'sell';
}

export default function OrderBook({ productId = 'sample-product' }: { productId?: string }) {
  const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [orderForm, setOrderForm] = useState({
    type: 'bid' as 'bid' | 'ask',
    price: '',
    quantity: '1',
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Simulate WebSocket connection and load sample data
    setConnected(true);
    loadSampleData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      updateOrderBook();
    }, 5000);

    return () => clearInterval(interval);
  }, [productId]);

  const loadSampleData = () => {
    // Sample order book data
    setOrderBook({
      bids: [
        { price: 125.00, quantity: 2, orders: 1 },
        { price: 124.50, quantity: 1, orders: 1 },
        { price: 124.00, quantity: 3, orders: 2 },
        { price: 123.50, quantity: 1, orders: 1 },
        { price: 123.00, quantity: 2, orders: 1 },
      ],
      asks: [
        { price: 127.00, quantity: 1, orders: 1 },
        { price: 127.50, quantity: 2, orders: 1 },
        { price: 128.00, quantity: 1, orders: 1 },
        { price: 128.50, quantity: 3, orders: 2 },
        { price: 129.00, quantity: 1, orders: 1 },
      ],
    });

    // Sample recent trades
    setRecentTrades([
      { id: '1', price: 126.00, quantity: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5), type: 'buy' },
      { id: '2', price: 125.50, quantity: 2, timestamp: new Date(Date.now() - 1000 * 60 * 15), type: 'sell' },
      { id: '3', price: 126.25, quantity: 1, timestamp: new Date(Date.now() - 1000 * 60 * 30), type: 'buy' },
      { id: '4', price: 125.75, quantity: 3, timestamp: new Date(Date.now() - 1000 * 60 * 45), type: 'sell' },
    ]);
  };

  const updateOrderBook = () => {
    // Simulate minor price movements
    setOrderBook(prev => ({
      bids: prev.bids.map(bid => ({
        ...bid,
        price: bid.price + (Math.random() - 0.5) * 0.5,
        quantity: Math.max(1, bid.quantity + Math.floor((Math.random() - 0.5) * 2)),
      })),
      asks: prev.asks.map(ask => ({
        ...ask,
        price: ask.price + (Math.random() - 0.5) * 0.5,
        quantity: Math.max(1, ask.quantity + Math.floor((Math.random() - 0.5) * 2)),
      })),
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('http://localhost:3001/order-book/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          user_id: 'sample-user-id',
          order_type: orderForm.type,
          price: parseFloat(orderForm.price),
          quantity: parseInt(orderForm.quantity),
          age_verified: true,
          shipping_state: 'CA',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order placed:', result);
        // Reset form
        setOrderForm({ type: 'bid', price: '', quantity: '1' });
        // In a real app, the WebSocket would update the order book
        loadSampleData();
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBestBid = () => orderBook.bids[0]?.price || 0;
  const getBestAsk = () => orderBook.asks[0]?.price || 0;
  const getSpread = () => getBestAsk() - getBestBid();
  const getSpreadPercent = () => (getSpread() / getBestAsk()) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
          Order Book & Market Depth
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          Phase 3: Real-time bid/ask matching with price-time priority algorithm
        </p>

        {/* Market Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Best Bid</div>
              <div className="text-xl font-bold text-green-600">
                {formatPrice(getBestBid())}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Best Ask</div>
              <div className="text-xl font-bold text-red-600">
                {formatPrice(getBestAsk())}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Spread</div>
              <div className="text-xl font-bold">
                {formatPrice(getSpread())}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-500">Spread %</div>
              <div className="text-xl font-bold">
                {getSpreadPercent().toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-slate-600">
            {connected ? 'Real-time data connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Book */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Market Depth</CardTitle>
              <CardDescription>
                Live order book with bid/ask levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Bids */}
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">
                    Bids (Buy Orders)
                  </h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 text-xs text-slate-500 pb-2 border-b">
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>Orders</span>
                    </div>
                    {orderBook.bids.map((bid, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 text-sm hover:bg-green-50 p-1 rounded"
                      >
                        <span className="font-mono text-green-600">
                          {formatPrice(bid.price)}
                        </span>
                        <span>{bid.quantity}</span>
                        <span className="text-slate-500">{bid.orders}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks */}
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">
                    Asks (Sell Orders)
                  </h4>
                  <div className="space-y-1">
                    <div className="grid grid-cols-3 text-xs text-slate-500 pb-2 border-b">
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>Orders</span>
                    </div>
                    {orderBook.asks.map((ask, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 text-sm hover:bg-red-50 p-1 rounded"
                      >
                        <span className="font-mono text-red-600">
                          {formatPrice(ask.price)}
                        </span>
                        <span>{ask.quantity}</span>
                        <span className="text-slate-500">{ask.orders}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Form & Recent Trades */}
        <div className="space-y-6">
          {/* Place Order */}
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>
                Submit bid/ask orders to the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={orderForm.type === 'bid' ? 'default' : 'outline'}
                  onClick={() => setOrderForm({ ...orderForm, type: 'bid' })}
                  className="text-green-600"
                >
                  Buy (Bid)
                </Button>
                <Button
                  variant={orderForm.type === 'ask' ? 'default' : 'outline'}
                  onClick={() => setOrderForm({ ...orderForm, type: 'ask' })}
                  className="text-red-600"
                >
                  Sell (Ask)
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={orderForm.price}
                  onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                />
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                variant="wine"
                disabled={!orderForm.price || !orderForm.quantity}
              >
                Place {orderForm.type === 'bid' ? 'Buy' : 'Sell'} Order
              </Button>

              <div className="text-xs text-slate-500 space-y-1">
                <p>• Age verification required (21+)</p>
                <p>• Adult signature delivery</p>
                <p>• TTB compliance enforced</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                Latest executed orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-3 text-xs text-slate-500 pb-2 border-b">
                  <span>Price</span>
                  <span>Qty</span>
                  <span>Time</span>
                </div>
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="grid grid-cols-3 text-sm"
                  >
                    <span
                      className={`font-mono ${
                        trade.type === 'buy' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatPrice(trade.price)}
                    </span>
                    <span>{trade.quantity}</span>
                    <span className="text-slate-500">
                      {formatTime(trade.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 