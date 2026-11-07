#!/usr/bin/env node
/**
 * Front Door daily check. Keeps rates, program facts, and News current.
 *
 *   ANTHROPIC_API_KEY=... npm run daily-check                # normal run
 *   npm run daily-check -- --dry-run                          # fetch + compare, no AI calls, no writes
 *   npm run daily-check -- --verify-all                       # ask the model about every page (first run / audit)
 *
 * 1. Rate: reads Freddie Mac's public PMMS CSV and updates src/data/rate.json (no AI needed).
 * 2. Pages: fetches each official page in scripts/watchlist.json (polite: identifies itself,
 *    respects robots.txt, one request per page) and fingerprints its text.
 * 3. Only if a page's text changed (or --verify-all), asks a small model (Haiku by default)
 *    whether the app's claim is still correct. Changes become News items marked
 *    "Found by daily check" (auto: true, verified: false) for a human to review.
 * 4. Writes public/updates/status.json and public/updates/news.json, and appends one line per
 *    model call to docs/daily-check-log.jsonl (tokens + cost when PRICE_* env vars are set).
 *
 * In GitHub Actions the results land in a pull request, so a person approves every change.
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  watchlist: join(ROOT, 'scripts', 'watchlist.json'),
  status: join(ROOT, 'public', 'updates', 'status.json'),
  news: join(ROOT, 'public', 'updates', 'news.json'),
  rate: join(ROOT, 'src', 'data', 'rate.json'),
  log: join(ROOT, 'docs', 'daily-check-log.jsonl'),
};
const PMMS_CSV = 'https://www.freddiemac.com/pmms/docs/PMMS_history.csv';
const UA = 'FrontDoorDailyCheck/1.0 (homebuyer education project; checks public program pages once a day)';

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const VERIFY_ALL = args.includes('--verify-all');
const MODEL = process.env.CHECK_MODEL || 'claude-haiku-5-5';
const PRICE_IN = process.env.PRICE_INPUT_PER_MTOK ? Number(process.env.PRICE_INPUT_PER_MTOK) : null;
const PRICE_OUT = process.env.PRICE_OUTPUT_PER_MTOK ? Number(process.env.PRICE_OUTPUT_PER_MTOK) : null;
const TODAY = new Date().toISOString().slice(0, 10);

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);
const writeJson = (p, data) => { if (!DRY) writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`); };

// ── helpers ─────────────────────────────────────────────────────────
async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,text/csv,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  return { status: res.status, ok: res.ok, text: res.ok ? await res.text() : '' };
}

const robotsCache = new Map();
async function allowedByRobots(url) {
  const { origin, pathname } = new URL(url);
  if (!robotsCache.has(origin)) {
    let rules = [];
    try {
      const r = await get(`${origin}/robots.txt`);
      if (r.ok) {
        let applies = false;
        for (const line of r.text.split('\n')) {
          const [k, ...v] = line.split(':');
          const key = k.trim().toLowerCase();
          const val = v.join(':').trim();
          if (key === 'user-agent') applies = val === '*' || UA.toLowerCase().includes(val.toLowerCase());
          else if (applies && key === 'disallow' && val) rules.push(val);
        }
      }
    } catch { rules = []; }
    robotsCache.set(origin, rules);
  }
  return !robotsCache.get(origin).some((rule) => pathname.startsWith(rule));
}

function pageText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&ndash;|&mdash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

// ── 1. rate from Freddie Mac PMMS CSV ───────────────────────────────
async function checkRate(news) {
  const rate = readJson(P.rate, {});
  const r = await get(PMMS_CSV);
  if (!r.ok) { console.log(`rate: CSV unavailable (${r.status})`); return null; }
  const rows = r.text.trim().split('\n');
  const header = rows[0].split(',').map((h) => h.trim().toLowerCase());
  const iDate = header.indexOf('date');
  const i30 = header.indexOf('pmms30');
  const data = rows.slice(1).map((l) => l.split(',')).filter((c) => c[i30] && !Number.isNaN(Number(c[i30])))
    .map((c) => ({ date: new Date(c[iDate]).toISOString().slice(0, 10), value: Number(c[i30]) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const latest = data.at(-1);
  if (!latest) return null;
  if (latest.date <= (rate.asOf || '')) { console.log(`rate: unchanged (${rate.value}% as of ${rate.asOf})`); return latest; }
  const target = new Date(latest.date); target.setFullYear(target.getFullYear() - 1);
  const yearAgo = data.reduce((best, d) => (Math.abs(new Date(d.date) - target) < Math.abs(new Date(best.date) - target) ? d : best), data[0]);
  const prev = data.at(-2);
  const updated = { ...rate, value: latest.value, asOf: latest.date, yearAgo: yearAgo.value, yearAgoDate: yearAgo.date };
  writeJson(P.rate, updated);
  const dir = prev ? (latest.value < prev.value ? 'down from' : latest.value > prev.value ? 'up from' : 'unchanged from') : 'vs.';
  news.items.unshift({
    id: `rate-${latest.date}`, date: latest.date, type: 'rates',
    headline: `Mortgage rates: ${latest.value}% this week`,
    plain: `The average 30-year fixed rate was ${latest.value}% for the week of ${latest.date}, ${dir} ${prev?.value ?? ''}% the week before, compared with ${yearAgo.value}% a year earlier.`,
    eli5: latest.value < (prev?.value ?? latest.value) ? 'Borrowing money for a house got a little cheaper this week.' : 'Borrowing money for a house did not get cheaper this week.',
    source: 'Freddie Mac PMMS', url: 'https://www.freddiemac.com/pmms', verified: true, auto: true,
  });
  console.log(`rate: updated to ${latest.value}% (${latest.date})`);
  return latest;
}

// ── 2. model check of one page ──────────────────────────────────────
const SYSTEM = `You check whether a homebuyer-help website's claim about a program still matches the program's official web page.
Answer ONLY with JSON: {"result":"same"|"changed"|"unclear","summary":"1-2 plain sentences","newsworthy":true|false,"headline":"short news headline or empty","plain":"2-3 sentence plain-English news text or empty","eli5":"1 very simple sentence or empty"}.
- "same": the page supports the claim. "changed": the page clearly contradicts or updates the claim (new amounts, closed/opened, new dates). "unclear": the page doesn't say enough.
- Never guess numbers; only use what the page text says. Be cautious: if unsure, use "unclear".
- newsworthy is true only for changes a homebuyer should know about (program opened/closed, amounts or limits changed, new deadlines).`;

async function askModel(entry, text) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Program: ${entry.name}\nURL: ${entry.url}\nToday: ${TODAY}\n\nOUR CLAIM:\n${entry.claim}\n\nOFFICIAL PAGE TEXT (truncated):\n${text.slice(0, 14000)}` }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const out = data.content.map((c) => c.text || '').join('');
  const parsed = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
  const usage = data.usage || {};
  const cost = PRICE_IN != null && PRICE_OUT != null ? ((usage.input_tokens || 0) * PRICE_IN + (usage.output_tokens || 0) * PRICE_OUT) / 1e6 : null;
  return { parsed, usage, cost };
}

// ── main ────────────────────────────────────────────────────────────
const watchlist = readJson(P.watchlist, []);
const status = readJson(P.status, { checkedAt: null, model: null, items: {} });
const news = readJson(P.news, { updatedAt: TODAY, items: [] });
const canAsk = Boolean(process.env.ANTHROPIC_API_KEY) && !DRY;
if (!process.env.ANTHROPIC_API_KEY && !DRY) console.log('No ANTHROPIC_API_KEY: pages will be fingerprinted but not checked by the model.');

let calls = 0; let tokIn = 0; let tokOut = 0; let dollars = 0; let newsAdded = 0;

await checkRate(news).catch((e) => console.log(`rate: error ${e.message}`));

for (const entry of watchlist) {
  const prev = status.items[entry.id] || {};
  const item = { name: entry.name, url: entry.url, lastChecked: TODAY, lastChanged: prev.lastChanged || null, hash: prev.hash || null, result: prev.result || 'unchecked', summary: prev.summary || '' };
  try {
    if (!(await allowedByRobots(entry.url))) {
      Object.assign(item, { result: 'blocked', summary: 'robots.txt asks automated tools not to read this page. Check it by hand.' });
    } else {
      const r = await get(entry.url);
      if (!r.ok) {
        Object.assign(item, { result: r.status === 403 || r.status === 429 ? 'blocked' : 'error', summary: `The page returned HTTP ${r.status}. Check it by hand.` });
      } else {
        const text = pageText(r.text);
        const h = hash(text);
        const changed = h !== prev.hash;
        item.hash = h;
        if (text.length < 300) {
          Object.assign(item, { result: 'unclear', summary: 'The page has little readable text (it may load with JavaScript). Check it by hand.' });
        } else if ((changed || VERIFY_ALL) && canAsk) {
          const { parsed, usage, cost } = await askModel(entry, text);
          calls += 1; tokIn += usage.input_tokens || 0; tokOut += usage.output_tokens || 0; if (cost != null) dollars += cost;
          appendFileSync(P.log, `${JSON.stringify({ at: new Date().toISOString(), id: entry.id, model: MODEL, input_tokens: usage.input_tokens, output_tokens: usage.output_tokens, cost_usd: cost == null ? null : Number(cost.toFixed(5)), result: parsed.result })}\n`);
          item.result = parsed.result;
          item.summary = parsed.summary;
          if (parsed.result === 'changed') {
            item.lastChanged = TODAY;
            if (parsed.newsworthy && parsed.headline) {
              news.items.unshift({ id: `${entry.id}-${TODAY}`, date: TODAY, type: entry.newsType || 'programs', headline: parsed.headline, plain: parsed.plain, eli5: parsed.eli5, source: entry.name, url: entry.url, verified: false, auto: true, note: 'Found by daily check, awaiting review' });
              newsAdded += 1;
            }
          }
        } else if (changed && prev.hash) {
          Object.assign(item, { result: 'unclear', summary: 'The page text changed since the last check. Not yet reviewed by the model.' });
        }
      }
    }
  } catch (e) {
    Object.assign(item, { result: 'error', summary: `Could not check: ${e.message.slice(0, 120)}` });
  }
  status.items[entry.id] = item;
  console.log(`${entry.id.padEnd(22)} ${item.result.padEnd(9)} ${item.summary.slice(0, 90)}`);
}

status.checkedAt = new Date().toISOString();
status.model = canAsk ? MODEL : null;
news.updatedAt = TODAY;
// keep news newest first, de-duplicated by id
const seen = new Set();
news.items = news.items.filter((n) => (seen.has(n.id) ? false : seen.add(n.id))).sort((a, b) => b.date.localeCompare(a.date));
if (!DRY) { mkdirSync(dirname(P.log), { recursive: true }); writeJson(P.status, status); writeJson(P.news, news); }

console.log(`\nModel calls: ${calls} · tokens in ${tokIn} / out ${tokOut}${PRICE_IN != null ? ` · $${dollars.toFixed(4)}` : ''} · news added: ${newsAdded}${DRY ? ' · DRY RUN (nothing written)' : ''}`);
