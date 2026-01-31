import type { Metadata } from 'next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://basetap-1986.vercel.app';

export const metadata: Metadata = {
  title: 'BASE TAP 1986',
  description: 'Retro 80s tap game mini-app on Base',
  other: {
    'base:app_id': '697d94252aafa0bc9ad8a22c',
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: `${APP_URL}/og-1200x630.png`,
      button: {
        title: 'Launch BASE TAP 1986',
        action: {
          type: 'launch_miniapp',
          name: 'BASE TAP 1986',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/og-1200x630.png`,
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
      <head>
        <meta name="base:app_id" content="697d94252aafa0bc9ad8a22c" />
      </head>
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

