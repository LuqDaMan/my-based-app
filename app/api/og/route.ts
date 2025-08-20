import { NextRequest, NextResponse } from 'next/server';
import { BASE_META, BASE_BRAND_COLORS } from '@/lib/base-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'default';
  const title = searchParams.get('title') || BASE_META.title;
  const description = searchParams.get('description') || BASE_META.description;

  // Since we don't have access to canvas/image generation in this environment,
  // we'll return an SVG that can be used as an OpenGraph image
  const generateOGImage = (type: string, title: string, description: string) => {
    const baseWidth = 1200;
    const baseHeight = 630;
    
    const svgContent = `
      <svg width="${baseWidth}" height="${baseHeight}" viewBox="0 0 ${baseWidth} ${baseHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background Gradient -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${BASE_BRAND_COLORS.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
          </linearGradient>
          
          <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(255,255,255,0.95);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(255,255,255,0.9);stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Base Logo Background Pattern -->
        <g opacity="0.1">
          ${Array.from({ length: 6 }, (_, i) => 
            Array.from({ length: 3 }, (_, j) => `
              <circle cx="${200 + i * 160}" cy="${150 + j * 160}" r="40" fill="white" opacity="${0.3 - (i + j) * 0.02}"/>
            `).join('')
          ).join('')}
        </g>
        
        <!-- Main Content Card -->
        <rect x="100" y="80" width="1000" height="470" rx="24" fill="url(#cardGradient)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
        
        <!-- Base Logo -->
        <g transform="translate(150, 120)">
          <circle cx="30" cy="30" r="30" fill="${BASE_BRAND_COLORS.primary}"/>
          <circle cx="30" cy="30" r="20" fill="none" stroke="white" stroke-width="3"/>
          <circle cx="30" cy="30" r="10" fill="white"/>
        </g>
        
        <!-- Title -->
        <text x="220" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="bold" fill="#1F2937">
          ${title.length > 25 ? title.substring(0, 25) + '...' : title}
        </text>
        
        <!-- Description -->
        <text x="220" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#6B7280">
          ${description.length > 60 ? description.substring(0, 60) + '...' : description}
        </text>
        
        <!-- Feature Icons -->
        <g transform="translate(220, 280)">
          <!-- Chemistry Icon -->
          <g>
            <circle cx="30" cy="30" r="25" fill="${BASE_BRAND_COLORS.secondary}" stroke="${BASE_BRAND_COLORS.primary}" stroke-width="2"/>
            <text x="30" y="38" font-family="system-ui" font-size="24" text-anchor="middle" fill="${BASE_BRAND_COLORS.primary}">⚗️</text>
            <text x="30" y="75" font-family="system-ui" font-size="16" text-anchor="middle" fill="#6B7280">Chemistry</text>
          </g>
          
          <!-- Community Icon -->
          <g transform="translate(120, 0)">
            <circle cx="30" cy="30" r="25" fill="${BASE_BRAND_COLORS.secondary}" stroke="${BASE_BRAND_COLORS.primary}" stroke-width="2"/>
            <text x="30" y="38" font-family="system-ui" font-size="24" text-anchor="middle" fill="${BASE_BRAND_COLORS.primary}">👥</text>
            <text x="30" y="75" font-family="system-ui" font-size="16" text-anchor="middle" fill="#6B7280">Community</text>
          </g>
          
          <!-- Base Icon -->
          <g transform="translate(240, 0)">
            <circle cx="30" cy="30" r="25" fill="${BASE_BRAND_COLORS.secondary}" stroke="${BASE_BRAND_COLORS.primary}" stroke-width="2"/>
            <circle cx="30" cy="30" r="12" fill="${BASE_BRAND_COLORS.primary}"/>
            <text x="30" y="75" font-family="system-ui" font-size="16" text-anchor="middle" fill="#6B7280">Base</text>
          </g>
        </g>
        
        <!-- Call to Action -->
        <rect x="700" y="350" width="250" height="60" rx="30" fill="${BASE_BRAND_COLORS.primary}"/>
        <text x="825" y="390" font-family="system-ui" font-size="20" font-weight="bold" text-anchor="middle" fill="white">
          ${type === 'couple' ? 'Make Prediction' : type === 'leaderboard' ? 'View Rankings' : 'Start Swiping'}
        </text>
        
        <!-- Bottom Branding -->
        <text x="600" y="520" font-family="system-ui" font-size="24" font-weight="bold" text-anchor="middle" fill="#1F2937">
          Powered by Base
        </text>
        
        <!-- URL -->
        <text x="600" y="550" font-family="system-ui" font-size="18" text-anchor="middle" fill="#6B7280">
          ${BASE_META.url.replace('https://', '')}
        </text>
      </svg>
    `;
    
    return svgContent;
  };

  const svgImage = generateOGImage(type, title, description);

  return new NextResponse(svgImage, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000', // 1 year
    },
  });
}