/**
 * Published mortgage rates from a fixed list of lender pages. Public examples with each lender's own
 * stated assumptions, not personalized offers. No borrower details are ever sent.
 *
 * Safety: fixed URL allowlist, no redirects, 12 s timeout, 1.5 MB cap, text/html only.
 * Results older than 7 days (or dated more than 1.5 days in the future) are marked stale and dropped.
 * A page that changes shape returns "unavailable"; we never fill in old numbers.
 */
export const SOURCES = [
  { id: 'occu', name: 'Orange County\'s Credit Union', url: 'https://www.orangecountyscu.org/products/home-loans/' },
  { id: 'schools', name: 'SchoolsFirst Federal Credit Union', url: 'https://www.schoolsfirstfcu.org/rates/mortgage-purchase' },
  { id: 'sammamish', name: 'Sammamish Mortgage', url: 'https://www.sammamishmortgage.com/mortgage-rates/california/orange-county/' },
];

const TIMEOUT_MS = 12000;
const MAX_BYTES = 1_500_000;
const MAX_AGE_DAYS = 7;
const FUTURE_TOLERANCE_DAYS = 1.5;
const UA = 'FrontDoorRates/1.0 (+https://front-door-chi.vercel.app; nonprofit homebuyer education; checks a few times a day)';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', reg: '®', rsquo: '’', lsquo: '‘', ndash: '–', mdash: '—' };
/** HTML → " | "-separated text tokens. */
export function tokens(html) {
  const text = html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' | ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      return ENTITIES[e.toLowerCase()] ?? m;
    });
  return text.split('|').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

const pct = (s) => { const m = /^(-?\d+(?:\.\d+)?)\s*%$/.exec(s || ''); return m ? Number(m[1]) : null; };
const num = (s) => { const m = /^(-?\d+(?:\.\d+)?)$/.exec((s || '').replace(/,/g, '')); return m ? Number(m[1]) : null; };
const MONTHS = 'january february march april may june july august september october november december'.split(' ');

function isoFromWords(str) {
  const m = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(20\d\d)/i.exec(str);
  if (!m) return null;
  return `${m[3]}-${String(MONTHS.indexOf(m[1].toLowerCase()) + 1).padStart(2, '0')}-${m[2].padStart(2, '0')}`;
}
function isoFromSlashes(str) {
  const m = /(\d{1,2})\/(\d{1,2})\/(20\d\d)/.exec(str);
  return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : null;
}

/** Orange County's Credit Union: one table of fixed and adjustable products. */
export function parseOccu(html) {
  const tk = tokens(html);
  const joined = tk.join(' | ');
  const asOf = isoFromWords(/Effective ([A-Za-z]+ \d{1,2}, 20\d\d)/.exec(joined)?.[1] || '');
  const base = { credit: 780, ltv: 60, amount: 500000, lockDays: 30, zip: null, minLoan: null, maxLoan: null, membership: 'Credit union membership required' };
  const out = [];
  for (let i = 0; i < tk.length - 4; i++) {
    const m = /^(\d{2})-Yr Fixed$/.exec(tk[i]);
    if (!m) continue;
    const rate = pct(tk[i + 1]); const apr = pct(tk[i + 2]); const points = num(tk[i + 3]);
    if (rate === null || apr === null || points === null) continue;
    out.push({ ...base, product: `${m[1]}-year fixed`, kind: 'conventional_fixed', years: Number(m[1]), rate, apr, points });
  }
  const seen = new Set();
  return { asOf, rates: out.filter((r) => { const k = `${r.years}-${r.rate}`; if (seen.has(k)) return false; seen.add(k); return true; }) };
}

