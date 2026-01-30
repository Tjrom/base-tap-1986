import type { Metadata } from 'next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://your-vercel-url.vercel.app';

export const metadata: Metadata = {
  title: 'BASE TAP 1986',
  description: 'Retro 80s tap game mini-app on Base',
  other: {
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: `${APP_URL}/embed-image.png`,
      button: {
        title: 'Launch BASE TAP 1986',
        action: {
          type: 'launch_miniapp',
          name: 'BASE TAP 1986',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash-image.png`,
          splashBackgroundColor: '#000000'
        }
      }
    })
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-root">
          <div className="retro-horizon" />
          <div className="retro-floor" />
          {children}
        </div>
      </body>
    </html>
  );
}

