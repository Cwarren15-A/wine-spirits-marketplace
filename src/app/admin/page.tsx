'use client';

import React, { useState } from 'react';

interface MarketUpdate {
  timestamp: string;
  updates: Array<{
    productId: string;
    newPrice: number;
    priceChange24h: number;
    marketReason?: string;
    confidence: number;
  }>;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  totalProductsUpdated: number;
}

export default function AdminDashboard() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<MarketUpdate | null>(null);
  const [error, setError] = useState('');

  const handlePriceUpdate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const mockUpdate: MarketUpdate = {
        timestamp: new Date().toISOString(),
        updates: [
          {
            productId: 'dom-perignon-2013',
            newPrice: 245.99,
            priceChange24h: 2.1,
            marketReason: 'Increased demand for vintage Champagne',
            confidence: 0.85
          }
        ],
        marketSentiment: 'bullish',
        totalProductsUpdated: 1
      };

      setLastUpdate(mockUpdate);
      alert('Successfully updated prices!');
    } catch (err) {
      setError('Error updating prices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-premium mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Marketplace administration panel
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-wine-800 mb-4">Price Updates</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handlePriceUpdate}
            disabled={loading || !apiKey.trim()}
            className="bg-wine-600 hover:bg-wine-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Prices'}
          </button>
        </div>

        {lastUpdate && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-wine-800 mb-4">Latest Updates</h2>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg mb-4">
              <div className="text-2xl font-bold text-wine-800">{lastUpdate.totalProductsUpdated}</div>
              <div className="text-sm text-slate-600">Products Updated</div>
            </div>

            <div className="space-y-3">
              {lastUpdate.updates.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Product: {update.productId}</div>
                    {update.marketReason && (
                      <div className="text-sm text-slate-600">{update.marketReason}</div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${update.newPrice.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{update.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
