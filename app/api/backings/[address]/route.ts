import { NextRequest, NextResponse } from 'next/server';
import { UserBacking } from '@/lib/types';

// Mock user backings data - in production this would come from database/blockchain
const MOCK_USER_BACKINGS: { [address: string]: UserBacking[] } = {
  // Example user backings
  '0x1234567890123456789012345678901234567890': [
    {
      coupleId: '1',
      milestoneId: 1,
      amount: 1000000, // $1.00 USDC
      potentialWinnings: 1000000, // 1:1 payout for MVP
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      claimed: false
    },
    {
      coupleId: '2', 
      milestoneId: 2,
      amount: 2000000, // $2.00 USDC
      potentialWinnings: 2000000,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      claimed: false
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const addressLower = address.toLowerCase();
    const userBackings = MOCK_USER_BACKINGS[addressLower] || [];
    
    return NextResponse.json({ 
      backings: userBackings,
      total: userBackings.length,
      totalBacked: userBackings.reduce((sum, b) => sum + b.amount, 0),
      totalPotentialWinnings: userBackings.reduce((sum, b) => sum + b.potentialWinnings, 0)
    });
  } catch (error) {
    console.error('Error fetching user backings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backings' },
      { status: 500 }
    );
  }
}

// Add a new backing (called after successful blockchain transaction)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const addressLower = address.toLowerCase();
    const { coupleId, milestoneId, amount } = await request.json();
    
    const newBacking: UserBacking = {
      coupleId,
      milestoneId,
      amount,
      potentialWinnings: amount, // 1:1 for MVP
      timestamp: new Date(),
      claimed: false
    };
    
    // In production, save to database
    if (!MOCK_USER_BACKINGS[addressLower]) {
      MOCK_USER_BACKINGS[addressLower] = [];
    }
    MOCK_USER_BACKINGS[addressLower].push(newBacking);
    
    return NextResponse.json({ 
      success: true, 
      backing: newBacking 
    });
  } catch (error) {
    console.error('Error adding backing:', error);
    return NextResponse.json(
      { error: 'Failed to add backing' },
      { status: 500 }
    );
  }
}