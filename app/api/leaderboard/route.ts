import { NextRequest } from 'next/server';

type Leader = {
  name: string;
  score: number;
};

// Simple in-memory leaderboard for demo purposes.
// In production, replace with a persistent database (Vercel Postgres, Supabase, etc.).
const leaderboard: Leader[] = [];

export async function GET() {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 100);
  return Response.json({ leaderboard: sorted });
}

export async function POST(req: NextRequest) {
  const { name, score } = (await req.json()) as { name?: string; score?: number };
  if (!name || typeof score !== 'number' || score <= 0) {
    return new Response('Bad request', { status: 400 });
  }

  const trimmedName = name.slice(0, 24);

  const existing = leaderboard.find((l) => l.name === trimmedName);
  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    leaderboard.push({ name: trimmedName, score });
  }

  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 100);
  return Response.json({ leaderboard: sorted });
}

