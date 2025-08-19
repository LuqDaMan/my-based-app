"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { usePredictionStore } from '@/lib/store';
import { FictionalCouple } from '@/lib/types';
import { CoupleSwipeStack } from './CoupleSwipeStack';
import { BackingModal } from './BackingModal';
import { Button } from './DemoComponents';
import { Icon } from './DemoComponents';

interface ChemistryLabProps {
  setActiveTab?: (tab: string) => void;
}

export function ChemistryLab({ setActiveTab }: ChemistryLabProps = {}) {
  const {
    couples,
    setCouples,
    currentCoupleIndex,
    showBackingModal,
    setShowBackingModal,
    selectedCouple,
    setSelectedCouple,
  } = usePredictionStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch couples data on component mount
  const fetchCouples = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/couples');
      if (!response.ok) {
        throw new Error('Failed to fetch couples');
      }
      
      const data = await response.json();
      setCouples(data.couples);
    } catch (err) {
      console.error('Error fetching couples:', err);
      setError('Failed to load couples. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setCouples]);

  useEffect(() => {
    fetchCouples();
  }, [fetchCouples]);

  const handleCoupleSwipe = (action: 'left' | 'right' | 'up', couple: FictionalCouple) => {
    if (action === 'right') {
      // "Back This Couple" - show backing modal
      setSelectedCouple(couple);
      setShowBackingModal(true);
    } else if (action === 'left') {
      // "No Chemistry" - just move to next
      console.log(`No chemistry prediction for ${couple.partner1.name} & ${couple.partner2.name}`);
    } else if (action === 'up') {
      // "Skip" - move to next without prediction
      console.log(`Skipped ${couple.partner1.name} & ${couple.partner2.name}`);
    }
  };

  const handleBackingComplete = () => {
    setShowBackingModal(false);
    setSelectedCouple(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
        <p className="text-purple-600 font-medium">Loading Chemistry Lab...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <Icon name="alert-circle" size="lg" className="mx-auto mb-2" />
          <p className="font-medium">{error}</p>
        </div>
        <Button
          onClick={fetchCouples}
          variant="ghost"
          size="sm"
          className="text-purple-600"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (couples.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center text-gray-500">
          <Icon name="heart" size="lg" className="mx-auto mb-2" />
          <p className="font-medium">No couples available</p>
          <p className="text-sm">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  const hasMoreCouples = currentCoupleIndex < couples.length - 1;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {setActiveTab && (
          <Button
            onClick={() => setActiveTab('home')}
            variant="ghost"
            size="sm"
            icon={<Icon name="arrow-left" size="sm" />}
          >
            Back
          </Button>
        )}
        {!setActiveTab && <div />}
        
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chemistry Lab
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {currentCoupleIndex + 1} of {couples.length}
          </p>
        </div>
        
        {setActiveTab && (
          <Button
            onClick={() => setActiveTab('portfolio')}
            variant="ghost"
            size="sm"
            icon={<Icon name="user" size="sm" />}
          >
            Portfolio
          </Button>
        )}
        {!setActiveTab && <div />}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Icon name="arrow-left" size="xs" />
            <span>No Chemistry</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="arrow-up" size="xs" />
            <span>Skip</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="arrow-right" size="xs" />
            <span>Back Couple</span>
          </div>
        </div>
      </div>

      {/* Swipe Stack */}
      <div className="flex-1 relative">
        <CoupleSwipeStack
          couples={couples}
          currentIndex={currentCoupleIndex}
          onSwipe={handleCoupleSwipe}
        />
      </div>

      {/* End of couples message */}
      {!hasMoreCouples && currentCoupleIndex >= couples.length - 1 && (
        <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
          <Icon name="check-circle" size="lg" className="mx-auto mb-2 text-green-500" />
          <p className="font-medium text-gray-700">You&apos;ve seen all couples!</p>
          <p className="text-sm text-gray-500 mt-1">
            Check back later for new matches to support
          </p>
          {setActiveTab && (
            <Button
              onClick={() => setActiveTab('portfolio')}
              className="mt-3"
              size="sm"
            >
              View My Backings
            </Button>
          )}
        </div>
      )}

      {/* Backing Modal */}
      {showBackingModal && selectedCouple && (
        <BackingModal
          couple={selectedCouple}
          onClose={() => setShowBackingModal(false)}
          onBackingComplete={handleBackingComplete}
        />
      )}
    </div>
  );
}