"use client";

import React from 'react';
import { useNetworkSwitch } from '@/app/hooks/useNetworkSwitch';
import { BaseLogo } from './BaseBranding';

export function NetworkStatus() {
  const { isCorrectNetwork, promptNetworkSwitch, isInMiniKit } = useNetworkSwitch();
  
  if (isCorrectNetwork) {
    return null; // Don't show anything when on correct network
  }

  const { shouldShowWarning, instructions, isMainnet } = promptNetworkSwitch();

  if (!shouldShowWarning) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 p-3">
      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Switch to Base {isMainnet ? 'Mainnet' : 'Sepolia'}
            </h3>
            <p className="text-xs text-yellow-700 mt-1">
              {instructions}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <BaseLogo size="sm" />
          </div>
        </div>
        
        {isInMiniKit && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <BaseLogo size="xs" />
              <p className="text-xs text-blue-700">
                Switch networks in your wallet settings to access Base ecosystem features
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Network info component for the main app
export function NetworkInfo() {
  const { isCorrectNetwork, promptNetworkSwitch } = useNetworkSwitch();
  const { isMainnet } = promptNetworkSwitch();
  
  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>
        Base {isMainnet ? 'Mainnet' : 'Sepolia'}
      </span>
      {isCorrectNetwork && (
        <span className="text-green-600">✓</span>
      )}
    </div>
  );
}