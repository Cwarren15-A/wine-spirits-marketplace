'use client';

import React, { useState } from 'react';
import { runScheduledPriceUpdate, getMarketInsights } from '@/lib/openai-price-updater';

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
  const [marketCommentary, setMarketCommentary] = useState('');
  const [error, setError] = useState('');

  const handlePriceUpdate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const update = await runScheduledPriceUpdate(apiKey);
      setLastUpdate(update);
      
      // Show success message
      alert(`Successfully updated ${update.totalProductsUpdated} products with ${update.marketSentiment} sentiment!`);
    } catch (err) {
      setError(`Error updating prices: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarketInsights = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const insights = await getMarketInsights(apiKey);
      setLastUpdate(insights.updates);
      setMarketCommentary(insights.commentary);
      
      alert('Market insights generated successfully!');
    } catch (err) {
      setError(`Error generating insights: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-100';
      case 'bearish': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-premium mb-4">
            🍷 Marketplace Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Use your OpenAI API key to generate realistic price updates and keep the marketplace feeling live
          </p>
        </div>

        {/* API Key Input */}
        <div className="card-premium rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-wine-800 mb-4">OpenAI Configuration</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 border border-wine-200 rounded-lg focus:ring-2 focus:ring-wine-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 mt-1">
              Your API key is only used for this session and never stored
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handlePriceUpdate}
              disabled={loading || !apiKey.trim()}
              className="btn-premium px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Prices'}
            </button>
            
            <button
              onClick={handleMarketInsights}
              disabled={loading || !apiKey.trim()}
              className="btn-gold px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Market Insights'}
            </button>
          </div>
        </div>

        {/* Market Commentary */}
        {marketCommentary && (
          <div className="card-premium rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-wine-800 mb-4">📈 Market Commentary</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {marketCommentary}
            </p>
          </div>
        )}

        {/* Last Update Results */}
        {lastUpdate && (
          <div className="card-premium rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-wine-800 mb-4">📊 Latest Price Updates</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-wine-800">{lastUpdate.totalProductsUpdated}</div>
                <div className="text-sm text-slate-600">Products Updated</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className={`text-2xl font-bold capitalize ${getSentimentColor(lastUpdate.marketSentiment).split(' ')[0]}`}>
                  {lastUpdate.marketSentiment}
                </div>
                <div className="text-sm text-slate-600">Market Sentiment</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-wine-800">
                  {new Date(lastUpdate.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-sm text-slate-600">Last Updated</div>
              </div>
            </div>

            {/* Individual Updates */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-wine-800">Individual Price Changes</h3>
              {lastUpdate.updates.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Product ID: {update.productId}</div>
                    {update.marketReason && (
                      <div className="text-sm text-slate-600">{update.marketReason}</div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${update.newPrice.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${
                      update.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {update.priceChange24h > 0 ? '+' : ''}{update.priceChange24h.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div className="text-sm font-medium">
                      {(update.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card-premium rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-wine-800 mb-4">🔧 How It Works</h2>
          
          <div className="space-y-4 text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <strong>Enter your OpenAI API Key:</strong> Your personal API key is used to generate realistic market movements
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <strong>Update Prices:</strong> AI analyzes current products and generates realistic price movements based on market conditions
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <strong>Generate Insights:</strong> Get market commentary and comprehensive price updates with reasoning
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-wine-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <strong>Live Marketplace:</strong> Updated prices make the marketplace feel dynamic and real-time
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Run updates 1-2 times per day for realistic market movement</li>
              <li>• Price changes are based on actual market factors (seasonality, rarity, trends)</li>
              <li>• Each update affects 5-8 random products to simulate natural market activity</li>
              <li>• Updates include market reasoning to understand price movements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
