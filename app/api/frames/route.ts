import { NextRequest, NextResponse } from 'next/server';
import { BASE_META, FRAME_METADATA } from '@/lib/base-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'default';
  
  // Generate frame metadata based on type
  const generateFrameHTML = (type: string) => {
    const baseFrame = {
      version: FRAME_METADATA.version,
      image: `${BASE_META.url}/api/og?type=${type}`,
      imageAspectRatio: FRAME_METADATA.imageAspectRatio,
      postUrl: `${BASE_META.url}/api/frames/action`,
    };

    switch (type) {
      case 'couple':
        return {
          ...baseFrame,
          title: 'Chemistry Prediction',
          description: 'Make your chemistry prediction on Base!',
          buttons: [
            { label: 'Spark! 💙', action: 'post', target: `${BASE_META.url}/api/frames/predict?choice=spark` },
            { label: 'No Chemistry', action: 'post', target: `${BASE_META.url}/api/frames/predict?choice=no` },
            { label: 'View Profile', action: 'link', target: BASE_META.url },
          ],
        };
      
      case 'leaderboard':
        return {
          ...baseFrame,
          title: 'Chemistry Lab Leaderboard',
          description: 'Top Chemistry Predictors on Base',
          buttons: [
            { label: 'Join Chemistry Lab', action: 'link', target: BASE_META.url },
            { label: 'View Rankings', action: 'post', target: `${BASE_META.url}/api/frames/leaderboard` },
          ],
        };
      
      default:
        return {
          ...baseFrame,
          title: BASE_META.title,
          description: BASE_META.description,
          buttons: [
            { label: 'Start Swiping', action: 'link', target: BASE_META.url },
            { label: 'Chemistry Lab', action: 'link', target: `${BASE_META.url}?mode=chemistry` },
            { label: 'Leaderboard', action: 'link', target: `${BASE_META.url}?view=leaderboard` },
          ],
        };
    }
  };

  const frameData = generateFrameHTML(type);
  
  // Return HTML with proper frame metadata
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${frameData.title}</title>
        <meta name="description" content="${frameData.description}">
        
        <!-- Farcaster Frame Metadata -->
        <meta property="fc:frame" content="${frameData.version}">
        <meta property="fc:frame:image" content="${frameData.image}">
        <meta property="fc:frame:image:aspect_ratio" content="${frameData.imageAspectRatio}">
        <meta property="fc:frame:post_url" content="${frameData.postUrl}">
        
        ${frameData.buttons.map((button, index) => `
          <meta property="fc:frame:button:${index + 1}" content="${button.label}">
          ${button.action ? `<meta property="fc:frame:button:${index + 1}:action" content="${button.action}">` : ''}
          ${button.target ? `<meta property="fc:frame:button:${index + 1}:target" content="${button.target}">` : ''}
        `).join('')}
        
        <!-- Open Graph -->
        <meta property="og:title" content="${frameData.title}">
        <meta property="og:description" content="${frameData.description}">
        <meta property="og:image" content="${frameData.image}">
        <meta property="og:url" content="${BASE_META.url}">
        <meta property="og:type" content="website">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${frameData.title}">
        <meta name="twitter:description" content="${frameData.description}">
        <meta name="twitter:image" content="${frameData.image}">
      </head>
      <body>
        <div style="padding: 20px; text-align: center; font-family: system-ui;">
          <h1>${frameData.title}</h1>
          <p>${frameData.description}</p>
          <a href="${BASE_META.url}" style="display: inline-block; background: #0052FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Open BAEsed
          </a>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'max-age=300', // 5 minutes
    },
  });
}