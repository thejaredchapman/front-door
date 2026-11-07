#!/usr/bin/env node
/**
 * Build Doorie's document library (RAG index) from a folder of official PDFs.
 *
 *   RAG_DIR=~/Downloads/rag npm run rag:build      (default RAG_DIR: ~/Downloads/rag)
 *
 * Input: <RAG_DIR>/INDEX.csv (folder,file,pages,type,source_url,retrieved) + the PDFs it lists.
 * Output: public/rag/library.json → { builtAt, docs: [...], chunks: [[docIndex, page, text], ...] }
 *         docs/rag/INDEX.csv (provenance copy)
 * Needs pdftotext (brew install poppler). PDFs are read as data only; nothing in them is executed.
 * Every chunk keeps its page number so answers can cite "document, page N" and link to the official source.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve((process.env.RAG_DIR || join(homedir(), 'Downloads', 'rag')).replace(/^~/, homedir()));
const TARGET_WORDS = 140;
const MAX_WORDS = 220;

const CATEGORIES = {
  '01_CalHFA': 'CalHFA (state loans and down payment help)',
  '02_Orange_County': 'Orange County programs',
  '03_Habitat_OC': 'Habitat for Humanity of Orange County',
  '04_Statewide_DPA_GSFA_WISH': 'Statewide help (GSFA, WISH)',
  '05_City_Programs': 'City programs',
  '06_Federal_Loan_Rules': 'Federal loan rules and limits',
  '07_Property_Tax': 'Property tax',
  '08_Home_Insurance': 'Home insurance',
};

function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const cells = []; let cur = ''; let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true;
      else if (c === ',') { cells.push(cur); cur = ''; }
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] || '').trim()])));
}

/** "CalHFA_MyHome_Handbook.pdf" → "CalHFA MyHome Handbook"; web captures use their own page title. */
function titleFor(file, firstPage) {
  const first = firstPage.split('\n').map((l) => l.trim()).find(Boolean) || '';
  if (/_webpage\.pdf$/.test(file) && first.length > 5 && first.length < 120) return first.replace(/\s+[-|–]\s+$/, '');
  return file.replace(/\.pdf$/i, '').replace(/_webpage$/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

const clean = (s) => s
  .replace(/­/g, '')
  .replace(/[ \t]+/g, ' ')
  .split('\n')
  .filter((l) => !/^\s*(Source: https?:\/\/|Retrieved: 20\d\d-)/.test(l))
  .join('\n');

/** Pack paragraphs into ~140-word chunks (never more than 220), splitting long paragraphs by sentence. */
function chunkPage(text) {
  const paras = clean(text).split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter((p) => p.split(/\s+/).length >= 3 || /\d/.test(p));
  const pieces = [];
  for (const p of paras) {
    const words = p.split(/\s+/);
    if (words.length <= MAX_WORDS) { pieces.push(p); continue; }
    let buf = [];
    for (const s of p.split(/(?<=[.!?;:])\s+/)) {
      if (buf.join(' ').split(/\s+/).length + s.split(/\s+/).length > TARGET_WORDS && buf.length) { pieces.push(buf.join(' ')); buf = []; }
      buf.push(s);
    }
    if (buf.length) pieces.push(buf.join(' '));
  }
  const chunks = [];
  let cur = '';
  for (const piece of pieces) {
    const n = (cur ? cur.split(/\s+/).length : 0) + piece.split(/\s+/).length;
    if (cur && n > TARGET_WORDS) { chunks.push(cur); cur = piece; } else cur = cur ? `${cur}\n${piece}` : piece;
  }
  if (cur) chunks.push(cur);
  // Hard cap for any piece that is still huge (e.g. one long table line)
  return chunks.flatMap((c) => {
    const w = c.split(/\s+/);
    if (w.length <= MAX_WORDS * 1.5) return [c];
    const out = [];
    for (let i = 0; i < w.length; i += TARGET_WORDS) out.push(w.slice(i, i + TARGET_WORDS).join(' '));
    return out;
  }).filter((c) => c.split(/\s+/).length >= 8);
}

if (!existsSync(join(DIR, 'INDEX.csv'))) {
  console.error(`No INDEX.csv in ${DIR}. Set RAG_DIR to the folder with INDEX.csv and the PDFs.`);
  process.exit(1);
}
const index = parseCsv(readFileSync(join(DIR, 'INDEX.csv'), 'utf8'));
const docs = [];
const chunks = [];
const problems = [];
for (const row of index) {
  const file = join(DIR, row.folder, row.file);
  if (!existsSync(file)) { problems.push(`missing: ${row.folder}/${row.file}`); continue; }
  let text;
  try { text = execFileSync('pdftotext', ['-q', '-enc', 'UTF-8', file, '-'], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8'); } catch (e) { problems.push(`unreadable: ${row.file} (${e.message.slice(0, 60)})`); continue; }
  const pages = text.split('\f');
  if (pages.at(-1).trim() === '') pages.pop();
  const d = docs.length;
  const isPdfSource = /\.pdf(\?|$|#)/i.test(row.source_url);
  docs.push({
    id: row.file.replace(/\.pdf$/i, ''),
    title: titleFor(row.file, pages[0] || ''),
    category: CATEGORIES[row.folder] || row.folder,
    url: row.source_url.startsWith('http') ? row.source_url.split(' ')[0] : null,
    pageLinks: isPdfSource, // official PDFs accept #page=N; captured web pages don't
    type: row.type,
    retrieved: row.retrieved,
    pages: pages.length,
  });
  let n = 0;
  pages.forEach((p, i) => chunkPage(p).forEach((c) => { chunks.push([d, i + 1, c]); n++; }));
  if (!n) problems.push(`no text: ${row.file}`);
}

mkdirSync(join(ROOT, 'public', 'rag'), { recursive: true });
mkdirSync(join(ROOT, 'docs', 'rag'), { recursive: true });
const out = { builtAt: new Date().toISOString(), source: 'Official documents retrieved 2026-11-07; see docs/rag/INDEX.csv', docs, chunks };
writeFileSync(join(ROOT, 'public', 'rag', 'library.json'), JSON.stringify(out));
copyFileSync(join(DIR, 'INDEX.csv'), join(ROOT, 'docs', 'rag', 'INDEX.csv'));
const words = chunks.reduce((s, c) => s + c[2].split(/\s+/).length, 0);
console.log(`${docs.length} documents · ${chunks.length} passages · ${words.toLocaleString()} words → public/rag/library.json (${(JSON.stringify(out).length / 1024).toFixed(0)} KB)`);
if (problems.length) console.log(`Problems:\n  ${problems.join('\n  ')}`);
