"use client";

import React from 'react';
import { FictionalCouple } from '@/lib/types';
import { BaseButton } from './BaseBranding';

interface ShareToFarcasterProps {
  couple: FictionalCouple;
  type: 'match' | 'prediction' | 'result';
  className?: string;
}

export function ShareToFarcaster({ couple, type, className = '' }: ShareToFarcasterProps) {
  const generateShareText = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://baesed.app';
    
    switch (type) {
      case 'match':
        return `Just discovered ${couple.partner1.name} & ${couple.partner2.name} on @baesed! 💙 Their chemistry score is ${couple.chemistryScore}%. Think they'll make it? Come predict on Base! ${baseUrl}`;
      case 'prediction':
        return `Made my chemistry prediction for ${couple.partner1.name} & ${couple.partner2.name} on @baesed! 🔮 Join the Chemistry Lab on Base and help couples find love! ${baseUrl}`;
      case 'result':
        return `Chemistry prediction results are in! 🎉 Check out the latest matches on @baesed - where community helps love flourish on Base! ${baseUrl}`;
      default:
        return `Check out @baesed - the dating app built on Base where community predicts chemistry! 💙 ${baseUrl}`;
    }
  };

  const handleShare = () => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodedText}`;
    
    if (typeof window !== 'undefined') {
      window.open(farcasterUrl, '_blank', 'width=600,height=400');
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'match':
        return 'Share Match';
      case 'prediction':
        return 'Share Prediction';
      case 'result':
        return 'Share Results';
      default:
        return 'Share on Farcaster';
    }
  };

  return (
    <BaseButton
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={`flex items-center space-x-2 ${className}`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12c0-1.1.9-2 2-2h2V8c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6z"/>
      </svg>
      <span>{getButtonText()}</span>
    </BaseButton>
  );
}

interface CastFrameProps {
  couple: FictionalCouple;
  frameType: 'profile' | 'prediction' | 'leaderboard';
}

export function CastFrame({ couple, frameType }: CastFrameProps) {
  const frameData = {
    profile: {
      title: `${couple.partner1.name} & ${couple.partner2.name}`,
      description: `Chemistry Score: ${couple.chemistryScore}% | ${couple.location}`,
      image: `/api/frames/couple/${couple.id}`,
      buttons: [
        { label: 'View Profile' },
        { label: 'Make Prediction' },
        { label: 'Chemistry Lab' },
      ],
    },
    prediction: {
      title: 'Chemistry Prediction',
      description: 'Will this couple make it? Make your prediction!',
      image: `/api/frames/prediction/${couple.id}`,
      buttons: [
        { label: 'Spark! 💙' },
        { label: 'No Chemistry' },
        { label: 'Skip' },
      ],
    },
    leaderboard: {
      title: 'Chemistry Lab Leaderboard',
      description: 'Top Chemistry Predictors on Base',
      image: '/api/frames/leaderboard',
      buttons: [
        { label: 'View Full Board' },
        { label: 'Join Chemistry Lab' },
      ],
    },
  };

  const frame = frameData[frameType];

  return (
    <div className="hidden">
      {/* Meta tags for Farcaster frame - these would be injected into head */}
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:title" content={frame.title} />
      <meta property="fc:frame:description" content={frame.description} />
      <meta property="fc:frame:image" content={frame.image} />
      <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
      {frame.buttons.map((button, index) => (
        <meta
          key={index}
          property={`fc:frame:button:${index + 1}`}
          content={button.label}
        />
      ))}
      <meta property="fc:frame:post_url" content={`/api/frames/${frameType}`} />
    </div>
  );
}

// Component to encourage Farcaster connection
export function ConnectFarcaster({ className = '' }: { className?: string }) {
  const handleConnect = () => {
    // This would integrate with Farcaster auth
    console.log('Connect to Farcaster');
  };

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 12c0-1.1.9-2 2-2h2V8c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6z"/>
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-purple-800">
            Connect with Farcaster
          </h3>
          <p className="text-xs text-purple-600 mt-1">
            Share your chemistry predictions and connect with the community
          </p>
        </div>
        
        <BaseButton
          onClick={handleConnect}
          variant="secondary"
          size="sm"
        >
          Connect
        </BaseButton>
      </div>
    </div>
  );
}

// Social stats component
export function SocialStats({ 
  predictions = 0, 
  shares = 0, 
  followers = 0 
}: { 
  predictions?: number; 
  shares?: number; 
  followers?: number; 
}) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">{predictions}</div>
        <div className="text-xs text-blue-500">Predictions</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">{shares}</div>
        <div className="text-xs text-blue-500">Shares</div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600">{followers}</div>
        <div className="text-xs text-blue-500">Following</div>
      </div>
    </div>
  );
}