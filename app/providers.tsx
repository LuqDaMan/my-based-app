"use client";

import { type ReactNode } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";

export function Providers({ children }: { children: ReactNode }) {
  // Use Base mainnet in production, Base Sepolia in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const chain = isDevelopment ? baseSepolia : base;
  
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!}
      chain={chain}
      config={{
        appearance: {
          mode: "auto",
          theme: "base-dating",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BAEsed",
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
        wallet: {
          display: 'modal',
        }
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
