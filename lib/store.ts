import { create } from 'zustand';
import { PredictionMarket, UserPrediction, UserProfile, FictionalCouple, UserBacking, ClaimableReward } from './types';

interface PredictionStore {
    // User state
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;

    // Markets state
    markets: PredictionMarket[];
    currentMarketIndex: number;
    setMarkets: (markets: PredictionMarket[]) => void;
    nextMarket: () => void;

    // Predictions state
    userPredictions: UserPrediction[];
    addPrediction: (prediction: UserPrediction) => void;

    // UI state
    isSwipeInProgress: boolean;
    setSwipeInProgress: (inProgress: boolean) => void;
    showPredictionModal: boolean;
    setShowPredictionModal: (show: boolean) => void;

    // Chemistry Lab state
    currentMode: 'discovery' | 'chemistry';
    setCurrentMode: (mode: 'discovery' | 'chemistry') => void;
    
    // Couples state
    couples: FictionalCouple[];
    currentCoupleIndex: number;
    setCouples: (couples: FictionalCouple[]) => void;
    nextCouple: () => void;
    
    // Backing state
    userBackings: UserBacking[];
    claimableRewards: ClaimableReward[];
    addBacking: (backing: UserBacking) => void;
    setClaimableRewards: (rewards: ClaimableReward[]) => void;
    
    // Chemistry Lab UI state
    showBackingModal: boolean;
    setShowBackingModal: (show: boolean) => void;
    selectedCouple: FictionalCouple | null;
    setSelectedCouple: (couple: FictionalCouple | null) => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
    // User state
    user: null,
    setUser: (user) => set({ user }),

    // Markets state
    markets: [],
    currentMarketIndex: 0,
    setMarkets: (markets) => set({ markets, currentMarketIndex: 0 }),
    nextMarket: () => set((state) => ({
        currentMarketIndex: Math.min(state.currentMarketIndex + 1, state.markets.length - 1)
    })),

    // Predictions state
    userPredictions: [],
    addPrediction: (prediction) => set((state) => ({
        userPredictions: [...state.userPredictions, prediction]
    })),

    // UI state
    isSwipeInProgress: false,
    setSwipeInProgress: (inProgress) => set({ isSwipeInProgress: inProgress }),
    showPredictionModal: false,
    setShowPredictionModal: (show) => set({ showPredictionModal: show }),

    // Chemistry Lab state
    currentMode: 'chemistry',
    setCurrentMode: (mode) => set({ currentMode: mode }),
    
    // Couples state
    couples: [],
    currentCoupleIndex: 0,
    setCouples: (couples) => set({ couples, currentCoupleIndex: 0 }),
    nextCouple: () => set((state) => ({
        currentCoupleIndex: Math.min(state.currentCoupleIndex + 1, state.couples.length - 1)
    })),
    
    // Backing state
    userBackings: [],
    claimableRewards: [],
    addBacking: (backing) => set((state) => ({
        userBackings: [...state.userBackings, backing]
    })),
    setClaimableRewards: (rewards) => set({ claimableRewards: rewards }),
    
    // Chemistry Lab UI state
    showBackingModal: false,
    setShowBackingModal: (show) => set({ showBackingModal: show }),
    selectedCouple: null,
    setSelectedCouple: (couple) => set({ selectedCouple: couple }),
}));
