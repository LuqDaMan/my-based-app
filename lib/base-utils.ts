// Base ecosystem utilities for branding and Basename support

export const BASE_BRAND_COLORS = {
  primary: '#0052FF', // Base blue
  secondary: '#0052FF20', // Base blue with opacity
  accent: '#0052FF',
  gradient: 'from-blue-600 to-blue-700',
  text: 'text-blue-600',
  bg: 'bg-blue-50',
  border: 'border-blue-200',
  hover: 'hover:bg-blue-100',
} as const;

export const BASE_ECOSYSTEM_LINKS = {
  basescan: 'https://basescan.org',
  basename: 'https://base.org/names',
  bridge: 'https://bridge.base.org',
  ecosystem: 'https://base.org/ecosystem',
  docs: 'https://docs.base.org',
  farcaster: 'https://warpcast.com',
} as const;

// Basename utilities
export function formatBasename(basename: string): string {
  return basename.endsWith('.base.eth') ? basename : `${basename}.base.eth`;
}

export function isValidBasename(name: string): boolean {
  return /^[a-z0-9\-]+\.base\.eth$/.test(name);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function getDisplayName(basename?: string, address?: string): string {
  if (basename && isValidBasename(basename)) {
    return basename;
  }
  if (address) {
    return shortenAddress(address);
  }
  return 'Unknown';
}

// Base ecosystem metadata
export const BASE_META = {
  title: 'BAEsed - Chemistry Lab on Base',
  description: 'A Tinder-like, swipe-based dating app built for Farcaster and Base that transforms matchmaking into a community-driven experience.',
  image: '/api/og',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://baesed.app',
  twitterCard: 'summary_large_image',
  colorScheme: 'light',
  themeColor: BASE_BRAND_COLORS.primary,
} as const;

// Frame metadata for better Farcaster integration
export const FRAME_METADATA = {
  version: 'next',
  imageAspectRatio: '1.91:1',
  buttons: [
    { label: 'Start Swiping' },
    { label: 'Chemistry Lab' },
    { label: 'Leaderboard' },
  ],
} as const;