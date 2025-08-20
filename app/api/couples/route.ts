import { NextResponse } from 'next/server';
import { FictionalCouple } from '@/lib/types';

// Fictional couples data for Chemistry Lab MVP
const FICTIONAL_COUPLES: FictionalCouple[] = [
  {
    id: "1",
    partner1: {
      name: "Alex Chen",
      age: 28,
      bio: "Software engineer who loves hiking and cooking",
      avatar: "https://i.pravatar.cc/150?u=alex",
      interests: ["coding", "hiking", "cooking", "photography"],
      walletAddress: "0x1234567890123456789012345678901234567890",
      basename: "alexchen.base.eth"
    },
    partner2: {
      name: "Sam Rivera",
      age: 26, 
      bio: "Graphic designer with a passion for coffee and art",
      avatar: "https://i.pravatar.cc/150?u=sam",
      interests: ["design", "coffee", "art", "traveling"],
      walletAddress: "0x2345678901234567890123456789012345678901",
      basename: "samrivera.base.eth"
    },
    matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    chemistryScore: 87,
    backstory: "Both met at a local coffee shop where Sam was sketching and Alex was working on a laptop. They bonded over their shared love of creative problem-solving and have been texting non-stop since their match!",
    location: "San Francisco, CA",
    milestones: [
      {
        id: 1,
        type: 'MESSAGES_50',
        title: "Exchange 50+ messages in 7 days",
        description: "They're already at 30 messages in 2 days!",
        duration: 'short',
        multiplier: 200, // 2.0x
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        minBackingAmount: 500000, // $0.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 2,
        type: 'FIRST_DATE',
        title: "Go on first date within 14 days",
        description: "Alex already suggested visiting that art gallery Sam mentioned",
        duration: 'medium',
        multiplier: 150, // 1.5x
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        minBackingAmount: 1000000, // $1.00 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 3,
        type: 'THREE_DATES',
        title: "3+ dates in 30 days",
        description: "Will their creative chemistry translate to real romance?",
        duration: 'long',
        multiplier: 100, // 1.0x
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 4,
        type: 'STILL_CHATTING',
        title: "Still chatting after 30 days",
        description: "Long-term compatibility vibes are strong",
        duration: 'long',
        multiplier: 120, // 1.2x
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      }
    ]
  },
  {
    id: "2", 
    partner1: {
      name: "Jordan Blake",
      age: 31,
      bio: "Marketing manager who runs marathons and loves dogs",
      avatar: "https://i.pravatar.cc/150?u=jordan",
      interests: ["running", "dogs", "marketing", "fitness"],
      walletAddress: "0x3456789012345678901234567890123456789012",
      basename: "jordanblake.base.eth"
    },
    partner2: {
      name: "Taylor Kim",
      age: 29,
      bio: "Veterinarian with a rescue dog and weekend hiking habit",
      avatar: "https://i.pravatar.cc/150?u=taylor", 
      interests: ["animals", "hiking", "rescue dogs", "nature"],
      walletAddress: "0x4567890123456789012345678901234567890123"
      // Taylor doesn't have a Basename - will show address instead
    },
    matchedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    chemistryScore: 94,
    backstory: "Perfect match alert! Both love dogs, staying active, and helping others. Jordan's been sending Taylor pics of every dog they see on runs, and Taylor's been sharing rescue success stories. This could be the one!",
    location: "Austin, TX",
    milestones: [
      {
        id: 1,
        type: 'MESSAGES_50',
        title: "Exchange 50+ messages in 7 days",
        description: "Already at 45 messages with no signs of slowing down!",
        duration: 'short',
        multiplier: 200,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        minBackingAmount: 500000, // $0.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 2,
        type: 'FIRST_DATE',
        title: "Go on first date within 14 days", 
        description: "Taylor suggested a dog park meetup - genius first date!",
        duration: 'medium',
        multiplier: 150,
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1000000, // $1.00 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 3,
        type: 'THREE_DATES',
        title: "3+ dates in 30 days",
        description: "With this much in common, multiple dates seem inevitable",
        duration: 'long',
        multiplier: 100,
        deadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 4,
        type: 'STILL_CHATTING',
        title: "Still chatting after 30 days",
        description: "Shared values and lifestyle - built to last?",
        duration: 'long',
        multiplier: 120,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      }
    ]
  },
  {
    id: "3",
    partner1: {
      name: "Maya Patel",
      age: 25,
      bio: "Data scientist who makes pottery in her spare time",
      avatar: "https://i.pravatar.cc/150?u=maya",
      interests: ["data science", "pottery", "mindfulness", "tea"],
      walletAddress: "0x5678901234567890123456789012345678901234",
      basename: "mayapatel.base.eth"
    },
    partner2: {
      name: "Rio Santos",
      age: 27,
      bio: "Chef experimenting with fusion cuisine and meditation",
      avatar: "https://i.pravatar.cc/150?u=rio",
      interests: ["cooking", "meditation", "fusion food", "philosophy"],
      walletAddress: "0x6789012345678901234567890123456789012345"
      // Rio doesn't have a Basename yet
    },
    matchedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    chemistryScore: 76,
    backstory: "An intriguing match of analytical mind meets creative soul. Maya's precision-focused approach could complement Rio's intuitive cooking style. They're both into mindful living - early conversations have been deep and thoughtful.",
    location: "Portland, OR",
    milestones: [
      {
        id: 1,
        type: 'MESSAGES_50',
        title: "Exchange 50+ messages in 7 days",
        description: "Started with philosophical discussions - quality over quantity so far",
        duration: 'short',
        multiplier: 200,
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        minBackingAmount: 500000, // $0.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 2,
        type: 'FIRST_DATE',
        title: "Go on first date within 14 days",
        description: "Rio mentioned wanting to cook for someone special...",
        duration: 'medium',
        multiplier: 150,
        deadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1000000, // $1.00 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 3,
        type: 'THREE_DATES',
        title: "3+ dates in 30 days",
        description: "Different personalities - will opposites attract?",
        duration: 'long',
        multiplier: 100,
        deadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 4,
        type: 'STILL_CHATTING',
        title: "Still chatting after 30 days",
        description: "Mindful approach might lead to something lasting",
        duration: 'long',
        multiplier: 120,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      }
    ]
  },
  {
    id: "4",
    partner1: {
      name: "Casey Wright",
      age: 30,
      bio: "Music teacher who plays in a weekend band",
      avatar: "https://i.pravatar.cc/150?u=casey",
      interests: ["music", "teaching", "indie bands", "vinyl records"]
    },
    partner2: {
      name: "Avery Moon",
      age: 28,
      bio: "Podcast producer who writes music reviews",
      avatar: "https://i.pravatar.cc/150?u=avery",
      interests: ["podcasts", "music journalism", "concerts", "storytelling"]
    },
    matchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    chemistryScore: 91,
    backstory: "Music soulmates! Casey sent Avery a voice message of them playing guitar, and Avery responded with a mini podcast episode about their favorite song. They've been sharing playlists and have already planned to attend a concert together.",
    location: "Nashville, TN",
    milestones: [
      {
        id: 1,
        type: 'MESSAGES_50',
        title: "Exchange 50+ messages in 7 days",
        description: "Voice messages and music sharing count as messages, right?",
        duration: 'short',
        multiplier: 200,
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        minBackingAmount: 500000, // $0.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 2,
        type: 'FIRST_DATE',
        title: "Go on first date within 14 days",
        description: "Concert tickets are already purchased!",
        duration: 'medium',
        multiplier: 150,
        deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1000000, // $1.00 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 3,
        type: 'THREE_DATES',
        title: "3+ dates in 30 days",
        description: "Shared passion for music = endless date ideas",
        duration: 'long',
        multiplier: 100,
        deadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 4,
        type: 'STILL_CHATTING',
        title: "Still chatting after 30 days", 
        description: "When you speak the same language (music), it's magic",
        duration: 'long',
        multiplier: 120,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      }
    ]
  },
  {
    id: "5",
    partner1: {
      name: "Quinn Foster",
      age: 26,
      bio: "Environmental lawyer who kayaks every weekend",
      avatar: "https://i.pravatar.cc/150?u=quinn",
      interests: ["environmental law", "kayaking", "sustainability", "ocean conservation"]
    },
    partner2: {
      name: "Sage Wilson",
      age: 24,
      bio: "Marine biologist working on coral reef restoration",
      avatar: "https://i.pravatar.cc/150?u=sage",
      interests: ["marine biology", "coral reefs", "diving", "environmental science"]
    },
    matchedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    chemistryScore: 89,
    backstory: "Ocean lovers unite! Quinn fights for environmental justice while Sage works hands-on with marine ecosystems. Their first conversation lasted 3 hours discussing ocean conservation. Both are passionate about making a difference - could this be love AND a power couple?",
    location: "San Diego, CA",
    milestones: [
      {
        id: 1,
        type: 'MESSAGES_50',
        title: "Exchange 50+ messages in 7 days",
        description: "Deep conversations about saving the planet - already at 40+ messages",
        duration: 'short',
        multiplier: 200,
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now!
        minBackingAmount: 500000, // $0.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 2,
        type: 'FIRST_DATE',
        title: "Go on first date within 14 days",
        description: "Beach cleanup date planned for this weekend!",
        duration: 'medium',
        multiplier: 150,
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1000000, // $1.00 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 3,
        type: 'THREE_DATES',
        title: "3+ dates in 30 days",
        description: "Shared mission = multiple reasons to meet up",
        duration: 'long',
        multiplier: 100,
        deadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      },
      {
        id: 4,
        type: 'STILL_CHATTING',
        title: "Still chatting after 30 days",
        description: "Changing the world together - relationship goals!",
        duration: 'long',
        multiplier: 120,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minBackingAmount: 1500000, // $1.50 USDC
        totalBacked: 0,
        totalBackers: 0,
        resolved: false
      }
    ]
  }
];

export async function GET() {
  try {
    // Return all couples for Chemistry Lab
    return NextResponse.json({ 
      couples: FICTIONAL_COUPLES,
      total: FICTIONAL_COUPLES.length 
    });
  } catch (error) {
    console.error('Error fetching couples:', error);
    return NextResponse.json(
      { error: 'Failed to fetch couples' }, 
      { status: 500 }
    );
  }
}

// For getting individual couple data
export async function POST(request: Request) {
  try {
    const { coupleId } = await request.json();
    
    const couple = FICTIONAL_COUPLES.find(c => c.id === coupleId);
    
    if (!couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ couple });
  } catch (error) {
    console.error('Error fetching couple:', error);
    return NextResponse.json(
      { error: 'Failed to fetch couple' },
      { status: 500 }
    );
  }
}