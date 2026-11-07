/**
 * GET /api/rates → published lender rates (see api/_lib/rates.js). Takes no borrower input.
 * CDN-cached for 5 minutes; if every source fails, cached for only 15 seconds so it retries soon.
 */
import { collectRates } from './_lib/rates.js';

let memo = null; // { at, body, ok }

export async function GET() {
  const now = Date.now();
  if (!memo || now - memo.at > (memo.ok ? 300000 : 15000)) {
    const body = await collectRates(new Date(now));
    memo = { at: now, body, ok: body.sources.some((s) => s.status === 'ok') };
  }
  return new Response(JSON.stringify(memo.body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': memo.ok ? 'public, max-age=60, s-maxage=300, stale-while-revalidate=60' : 'public, max-age=15, s-maxage=15',
    },
  });
}
