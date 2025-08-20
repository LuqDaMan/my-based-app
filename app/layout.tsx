import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { BASE_META, FRAME_METADATA } from "@/lib/base-utils";
import "@/lib/error-handler";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: BASE_META.colorScheme,
  themeColor: BASE_META.themeColor,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || BASE_META.url;
  return {
    title: BASE_META.title,
    description: BASE_META.description,
    keywords: ["Base", "Dating", "Farcaster", "Chemistry", "OnchainKit", "Web3", "Crypto"],
    authors: [{ name: "BAEsed Team" }],
    openGraph: {
      title: BASE_META.title,
      description: BASE_META.description,
      url: BASE_META.url,
      siteName: "BAEsed",
      images: [
        {
          url: BASE_META.image,
          width: 1200,
          height: 630,
          alt: BASE_META.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: BASE_META.twitterCard,
      title: BASE_META.title,
      description: BASE_META.description,
      images: [BASE_META.image],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: FRAME_METADATA.version,
        imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || BASE_META.image,
        imageAspectRatio: FRAME_METADATA.imageAspectRatio,
        button: {
          title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BAEsed"}`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "BAEsed",
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || BASE_META.themeColor,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
