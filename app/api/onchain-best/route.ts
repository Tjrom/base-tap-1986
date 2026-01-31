import { NextRequest } from 'next/server';

const RPC = 'https://mainnet.base.org';
// bestScore(address) selector = first 4 bytes of keccak256("bestScore(address)")
const BEST_SCORE_SELECTOR = '0x7185f5a2';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  const contract = process.env.NEXT_PUBLIC_LEADERBOARD_CONTRACT;
  if (!address || !contract || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return Response.json({ best: 0 }, { status: 200 });
  }
  const padded = address.slice(2).toLowerCase().padStart(64, '0');
  const data = BEST_SCORE_SELECTOR + padded;
  try {
    const res = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: contract, data }, 'latest']
      })
    });
    const json = (await res.json()) as { result?: string };
    const hex = json.result ?? '0x0';
    const best = parseInt(hex, 16);
    return Response.json({ best: Number.isNaN(best) ? 0 : best });
  } catch {
    return Response.json({ best: 0 });
  }
}
