import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const path = join(process.cwd(), 'public', 'icon-1024.png');
    const buffer = await readFile(path);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Content-Length': String(buffer.length)
      }
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
