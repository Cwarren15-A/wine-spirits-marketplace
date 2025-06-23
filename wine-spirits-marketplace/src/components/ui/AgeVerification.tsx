'use client';

import React, { useState, useEffect } from 'react';

interface AgeVerificationProps {
  onVerified: () => void;
}

export function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already been verified in this session
    const isVerified = sessionStorage.getItem('ageVerified');
    if (!isVerified) {
      setIsVisible(true);
    } else {
      onVerified();
    }
  }, [onVerified]);

  const handleVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      sessionStorage.setItem('ageVerified', 'true');
      setIsVisible(false);
      onVerified();
    } else {
      // Redirect to a safe page for underage users
      window.location.href = 'https://www.cdc.gov/alcohol/fact-sheets/underage-drinking.htm';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Wine Glass Icon */}
        <div className="text-6xl mb-6">🍷</div>
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-wine-900 mb-4">
          Age Verification Required
        </h2>
        
        <p className="text-slate-600 mb-6">
          You must be 21 years or older to access this wine and spirits marketplace. 
          Please verify your age to continue.
        </p>
        
        {/* Legal Notice */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-sm text-slate-600">
          <p className="font-semibold mb-2">📋 Legal Requirements:</p>
          <ul className="text-left space-y-1">
            <li>• Must be 21+ years old</li>
            <li>• Valid ID required for purchase</li>
            <li>• Adult signature delivery only</li>
            <li>• State shipping restrictions apply</li>
          </ul>
        </div>
        
        {/* Verification Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleVerify(true)}
            className="w-full bg-wine-600 hover:bg-wine-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            ✓ I am 21 years or older
          </button>
          
          <button
            onClick={() => handleVerify(false)}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            I am under 21
          </button>
        </div>
        
        {/* Footer */}
        <p className="text-xs text-slate-500 mt-6">
          By clicking "I am 21 years or older", you certify that you are of legal drinking age 
          and agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
} 