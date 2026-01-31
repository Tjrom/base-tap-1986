const URL = process.env.NEXT_PUBLIC_URL as string | undefined;

export async function GET() {
  const baseUrl = URL || 'https://basetap-1986.vercel.app';

  const manifest = {
    accountAssociation: {
      // Paste from Base Build after Verify: https://www.base.dev/preview?tab=account
      header: '',
      payload: '',
      signature: ''
    },
    miniapp: {
      version: '1',
      name: 'BASE TAP 1986',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/icon-1024.png`,
      splashImageUrl: `${baseUrl}/og-1200x630.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: `${baseUrl}/api/webhook`,
      subtitle: 'Retro coin tap game on Base',
      description: 'Tap the coin, climb the leaderboard, share your score. GM on Base and 80s vibes.',
      screenshotUrls: [
        `${baseUrl}/screenshot-1.png`,
        `${baseUrl}/screenshot-2.png`,
        `${baseUrl}/screenshot-3.png`
      ],
      primaryCategory: 'games',
      tags: ['tapper', 'retro', 'base', 'miniapp', 'games'],
      heroImageUrl: `${baseUrl}/og-1200x630.png`,
      tagline: 'Tap like it’s 1986',
      ogTitle: 'BASE TAP 1986',
      ogDescription: 'Retro coin tap game on Base.',
      ogImageUrl: `${baseUrl}/og-1200x630.png`
    }
  };

  return Response.json(manifest);
}

