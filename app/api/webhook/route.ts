// Stub webhook endpoint referenced by the manifest.
// Extend this to handle game events, rewards, etc.

export async function POST(req: Request) {
  const body = await req.text();
  console.log('Received webhook payload:', body);
  return new Response('ok');
}

