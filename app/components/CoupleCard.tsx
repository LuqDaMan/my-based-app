"use client";

import React from 'react';
import { FictionalCouple } from '@/lib/types';
import { Icon } from './DemoComponents';

interface CoupleCardProps {
  couple: FictionalCouple;
  isBackground?: boolean;
}

export function CoupleCard({ couple, isBackground = false }: CoupleCardProps) {
  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(2)}`;
  };

  const getDaysAgo = (date: Date | string) => {
    const now = new Date();
    const matchDate = typeof date === 'string' ? new Date(date) : date;
    const diffTime = Math.abs(now.getTime() - matchDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  const getTimeRemaining = (deadline: Date | string) => {
    const now = new Date();
    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Expired';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const getChemistryColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`
      bg-white rounded-2xl shadow-lg border border-gray-200 h-full overflow-hidden
      ${isBackground ? 'opacity-80' : ''}
    `}>
      {/* Header with match info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="heart" size="sm" className="text-pink-500" />
            <span className="text-sm font-medium text-gray-700">
              Matched {getDaysAgo(couple.matchedAt)}
            </span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getChemistryColor(couple.chemistryScore)}`}>
            {couple.chemistryScore}% Chemistry
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">
            {couple.partner1.name} & {couple.partner2.name}
          </h2>
          <p className="text-sm text-gray-600 flex items-center justify-center mt-1">
            <Icon name="map-pin" size="xs" className="mr-1" />
            {couple.location}
          </p>
        </div>
      </div>

      {/* Partner profiles */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* Partner 1 */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-purple-200">
            <img
              src={couple.partner1.avatar}
              alt={couple.partner1.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-sm text-gray-800">{couple.partner1.name}</h3>
          <p className="text-xs text-gray-600">{couple.partner1.age} years old</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{couple.partner1.bio}</p>
          
          {/* Interests */}
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {couple.partner1.interests.slice(0, 2).map((interest, idx) => (
              <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Partner 2 */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 border-2 border-pink-200">
            <img
              src={couple.partner2.avatar}
              alt={couple.partner2.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-sm text-gray-800">{couple.partner2.name}</h3>
          <p className="text-xs text-gray-600">{couple.partner2.age} years old</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{couple.partner2.bio}</p>
          
          {/* Interests */}
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {couple.partner2.interests.slice(0, 2).map((interest, idx) => (
              <span key={idx} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Backstory */}
      <div className="px-4 pb-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-1 mb-2">
            <Icon name="message-circle" size="xs" className="text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Their Story</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-3">{couple.backstory}</p>
        </div>
      </div>

      {/* Milestones Preview */}
      <div className="px-4 pb-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <Icon name="target" size="sm" className="mr-1 text-purple-500" />
          Milestones to Back
        </h4>
        <div className="space-y-2">
          {couple.milestones.slice(0, 2).map((milestone) => (
            <div key={milestone.id} className="bg-white border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-800">{milestone.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-xs font-bold text-purple-600">
                    {formatCurrency(milestone.minBackingAmount)} min
                  </p>
                  <p className="text-xs text-gray-500">
                    {getTimeRemaining(milestone.deadline)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {couple.milestones.length > 2 && (
            <div className="text-center">
              <span className="text-xs text-gray-500">
                +{couple.milestones.length - 2} more milestones
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tap instruction at bottom */}
      {!isBackground && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-xs text-gray-400">
            Tap to see all milestones • Swipe to predict
          </p>
        </div>
      )}
    </div>
  );
}