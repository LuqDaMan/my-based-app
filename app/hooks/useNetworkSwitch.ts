"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useNetworkSwitch() {
  const { chain } = useAccount();
  const { context } = useMiniKit();
  const [, setCurrentChainId] = useState<string | null>(null);

  // Support both Base mainnet and testnet
  const isDevelopment = process.env.NODE_ENV === 'development';
  const targetChain = isDevelopment ? baseSepolia : base;
  const isCorrectNetwork = chain?.id === targetChain.id;

  // Monitor chain changes via window.ethereum (for detection only)
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const updateChainId = () => {
        if (window.ethereum?.chainId) {
          setCurrentChainId(window.ethereum.chainId);
        }
      };

      updateChainId();

      // Listen for chain changes
      if (window.ethereum.on) {
        window.ethereum.on('chainChanged', updateChainId);
        return () => {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener('chainChanged', updateChainId);
          }
        };
      }
    }
  }, []);

  // For MiniKit apps, we should guide users to switch manually
  // rather than programmatically switching which can interfere with MiniKit
  const promptNetworkSwitch = () => {
    const networkName = isDevelopment ? 'Base Sepolia' : 'Base';
    const chainId = isDevelopment ? '84532' : '8453';
    
    return {
      shouldShowWarning: !isCorrectNetwork,
      instructions: `Please switch to ${networkName} (Chain ID: ${chainId}) in your wallet settings to use this app on the Base ecosystem.`,
      targetChain,
      isMainnet: !isDevelopment,
    };
  };

  return {
    isCorrectNetwork,
    currentChainId: chain?.id,
    promptNetworkSwitch,
    isInMiniKit: !!context,
  };
}
