'use client';

import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '📖' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'collection', label: 'Browse Collection', icon: '🍷' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-premium">🍷 Premium Spirits</span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-wine-600 bg-wine-50 border-b-2 border-wine-600'
                    : 'text-slate-600 hover:text-wine-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-slate-600 hover:text-wine-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-wine-600 bg-wine-50'
                    : 'text-slate-600 hover:text-wine-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
} 