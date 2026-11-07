#!/usr/bin/env node
/**
 * Actual build and service costs → src/data/buildCosts.json (shown on "How this was built").
 *
 *   npm run cost-report
 *
 * - Claude Code: sums the real token usage recorded in this project's Claude Code session files
 *   (~/.claude/projects/<this folder>/*.jsonl, plus subagents), priced at Anthropic's list prices below.
 *   This is the pay-as-you-go API price. On a Claude subscription plan the amount billed is the plan fee instead.
 * - Anthropic API: docs/api-check-log.jsonl, docs/translation-log.jsonl, docs/daily-check-log.jsonl.
 * - ElevenLabs: docs/voiceover-log.jsonl (characters ≈ credits).
 * - Other services: counts of real calls/deploys; all on free tiers so far.
 * Reads token counts only. No message text or keys are copied.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRICING_SOURCE = 'https://platform.claude.com/docs/en/about-claude/pricing';
const PRICING_CHECKED = '2026-11-07';
// USD per million tokens (list prices, standard speed, global inference)
const PRICES = {
  'claude-opus-5-5': { input: 4, cacheWrite5m: 5, cacheWrite1h: 8, cacheRead: 0.2, output: 20 },
  'claude-haiku-5-5': { input: 0.1, cacheWrite5m: 0.125, cacheWrite1h: 0.2, cacheRead: 0.01, output: 0.5, over100k: { input: 0.5, cacheWrite5m: 0.625, cacheWrite1h: 1, cacheRead: 0.05, output: 2.5 } },
};

const readJsonl = (file) => (existsSync(file) ? readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } }) : []);

function priceUsage(model, u) {
  let p = PRICES[model];
  if (!p) return null;
  const prompt = u.input + u.cacheWrite5m + u.cacheWrite1h + u.cacheRead;
  if (p.over100k && prompt > 100000) p = p.over100k;
  return (u.input * p.input + u.cacheWrite5m * p.cacheWrite5m + u.cacheWrite1h * p.cacheWrite1h + u.cacheRead * p.cacheRead + u.output * p.output) / 1e6;
}

/** Sum one Claude Code transcript. Streaming writes the same message several times; keep the last (largest) copy. */
function sumTranscript(file) {
  const byId = new Map();
  for (const d of readJsonl(file)) {
    const m = d.message;
    if (!m || m.role !== 'assistant' || !m.usage) continue;
    const u = m.usage;
    const rec = {
      model: m.model,
      input: u.input_tokens || 0,
      output: u.output_tokens || 0,
      cacheWrite5m: u.cache_creation?.ephemeral_5m_input_tokens ?? u.cache_creation_input_tokens ?? 0,
      cacheWrite1h: u.cache_creation?.ephemeral_1h_input_tokens ?? 0,
      cacheRead: u.cache_read_input_tokens || 0,
      at: d.timestamp,
    };
    const id = m.id || d.uuid;
    const prev = byId.get(id);
    if (!prev || rec.output >= prev.output) byId.set(id, rec);
  }
  const t = { calls: 0, input: 0, output: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0, usd: 0, models: new Set(), first: null, last: null };
  for (const r of byId.values()) {
    t.calls++;
    for (const k of ['input', 'output', 'cacheWrite5m', 'cacheWrite1h', 'cacheRead']) t[k] += r[k];
    t.usd += priceUsage(r.model, r) ?? 0;
    t.models.add(r.model);
    if (r.at && (!t.first || r.at < t.first)) t.first = r.at;
    if (r.at && (!t.last || r.at > t.last)) t.last = r.at;
  }
  return { ...t, models: [...t.models] };
}

