import { NextResponse } from 'next/server';

// Mock leaderboard data for MVP
const MOCK_LEADERBOARD_DATA = {
  topBackers: [
    {
      address: '0x1234...7890',
      username: 'CupidExpert',
      totalBacked: 50000000, // $50 USDC
      totalWon: 35000000, // $35 USDC
      successRate: 0.82,
      backingCount: 23
    },
    {
      address: '0xabcd...ef12',
      username: 'LoveWhisperer',
      totalBacked: 42000000, // $42 USDC
      totalWon: 28000000, // $28 USDC
      successRate: 0.78,
      backingCount: 19
    },
    {
      address: '0x5678...9abc',
      username: 'ChemistryPro',
      totalBacked: 38000000, // $38 USDC
      totalWon: 31000000, // $31 USDC
      successRate: 0.85,
      backingCount: 15
    },
    {
      address: '0xdef0...5678', 
      username: 'MatchMaker',
      totalBacked: 33000000, // $33 USDC
      totalWon: 20000000, // $20 USDC
      successRate: 0.71,
      backingCount: 17
    },
    {
      address: '0x9876...3210',
      username: 'VibeMaster',
      totalBacked: 29000000, // $29 USDC
      totalWon: 22000000, // $22 USDC
      successRate: 0.79,
      backingCount: 12
    }
  ],
  recentWins: [
    {
      username: 'CupidExpert',
      coupleNames: 'Alex & Sam',
      milestone: 'Exchange 50+ messages',
      winnings: 2000000, // $2 USDC
      timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
      username: 'ChemistryPro',
      coupleNames: 'Jordan & Taylor', 
      milestone: 'First date confirmed',
      winnings: 1500000, // $1.50 USDC
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      username: 'LoveWhisperer',
      coupleNames: 'Casey & Avery',
      milestone: 'Still chatting after 30 days',
      winnings: 3000000, // $3 USDC
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    }
  ],
  communityStats: {
    totalCouplesSupported: 147,
    totalUSDCBacked: 2450000000, // $2,450 USDC
    totalUSDCWon: 1820000000, // $1,820 USDC
    averageSuccessRate: 0.74,
    activeBakers: 89
  }
};

export async function GET() {
  try {
    return NextResponse.json(MOCK_LEADERBOARD_DATA);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}