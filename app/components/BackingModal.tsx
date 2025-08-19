"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FictionalCouple, Milestone } from '@/lib/types';
import { Button } from './DemoComponents';
import { Icon } from './DemoComponents';

interface BackingModalProps {
  couple: FictionalCouple;
  onClose: () => void;
  onBackingComplete: () => void;
}

interface SelectedMilestone extends Milestone {
  backingAmount: number;
}

export function BackingModal({ couple, onClose, onBackingComplete }: BackingModalProps) {
  const [selectedMilestones, setSelectedMilestones] = useState<SelectedMilestone[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(2)}`;
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

  const handleMilestoneToggle = (milestone: Milestone) => {
    const isSelected = selectedMilestones.some(m => m.id === milestone.id);
    
    if (isSelected) {
      // Remove milestone
      setSelectedMilestones(prev => prev.filter(m => m.id !== milestone.id));
    } else {
      // Add milestone with minimum backing amount
      const newSelected: SelectedMilestone = {
        ...milestone,
        backingAmount: milestone.minBackingAmount
      };
      setSelectedMilestones(prev => [...prev, newSelected]);
    }
  };


  const getTotalBacking = () => {
    return selectedMilestones.reduce((sum, m) => sum + m.backingAmount, 0);
  };

  const getTotalPotentialWinnings = () => {
    // For MVP: 1:1 payout
    return getTotalBacking();
  };

  const handleSubmitBacking = async () => {
    if (selectedMilestones.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate backing transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Backing submitted:', {
        couple: couple.id,
        milestones: selectedMilestones.map(m => ({
          id: m.id,
          amount: m.backingAmount
        })),
        total: getTotalBacking()
      });
      
      // In production, this would:
      // 1. Approve USDC spending
      // 2. Call ChemistryLab.backCouple() for each milestone
      // 3. Update local state
      // 4. Show success message
      
      onBackingComplete();
    } catch (error) {
      console.error('Backing failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMilestoneTypeIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'MESSAGES_50':
        return 'message-circle';
      case 'FIRST_DATE':
        return 'calendar';
      case 'THREE_DATES':
        return 'heart';
      case 'STILL_CHATTING':
        return 'clock';
      default:
        return 'target';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            Back {couple.partner1.name} & {couple.partner2.name}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<Icon name="x" size="sm" />}
          >
            Close
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {/* Couple summary */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto border-2 border-purple-200 bg-purple-100 flex items-center justify-center">
                  <Image
                    src={couple.partner1.avatar}
                    alt={couple.partner1.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="text-purple-600 font-bold text-sm">${couple.partner1.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <p className="text-xs font-medium mt-1">{couple.partner1.name}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Icon name="heart" size="sm" className="text-pink-500 mb-1" />
                <span className="text-xs font-bold text-purple-600">
                  {couple.chemistryScore}% Match
                </span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mx-auto border-2 border-pink-200 bg-pink-100 flex items-center justify-center">
                  <Image
                    src={couple.partner2.avatar}
                    alt={couple.partner2.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<div class="text-pink-600 font-bold text-sm">${couple.partner2.name.charAt(0)}</div>`;
                    }}
                  />
                </div>
                <p className="text-xs font-medium mt-1">{couple.partner2.name}</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 text-center">{couple.backstory}</p>
          </div>

          {/* Milestones */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Select Milestones to Back
            </h3>
            
            <div className="space-y-3">
              {couple.milestones.map((milestone) => {
                const isSelected = selectedMilestones.some(m => m.id === milestone.id);
                const selectedMilestone = selectedMilestones.find(m => m.id === milestone.id);
                
                return (
                  <div
                    key={milestone.id}
                    className={`
                      border rounded-lg p-3 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleMilestoneToggle(milestone)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          milestone.duration === 'short' ? 'bg-green-500' :
                          milestone.duration === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <Icon 
                          name={getMilestoneTypeIcon(milestone.type) as 'message-circle' | 'calendar' | 'heart' | 'clock' | 'target'} 
                          size="sm" 
                          className={isSelected ? 'text-purple-600' : 'text-gray-500'} 
                        />
                        <span className="text-sm font-medium text-gray-800">
                          {milestone.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          milestone.duration === 'short' ? 'bg-green-100 text-green-700' :
                          milestone.duration === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          ${(milestone.minBackingAmount / 1000000).toFixed(2)}
                        </span>
                        {isSelected && (
                          <Icon name="check-circle" size="sm" className="text-purple-600" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Min: {formatCurrency(milestone.minBackingAmount)}
                      </span>
                      <span className="text-gray-500">
                        {getTimeRemaining(milestone.deadline)}
                      </span>
                    </div>
                    
                    {/* Fixed amount display for selected milestones */}
                    {isSelected && selectedMilestone && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <div className="bg-white rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  milestone.duration === 'short' ? 'bg-green-500' :
                                  milestone.duration === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                                <span className="text-xs font-medium text-gray-700 capitalize">
                                  {milestone.duration} Term
                                </span>
                              </div>
                              <div className="text-lg font-bold text-purple-600">
                                ${(milestone.minBackingAmount / 1000000).toFixed(2)} USDC
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Potential Win</div>
                              <div className="text-sm font-semibold text-green-600">
                                ${((milestone.minBackingAmount * milestone.multiplier) / 100 / 1000000).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {selectedMilestones.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Backing:</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(getTotalBacking())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Potential Winnings:</span>
                <span className="font-semibold text-purple-600">
                  {formatCurrency(getTotalPotentialWinnings())}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmitBacking}
              disabled={selectedMilestones.length === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Backing...</span>
                </div>
              ) : (
                `Back for ${formatCurrency(getTotalBacking())}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}