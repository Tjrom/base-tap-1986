import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ICON_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  'Access-Control-Allow-Origin': '*',
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

export async function GET() {
  try {
    const path = join(process.cwd(), 'public', 'icon-1024.png');
    const buffer = await readFile(path);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        ...ICON_HEADERS,
        'Content-Length': String(buffer.length),
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
