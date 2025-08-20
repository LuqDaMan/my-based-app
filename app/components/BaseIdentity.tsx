"use client";

import React from 'react';
import { Name, Badge, Avatar } from '@coinbase/onchainkit/identity';
import { getDisplayName, isValidBasename } from '@/lib/base-utils';

interface BaseIdentityProps {
  address?: string;
  basename?: string;
  showAvatar?: boolean;
  showBadge?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BaseIdentity({ 
  address, 
  basename, 
  showAvatar = true, 
  showBadge = true,
  className = '',
  size = 'md'
}: BaseIdentityProps) {
  const displayName = getDisplayName(basename, address);
  const hasBasename = basename && isValidBasename(basename);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showAvatar && address && (
        <Avatar 
          address={address as `0x${string}`}
          className={`
            ${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'}
            border-2 border-blue-200
          `}
        />
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          {address ? (
            <Name 
              address={address as `0x${string}`}
              className={`${sizeClasses[size]} ${hasBasename ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            />
          ) : (
            <span className={`${sizeClasses[size]} text-gray-500`}>
              {displayName}
            </span>
          )}
          
          {showBadge && hasBasename && (
            <div className="flex items-center space-x-1">
              <Badge 
                className="w-4 h-4" 
                tooltip="Verified Basename"
              />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                .base.eth
              </span>
            </div>
          )}
        </div>
        
        {hasBasename && address && size !== 'sm' && (
          <span className="text-xs text-gray-500">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        )}
      </div>
    </div>
  );
}

// Simplified version for couple cards
export function CompactBaseIdentity({ 
  address, 
  basename, 
  className = '' 
}: Pick<BaseIdentityProps, 'address' | 'basename' | 'className'>) {
  const displayName = getDisplayName(basename, address);
  const hasBasename = basename && isValidBasename(basename);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <span className={`text-sm ${hasBasename ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
        {displayName}
      </span>
      {hasBasename && (
        <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}