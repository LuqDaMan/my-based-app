export interface PredictionMarket {
    id: string;
    title: string;
    description: string;
    category: 'crypto' | 'sports' | 'social' | 'farcaster';
    endDate: Date;
    totalPool: bigint;
    yesOdds: number;
    noOdds: number;
    imageUrl?: string;
    createdBy: string;
    status: 'active' | 'resolved' | 'cancelled';
    outcome?: boolean;
    tags: string[];
}

export interface UserPrediction {
    id: string;
    marketId: string;
    userId: string;
    prediction: boolean; // true = YES, false = NO
    amount: bigint;
    odds: number;
    timestamp: Date;
    status: 'pending' | 'won' | 'lost';
}

export interface UserProfile {
    fid: number;
    username: string;
    displayName: string;
    avatar: string;
    walletAddress?: string;
    totalPredictions: number;
    correctPredictions: number;
    totalWinnings: bigint;
    rank: number;
    joinDate: Date;
}

export interface SwipeAction {
    direction: 'left' | 'right' | 'up';
    marketId: string;
    prediction?: boolean;
    amount?: bigint;
}

// Chemistry Lab Types for MVP
export interface FictionalCouple {
    id: string;
    partner1: {
        name: string;
        age: number;
        bio: string;
        avatar: string;
        interests: string[];
    };
    partner2: {
        name: string;
        age: number;
        bio: string;
        avatar: string;
        interests: string[];
    };
    matchedAt: Date;
    chemistryScore: number; // 0-100 visual indicator
    milestones: Milestone[];
    backstory: string; // Why they might succeed
    location: string;
}

export interface Milestone {
    id: number;
    type: 'MESSAGES_50' | 'FIRST_DATE' | 'THREE_DATES' | 'STILL_CHATTING';
    title: string;
    description: string;
    duration: 'short' | 'medium' | 'long'; // Duration category for pricing
    multiplier: number; // 100 = 1.0x, 200 = 2.0x
    deadline: Date;
    minBackingAmount: number; // USDC amount in smallest unit (6 decimals)
    totalBacked: number;
    totalBackers: number;
    resolved: boolean;
    successful?: boolean;
}

export interface UserBacking {
    coupleId: string;
    milestoneId: number;
    amount: number; // USDC amount in smallest unit
    potentialWinnings: number;
    timestamp: Date;
    claimed: boolean;
}

export interface ClaimableReward {
    coupleId: string;
    milestoneId: number;
    amount: number;
    milestone: Milestone;
    couple: FictionalCouple;
}

export interface ChemistrySwipeAction {
    direction: 'left' | 'right' | 'up'; // left = No Chemistry, right = Back This Couple, up = Skip
    coupleId: string;
    selectedMilestones?: number[];
    backingAmounts?: { [milestoneId: number]: number };
}
