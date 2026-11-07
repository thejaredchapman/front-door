#!/usr/bin/env node
/**
 * Front Door AI translation script.
 *
 *   ANTHROPIC_API_KEY=... npm run translate                 # translate everything missing
 *   npm run translate -- --dry-run                           # count strings, no API calls
 *   npm run translate -- --langs es,vi --model claude-sonnet-5-5
 *
 * 1. Extracts user-facing English text from src/ (t('…') calls, plain=/eli5=/title= props,
 *    and data fields such as plain, eli5, title, pros, cons).
 * 2. Skips anything already in src/i18n/locales/<lang>.json or ui.<lang>.json (cache).
 * 3. Sends batches to the Anthropic Messages API and writes results back.
 * 4. Appends one line per API call to docs/translation-log.jsonl (tokens + cost).
 *    Set PRICE_INPUT_PER_MTOK and PRICE_OUTPUT_PER_MTOK (USD per million tokens)
 *    to log dollar costs; otherwise tokens are logged and cost shows as null.
 *
 * The API key is read from the environment only and is never written to disk.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const LOCALES = join(SRC, 'i18n', 'locales');
const LOG = join(ROOT, 'docs', 'translation-log.jsonl');

const LANG_NAMES = { es: 'Spanish (Latin American, as used in California)', zh: 'Simplified Chinese (Mandarin)', vi: 'Vietnamese (as used by the Vietnamese-American community in Orange County)', fr: 'French', ar: 'Modern Standard Arabic' };

// ── args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const DRY = args.includes('--dry-run');
const LANGS = flag('langs', 'es,zh,vi,fr,ar').split(',').map((s) => s.trim()).filter((l) => LANG_NAMES[l]);
const MODEL = flag('model', process.env.TRANSLATE_MODEL || 'claude-haiku-5-5');
const BATCH = Number(flag('batch', 40));
const PRICE_IN = process.env.PRICE_INPUT_PER_MTOK ? Number(process.env.PRICE_INPUT_PER_MTOK) : null;
const PRICE_OUT = process.env.PRICE_OUTPUT_PER_MTOK ? Number(process.env.PRICE_OUTPUT_PER_MTOK) : null;

// ── 1. extract strings ──────────────────────────────────────────────
// Proper nouns and numeric tables that should not be sent for translation.
const SKIP_FILES = new Set(['cities.js', 'jobs.js', 'caIncomeLimits.js', 'chartColors.js', 'incomeLimits.js']);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === 'locales' ? [] : walk(p);
    return /\.(jsx?|mjs)$/.test(f) && !SKIP_FILES.has(f) ? [p] : [];
  });
}

const FIELD_KEYS = 'title|plain|eli5|label|body|why|note|summary|simple|kind|down|firstStep|what|who|catch|gives|typical|cta|tagline|name|headline|tab|fastTip|link|l|d|v|t|amount|category|status|rateLabel';
const ARRAY_KEYS = 'pros|cons|points|tools|otherLines|did|items|homebuyerLines';
const STR = String.raw`'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"`;

function unescape(s) {
  return s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\u2019/g, '\u2019').replace(/\\\\/g, '\\');
}

function looksTranslatable(s) {
  if (!s || s.length < 2) return false;
  if (!/[A-Za-z]{2}/.test(s)) return false;
  if (/^(https?:|#\/|mailto:|\.\/|\/)/.test(s)) return false;
  if (/^[a-z0-9]+([-_][a-z0-9]+)*$/.test(s)) return false; // ids like "fha-myhome"
  if (/^[a-z]+[A-Z][A-Za-z]*$/.test(s)) return false; // camelCase keys
  if (/^(bg|text|border|px|py|mt|mb|flex|grid|w-|h-|p-|m-)/.test(s) && !/\s[a-z]+\s[a-z]+\s/.test(s)) return false; // class names
  return true;
}

function extract() {
  const found = new Set();
  const add = (raw) => { const s = unescape(raw); if (looksTranslatable(s)) found.add(s); };
  for (const file of walk(SRC)) {
    const code = readFileSync(file, 'utf8');
    // t('…') / t("…")
    for (const m of code.matchAll(new RegExp(String.raw`\bt\(\s*(?:${STR})`, 'g'))) add(m[1] ?? m[2]);
    // object fields: key: '…'
    for (const m of code.matchAll(new RegExp(String.raw`\b(?:${FIELD_KEYS})\s*:\s*(?:${STR})`, 'g'))) add(m[1] ?? m[2]);
    // arrays of strings: pros: ['…', '…']
    for (const m of code.matchAll(new RegExp(String.raw`\b(?:${ARRAY_KEYS})\s*:\s*\[([\s\S]*?)\]`, 'g'))) {
      for (const s of m[1].matchAll(new RegExp(STR, 'g'))) add(s[1] ?? s[2]);
    }
    // JSX props: plain="…" eli5="…" title="…" kicker="…" help="…"
    for (const m of code.matchAll(/\b(?:plain|eli5|title|kicker|help|label)="((?:\\.|[^"\\])*)"/g)) add(m[1]);
    // top-level string arrays like WORDS / QUESTIONS / RED_FLAGS / FUND_RULES
    for (const m of code.matchAll(/const [A-Z_]+ = \[([\s\S]*?)\];/g)) {
      if (/\{/.test(m[1])) continue;
      for (const s of m[1].matchAll(new RegExp(STR, 'g'))) add(s[1] ?? s[2]);
    }
  }
  // California laws (src/data/caLaws.json)
  const lawsFile = join(SRC, 'data', 'caLaws.json');
  if (existsSync(lawsFile)) {
    for (const l of JSON.parse(readFileSync(lawsFile, 'utf8'))) [l.title, l.plain, l.eli5, l.impactWhy, l.who].forEach((x) => x && add(x));
  }
  // News written by the daily check (public/updates/news.json)
  const newsFile = join(ROOT, 'public', 'updates', 'news.json');
  if (existsSync(newsFile)) {
    for (const n of JSON.parse(readFileSync(newsFile, 'utf8')).items || []) [n.headline, n.plain, n.eli5, n.note].forEach((x) => x && add(x));
  }
  return [...found].sort();
}

// ── 2. cache ────────────────────────────────────────────────────────
const readJson = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {});

// ── 3. API ──────────────────────────────────────────────────────────
const SYSTEM = `You translate a free homebuyer-help website for low-income families in California.
Rules:
- Translate into the requested language using plain, warm, simple words (about a 6th-grade reading level).
- Keep these unchanged: program and organization names (CalHFA, MyHome, ZIP, FHA, VA, USDA, HUD, GSFA, HomeReady, Home Possible, Habitat for Humanity, SchoolsFirst, NeighborWorks, CalABLE, NMLS, DFPI, CFPB, IRS, ITIN, SSN, AMI, DTI, PMI, MIP, MCC, CDFI, Front Door), URLs, phone numbers, dollar amounts, percentages, and placeholders in curly braces like {n}.
- Keep emoji and punctuation symbols such as → ✓ ☐.
- Return ONLY a JSON array of strings, same length and order as the input.`;

async function translateBatch(lang, strings) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM,
      messages: [{ role: 'user', content: `Target language: ${LANG_NAMES[lang]}\n\n${JSON.stringify(strings)}` }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content.map((c) => c.text || '').join('');
  const json = text.slice(text.indexOf('['), text.lastIndexOf(']') + 1);
  const out = JSON.parse(json);
  if (!Array.isArray(out) || out.length !== strings.length) throw new Error(`Expected ${strings.length} items, got ${out?.length}`);
  out.forEach((s, i) => {
    const want = strings[i].match(/\{\w+\}/g) || [];
    if (want.some((ph) => !s.includes(ph))) throw new Error(`Placeholder lost in: ${strings[i]}`);
  });
  const usage = data.usage || {};
  const cost = PRICE_IN != null && PRICE_OUT != null
    ? ((usage.input_tokens || 0) * PRICE_IN + (usage.output_tokens || 0) * PRICE_OUT) / 1e6
    : null;
  return { out, usage, cost };
}

// ── main ────────────────────────────────────────────────────────────
const all = extract();
const words = all.reduce((n, s) => n + s.split(/\s+/).length, 0);
console.log(`Found ${all.length} strings (${words.toLocaleString()} words) in src/.`);

if (!DRY && !process.env.ANTHROPIC_API_KEY) {
  console.error('Set ANTHROPIC_API_KEY to translate (or use --dry-run).');
  process.exit(1);
}
mkdirSync(dirname(LOG), { recursive: true });

let totalIn = 0;
let totalOut = 0;
let totalCost = 0;
let calls = 0;

for (const lang of LANGS) {
  const file = join(LOCALES, `${lang}.json`);
  const cache = readJson(file);
  const ui = readJson(join(LOCALES, `ui.${lang}.json`));
  const missing = all.filter((s) => !(s in cache) && !(s in ui));
  console.log(`\n[${lang}] ${missing.length} to translate (${Object.keys(cache).length} cached, ${Object.keys(ui).length} hand-translated).`);
  if (DRY || missing.length === 0) continue;

  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    let result;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try { result = await translateBatch(lang, batch); break; } catch (e) {
        console.warn(`  batch ${i / BATCH + 1} attempt ${attempt} failed: ${e.message}`);
        if (attempt === 2) result = null;
      }
    }
    if (!result) continue;
    batch.forEach((s, j) => { cache[s] = result.out[j]; });
    writeFileSync(file, `${JSON.stringify(Object.fromEntries(Object.entries(cache).sort()), null, 1)}\n`);
    calls += 1;
    totalIn += result.usage.input_tokens || 0;
    totalOut += result.usage.output_tokens || 0;
    if (result.cost != null) totalCost += result.cost;
    appendFileSync(LOG, `${JSON.stringify({
      at: new Date().toISOString(), lang, model: MODEL, strings: batch.length,
      input_tokens: result.usage.input_tokens, output_tokens: result.usage.output_tokens,
      cost_usd: result.cost == null ? null : Number(result.cost.toFixed(5)),
    })}\n`);
    console.log(`  batch ${i / BATCH + 1}: ${batch.length} strings · in ${result.usage.input_tokens} / out ${result.usage.output_tokens} tokens${result.cost != null ? ` · $${result.cost.toFixed(4)}` : ''}`);
  }
}

if (!DRY) {
  console.log(`\nDone: ${calls} API calls · ${totalIn.toLocaleString()} input + ${totalOut.toLocaleString()} output tokens${PRICE_IN != null ? ` · $${totalCost.toFixed(2)} total` : ' · set PRICE_INPUT_PER_MTOK / PRICE_OUTPUT_PER_MTOK to log dollars'}`);
  console.log(`Per-call log: docs/translation-log.jsonl`);
}
