"use client";

import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { FictionalCouple } from '@/lib/types';
import { CoupleCard } from './CoupleCard';
import { usePredictionStore } from '@/lib/store';

interface CoupleSwipeStackProps {
  couples: FictionalCouple[];
  currentIndex: number;
  onSwipe: (action: 'left' | 'right' | 'up', couple: FictionalCouple) => void;
}

export function CoupleSwipeStack({ couples, currentIndex, onSwipe }: CoupleSwipeStackProps) {
  const { setSwipeInProgress, nextCouple } = usePredictionStore();
  const [gone] = useState(() => new Set());
  
  const currentCouple = couples[currentIndex];
  const nextCoupleData = currentIndex + 1 < couples.length ? couples[currentIndex + 1] : null;

  // Spring animation for the current card
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    opacity: 1,
    config: { tension: 300, friction: 30 }
  }));

  // Spring for the next card (background card)
  const [nextProps] = useSpring(() => ({
    scale: 0.95,
    opacity: 0.8,
    y: 10,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({
    active,
    movement: [mx, my],
    direction: [xDir, yDir],
    velocity: [vx, vy],
    cancel
  }) => {
    if (!currentCouple) return;

    const trigger = Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2;
    const isGone = !active && trigger;
    
    let swipeDirection: 'left' | 'right' | 'up' | null = null;
    
    if (isGone) {
      setSwipeInProgress(true);
      
      // Determine swipe direction
      if (Math.abs(mx) > Math.abs(my)) {
        // Horizontal swipe
        swipeDirection = mx > 0 ? 'right' : 'left';
      } else if (my < -50) {
        // Upward swipe
        swipeDirection = 'up';
      }
      
      if (swipeDirection) {
        // Animate card off screen
        const x = swipeDirection === 'left' ? -window.innerWidth : 
                  swipeDirection === 'right' ? window.innerWidth : 0;
        const y = swipeDirection === 'up' ? -window.innerHeight : 0;
        const rot = swipeDirection === 'left' ? -10 : 
                   swipeDirection === 'right' ? 10 : 0;
        
        api.start({
          x,
          y,
          rot,
          scale: 0.8,
          opacity: 0,
          config: { tension: 200, friction: 20 },
          onRest: () => {
            // After animation completes, trigger the callback and move to next
            onSwipe(swipeDirection as 'left' | 'right' | 'up', currentCouple);
            nextCouple();
            
            // Reset card position for next card
            api.start({
              x: 0,
              y: 0,
              rot: 0,
              scale: 1,
              opacity: 1,
              immediate: true
            });
            
            setSwipeInProgress(false);
          }
        });
      }
    } else {
      // Active drag - follow finger with constraints
      const x = active ? mx : 0;
      const y = active ? my : 0;
      const rot = active ? mx / 10 : 0;
      const scale = active ? 1 - Math.abs(mx) / 1000 : 1;
      
      api.start({
        x,
        y: Math.max(y, -100), // Limit upward movement
        rot,
        scale: Math.max(scale, 0.9),
        opacity: 1,
        immediate: active,
        config: { tension: active ? 800 : 300, friction: active ? 40 : 30 }
      });
    }
  });

  if (!currentCouple) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>No more couples to review</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full">
      {/* Background card (next couple) */}
      {nextCoupleData && (
        <animated.div
          style={nextProps}
          className="absolute inset-0 will-change-transform"
        >
          <CoupleCard couple={nextCoupleData} isBackground />
        </animated.div>
      )}
      
      {/* Current card */}
      <animated.div
        {...bind()}
        style={{
          ...props,
          touchAction: 'none',
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform"
      >
        <CoupleCard couple={currentCouple} />
      </animated.div>

      {/* Swipe indicators */}
      <animated.div
        style={{
          opacity: props.x.to(x => Math.max(0, Math.min(1, x / 100))),
        }}
        className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none"
      >
        BACK! 💕
      </animated.div>
      
      <animated.div
        style={{
          opacity: props.x.to(x => Math.max(0, Math.min(1, -x / 100))),
        }}
        className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none"
      >
        NO CHEMISTRY 💔
      </animated.div>
      
      <animated.div
        style={{
          opacity: props.y.to(y => Math.max(0, Math.min(1, -y / 50))),
        }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold pointer-events-none"
      >
        SKIP ⏭️
      </animated.div>
    </div>
  );
}