// ── Claude Code sessions for this folder ──
const projectDir = join(homedir(), '.claude', 'projects', ROOT.replace(/[^a-zA-Z0-9]/g, '-'));
const sessions = existsSync(projectDir) ? readdirSync(projectDir).filter((f) => f.endsWith('.jsonl')) : [];
const parts = [];
for (const f of sessions) {
  const id = f.replace('.jsonl', '');
  parts.push({ label: 'Main build session (design, code, tests, data checks)', kind: 'main', ...sumTranscript(join(projectDir, f)) });
  const subDir = join(projectDir, id, 'subagents');
  if (!existsSync(subDir)) continue;
  for (const sf of readdirSync(subDir).filter((x) => x.endsWith('.jsonl'))) {
    const metaFile = join(subDir, sf.replace('.jsonl', '.meta.json'));
    const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : {};
    parts.push({ label: meta.description || 'Helper agent', kind: meta.agentType === 'web-fetch' ? 'web-fetch' : 'research', ...sumTranscript(join(subDir, sf)) });
  }
}
const claudeCode = parts.reduce((s, p) => ({
  calls: s.calls + p.calls, input: s.input + p.input, output: s.output + p.output,
  cacheWrite: s.cacheWrite + p.cacheWrite5m + p.cacheWrite1h, cacheRead: s.cacheRead + p.cacheRead, usd: s.usd + p.usd,
}), { calls: 0, input: 0, output: 0, cacheWrite: 0, cacheRead: 0, usd: 0 });

// ── Anthropic API calls made by the project's own scripts ──
const apiLogs = [
  ['Key check (one tiny test message)', 'docs/api-check-log.jsonl'],
  ['Translation script (npm run translate)', 'docs/translation-log.jsonl'],
  ['Doorie "Summarize with AI" (local testing)', 'docs/rag-ask-log.jsonl'],
  ['Daily news check (npm run daily-check)', 'docs/daily-check-log.jsonl'],
];
const anthropicApi = apiLogs.map(([label, file]) => {
  const rows = readJsonl(join(ROOT, file));
  let usd = 0; let input = 0; let output = 0;
  for (const r of rows) {
    const u = { input: r.input_tokens || 0, output: r.output_tokens || 0, cacheWrite5m: r.cache_creation_input_tokens || 0, cacheWrite1h: 0, cacheRead: r.cache_read_input_tokens || 0 };
    input += u.input; output += u.output;
    usd += priceUsage(r.model || 'claude-haiku-5-5', u) ?? 0;
  }
  return { label, file, calls: rows.length, input, output, usd };
});

// ── ElevenLabs voiceover runs ──
const voice = readJsonl(join(ROOT, 'docs', 'voiceover-log.jsonl'));
const elevenChars = voice.reduce((s, r) => s + (r.characters || 0), 0);

const round = (x) => Math.round(x * 10000) / 10000;
const out = {
  generatedAt: new Date().toISOString(),
  pricing: { source: PRICING_SOURCE, checked: PRICING_CHECKED, prices: PRICES },
  claudeCode: {
    model: 'Claude Opus 5.5',
    note: 'Pay-as-you-go API list price for the tokens actually used. On a Claude subscription, the amount billed is the plan fee instead.',
    totals: { ...claudeCode, usd: round(claudeCode.usd) },
    parts: parts.map((p) => ({ label: p.label, kind: p.kind, calls: p.calls, input: p.input, output: p.output, cacheWrite: p.cacheWrite5m + p.cacheWrite1h, cacheRead: p.cacheRead, usd: round(p.usd), first: p.first, last: p.last })),
  },
  anthropicApi: anthropicApi.map((a) => ({ ...a, usd: Math.round(a.usd * 1e6) / 1e6 })),
  elevenlabs: { runs: voice.length, characters: elevenChars, note: voice.length ? 'About 1 credit per character, from your plan\'s credits.' : 'Not used yet: no valid ElevenLabs key has been added, so no audio was made.' },
};
writeFileSync(join(ROOT, 'src', 'data', 'buildCosts.json'), `${JSON.stringify(out, null, 2)}\n`);
console.log(`Claude Code: ${parts.length} transcripts, ${claudeCode.calls} model calls, $${claudeCode.usd.toFixed(2)} at list price`);
console.log(`Anthropic API (scripts): ${anthropicApi.map((a) => `${a.calls} × ${a.label}`).join('; ')}`);
console.log(`ElevenLabs: ${voice.length} runs, ${elevenChars} characters`);
console.log('Saved src/data/buildCosts.json');