/** SchoolsFirst: several rate sheets, each with "NN Year | Interest Rate | APR | … | rate | apr | points | $pay" rows. */
const SCHOOLS_PRODUCTS = [
  { heading: 'Fixed-Rate Mortgages: Conforming', kind: 'conventional_fixed', credit: 740, ltv: 60, amount: 500000, membership: 'Membership required (school employees and families)' },
  { heading: 'Fixed-Rate Mortgages: Conforming, High-Cost Area', kind: 'conventional_fixed', credit: 740, ltv: 60, amount: 850000, membership: 'Membership required (school employees and families)' },
  { heading: 'Fixed-Rate Mortgages: FHA', kind: 'fha_fixed', credit: 620, ltv: 96.5, amount: 500000, membership: 'Membership required (school employees and families)' },
  { heading: 'First-Time Home Buyer: Conforming', kind: 'conventional_fixed', credit: 740, ltv: 60, amount: 500000, membership: 'Membership required; first-time buyers', label: 'First-time buyer' },
  { heading: 'School Employee Special No PMI Fixed-Rate Mortgage: Conforming', kind: 'conventional_fixed', credit: 740, ltv: 80.01, amount: 500000, membership: 'Eligible school employees only', label: 'School employee, no PMI' },
];
export function parseSchools(html) {
  const tk = tokens(html);
  const joined = tk.join(' ');
  const asOf = isoFromSlashes(/effective as of\s+(\d{1,2}\/\d{1,2}\/20\d\d)/i.exec(joined)?.[1] || '');
  const out = [];
  for (const p of SCHOOLS_PRODUCTS) {
    // The rows follow the LAST occurrence of the exact heading (the first is a transposed summary table).
    const idxs = tk.map((x, i) => (x === p.heading ? i : -1)).filter((i) => i >= 0);
    if (!idxs.length) continue;
    const start = idxs[idxs.length - 1];
    const range = idxs.map((i) => tk.slice(i + 1, i + 4).join(' ')).join(' ');
    const lim = /Loan amounts from \$([\d,]+)\s*-\s*\$([\d,]+)/.exec(range) || /loan amounts of \$([\d,]+)\s*-\s*\$([\d,]+)/i.exec(range);
    for (let i = start + 1; i < Math.min(tk.length, start + 80); i++) {
      if (tk[i] === p.heading || (tk[i] === 'Program' && i > start + 1)) break;
      const y = /^(\d{2}) Year$/.exec(tk[i]);
      if (!y || tk[i + 1] !== 'Interest Rate') continue;
      let j = tk.indexOf('Estimated Payment Per $1,000 Borrowed', i) + 2;
      while (j > 1 && j + 3 < tk.length) {
        const rate = pct(tk[j]); const apr = pct(tk[j + 1]); const points = num(tk[j + 2]);
        if (rate === null || apr === null || points === null || !/^\$/.test(tk[j + 3])) break;
        out.push({
          product: `${y[1]}-year fixed${p.label ? ` (${p.label})` : p.kind === 'fha_fixed' ? ' (FHA)' : ''}`,
          kind: p.kind, years: Number(y[1]), rate, apr, points, credit: p.credit, ltv: p.ltv, amount: p.amount, lockDays: null, zip: null,
          minLoan: lim ? Number(lim[1].replace(/,/g, '')) : null, maxLoan: lim ? Number(lim[2].replace(/,/g, '')) : null, membership: p.membership,
        });
        j += 4;
      }
    }
  }
  return { asOf, rates: out };
}

/** Sammamish: default scenario in the page config, then "Rate | x% | APR | y% | Points | z" option rows. */
export function parseSammamish(html) {
  const cfg = /"_rqt_default_form":\{([^}]*)\}/.exec(html)?.[1] || '';
  const get = (k) => { const m = new RegExp(`"${k}":"?([\\d.]+)`).exec(cfg); return m ? Number(m[1]) : null; };
  const price = get('PurchasePrice'); const amount = get('LoanAmount'); const credit = get('CreditScore'); const lockDays = get('LockDays');
  const tk = tokens(html);
  const joined = tk.join(' ');
  const asOf = isoFromSlashes(/Rates Last Updated\s+(\d{1,2}\/\d{1,2}\/20\d\d)/i.exec(joined)?.[1] || '') || isoFromWords(joined.slice(0, 20000));
  const zip = /data-default-value="(\d{5})"/.exec(html)?.[1] || null;
  const out = [];
  const end = tk.indexOf('See more options');
  for (let i = 0; i < (end > 0 ? end : tk.length) - 5; i++) {
    if (tk[i] !== 'Rate' || tk[i + 2] !== 'APR' || tk[i + 4] !== 'Points') continue;
    const rate = pct(tk[i + 1]); const apr = pct(tk[i + 3]); const points = num(tk[i + 5]);
    if (rate === null || apr === null || points === null) continue;
    out.push({ product: '30-year fixed', kind: 'conventional_fixed', years: 30, rate, apr, points, credit, ltv: price && amount ? Math.round((amount / price) * 1000) / 10 : null, amount, lockDays, zip, minLoan: null, maxLoan: null, membership: null });
  }
  const seen = new Set();
  return { asOf, rates: out.filter((r) => { const k = `${r.rate}-${r.points}`; if (seen.has(k)) return false; seen.add(k); return true; }) };
}

const PARSERS = { occu: parseOccu, schools: parseSchools, sammamish: parseSammamish };

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'user-agent': UA, accept: 'text/html' } });
  if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
  if (!/^text\/html/i.test(res.headers.get('content-type') || '')) throw new Error('not text/html');
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) { await reader.cancel(); throw new Error('too large'); }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) { all.set(c, at); at += c.length; }
  return new TextDecoder('utf-8').decode(all);
}

function freshness(asOf, now) {
  if (!asOf) return 'unavailable';
  const days = (now - new Date(`${asOf}T12:00:00-08:00`)) / 86400000;
  if (days > MAX_AGE_DAYS || days < -FUTURE_TOLERANCE_DAYS) return 'stale';
  return 'ok';
}

export async function collectRates(now = new Date(), fetcher = fetchHtml) {
  const sources = await Promise.all(SOURCES.map(async (s) => {
    try {
      const { asOf, rates } = PARSERS[s.id](await fetcher(s.url));
      const status = rates.length ? freshness(asOf, now) : 'unavailable';
      return { id: s.id, name: s.name, url: s.url, status, asOf, rates: status === 'ok' ? rates.map((r) => ({ ...r, source: s.id, asOf })) : [] };
    } catch (e) {
      return { id: s.id, name: s.name, url: s.url, status: 'unavailable', asOf: null, rates: [], error: String(e.message || e).slice(0, 80) };
    }
  }));
  return { fetchedAt: now.toISOString(), sources, rates: sources.flatMap((s) => s.rates) };
}
