"use client";

import React from 'react';
import { BASE_BRAND_COLORS } from '@/lib/base-utils';

interface BaseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function BaseLogo({ size = 'md', className = '' }: BaseLogoProps) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill={BASE_BRAND_COLORS.primary}/>
        <path 
          d="M20 8C25.52 8 30 12.48 30 18C30 23.52 25.52 28 20 28C14.48 28 10 23.52 10 18C10 12.48 14.48 8 20 8ZM20 11C16.14 11 13 14.14 13 18C13 21.86 16.14 25 20 25C23.86 25 27 21.86 27 18C27 14.14 23.86 11 20 11ZM20 14C22.21 14 24 15.79 24 18C24 20.21 22.21 22 20 22C17.79 22 16 20.21 16 18C16 15.79 17.79 14 20 14Z" 
          fill="white"
        />
      </svg>
    </div>
  );
}

interface PoweredByBaseProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

export function PoweredByBase({ className = '', variant = 'horizontal', size = 'sm' }: PoweredByBaseProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const logoSize = size === 'sm' ? 'xs' : 'sm';

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-1 ${className}`}>
        <BaseLogo size={logoSize} />
        <span className={`${textSize} text-gray-500 font-medium`}>
          Powered by Base
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className={`${textSize} text-gray-500`}>
        Powered by
      </span>
      <BaseLogo size={logoSize} />
      <span className={`${textSize} font-semibold text-blue-600`}>
        Base
      </span>
    </div>
  );
}

interface BaseEcosystemLinkProps {
  type: 'basescan' | 'basename' | 'bridge' | 'ecosystem' | 'docs';
  children: React.ReactNode;
  className?: string;
}

export function BaseEcosystemLink({ type, children, className = '' }: BaseEcosystemLinkProps) {
  const links = {
    basescan: 'https://basescan.org',
    basename: 'https://base.org/names',
    bridge: 'https://bridge.base.org',
    ecosystem: 'https://base.org/ecosystem',
    docs: 'https://docs.base.org',
  };

  return (
    <a
      href={links[type]}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg
        bg-blue-50 text-blue-700 hover:bg-blue-100 
        transition-colors duration-200 text-sm font-medium
        ${className}
      `}
    >
      <BaseLogo size="xs" />
      <span>{children}</span>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// Base-themed gradient background
export function BaseGradientBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 ${className}`} />
  );
}

// Base-themed button component
interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function BaseButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false 
}: BaseButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-blue-50',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}