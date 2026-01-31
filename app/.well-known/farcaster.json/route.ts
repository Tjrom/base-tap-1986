const URL = process.env.NEXT_PUBLIC_URL as string | undefined;

export async function GET() {
  const baseUrl = URL || 'https://your-vercel-url.vercel.app';

  const manifest = {
    accountAssociation: {
      // Заполни через Base Build Account association tool:
      // https://www.base.dev/preview?tab=account
      header: '',
      payload: '',
      signature: ''
    },
    miniapp: {
      version: '1',
      name: 'BASE TAP 1986',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/blue-icon.png`,
      splashImageUrl: `${baseUrl}/blue-hero.png`,
      splashBackgroundColor: '#000000',
      webhookUrl: `${baseUrl}/api/webhook`,
      subtitle: 'Retro coin tap game on Base',
      description: 'Tap the coin, climb the leaderboard, share your score. GM on Base and 80s vibes.',
      screenshotUrls: [`${baseUrl}/screenshot-portrait.png`],
      primaryCategory: 'games',
      tags: ['tapper', 'retro', 'base', 'miniapp', 'games'],
      heroImageUrl: `${baseUrl}/blue-hero.png`,
      tagline: 'Tap like it’s 1986',
      ogTitle: 'BASE TAP 1986',
      ogDescription: 'Retro coin tap game on Base.',
      ogImageUrl: `${baseUrl}/blue-hero.png`
    }
  };

  return Response.json(manifest);
}

