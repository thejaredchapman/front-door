/**
 * In-browser search over Doorie's document library (public/rag/library.json, built by `npm run rag:build`).
 * BM25 ranking over page-sized passages. Runs on the device: no question is sent anywhere.
 */
import { translateKeywords } from '../data/doorie';

const STOP = new Set('a an the is are am i me my we our you your can could do does how what which who where when why to of for in on at by with and or if it its be get got there this that much many any some about from will would should please tell know want need as was were has have had not no yes than then them they their these those into also may must such each per only other more most'.split(' '));
// Plain-language words → the words official documents use
const EXPAND = [
  [/\bdpa\b|down ?payment (help|assistance)/, 'down payment assistance'],
  [/\bpmi\b|mortgage insurance/, 'mortgage insurance pmi mip'],
  [/\bmip\b/, 'mortgage insurance premium'],
  [/\bmcc\b|tax credit/, 'mortgage credit certificate'],
  [/\bfirst[- ]time\b/, 'first-time homebuyer'],
  [/\bincome limits?\b|how much can i earn|earn too much/, 'income limit'],
  [/\bhoa\b/, 'homeowners association'],
  [/\bfico\b|credit score/, 'credit score fico minimum'],
  [/\bgrant\b/, 'grant forgivable'],
  [/\bvet(eran)?s?\b|military/, 'veteran va'],
  [/\bquake\b|earthquake/, 'earthquake seismic retrofit'],
  [/\bfire\b|wildfire/, 'wildfire'],
  [/\bproperty tax/, 'property tax assessed value'],
  [/\bmello[- ]?roos\b/, 'mello-roos community facilities district'],
  [/\bmap\b/, 'mortgage assistance program'],
  [/citizen|immigra|green card|resident/, 'citizen permanent resident'],
  [/\bterm\b|how long/, 'term years deferred'],
  [/\bqualif|eligib|requirement/, 'qualify eligible requirement criteria'],
];

function stem(w) {
  if (w.length <= 4 || /\d/.test(w)) return w;
  return w.replace(/(ies)$/, 'y').replace(/(ing|edly|ed|es|s)$/, '');
}
export function tokenize(s) {
  return (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9$%.\s-]/g, ' ').replace(/(?<!\d)[.](?!\d)/g, ' ')
    .split(/[\s-]+/).map((w) => w.replace(/^\$|,/g, '')).filter((w) => w && !STOP.has(w)).map(stem);
}

let libraryPromise = null;
let index = null;

export function loadLibrary() {
  if (!libraryPromise) {
    libraryPromise = fetch('/rag/library.json').then((r) => {
      if (!r.ok) throw new Error(`library ${r.status}`);
      return r.json();
    }).then((lib) => {
      // Title words count twice so the right document wins ties.
      const docsTokens = lib.chunks.map(([d, , text]) => tokenize(`${lib.docs[d].title} ${lib.docs[d].title} ${text}`));
      const df = new Map();
      docsTokens.forEach((toks) => new Set(toks).forEach((w) => df.set(w, (df.get(w) || 0) + 1)));
      const tf = docsTokens.map((toks) => { const m = new Map(); toks.forEach((w) => m.set(w, (m.get(w) || 0) + 1)); return m; });
      const avg = docsTokens.reduce((s, t) => s + t.length, 0) / docsTokens.length;
      index = { lib, tf, df, lens: docsTokens.map((t) => t.length), avg, n: docsTokens.length };
      return index;
    }).catch((e) => { libraryPromise = null; throw e; });
  }
  return libraryPromise;
}

function expandQuery(q) {
  let out = translateKeywords(q);
  for (const [re, add] of EXPAND) if (re.test(out.toLowerCase())) out += ` ${add}`;
  return out;
}

/** Top passages for a question: [{ id, doc, page, text, score, link }] */
export function searchLibrary(ix, question, k = 4) {
  const terms = [...new Set(tokenize(expandQuery(question)))];
  if (!terms.length) return [];
  const K1 = 1.4; const B = 0.75;
  const scores = [];
  for (let i = 0; i < ix.n; i++) {
    let s = 0;
    const tf = ix.tf[i];
    for (const w of terms) {
      const f = tf.get(w);
      if (!f) continue;
      const idf = Math.log(1 + (ix.n - ix.df.get(w) + 0.5) / (ix.df.get(w) + 0.5));
      s += idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + B * (ix.lens[i] / ix.avg))));
    }
    if (s > 0) scores.push([i, s]);
  }
  scores.sort((a, b) => b[1] - a[1]);
  const out = [];
  const perDoc = new Map();
  for (const [i, s] of scores) {
    const [d, page, text] = ix.lib.chunks[i];
    if ((perDoc.get(d) || 0) >= 2) continue; // keep results varied
    perDoc.set(d, (perDoc.get(d) || 0) + 1);
    const doc = ix.lib.docs[d];
    out.push({ id: i, doc, page, text, score: s, link: doc.url ? (doc.pageLinks ? `${doc.url}#page=${page}` : doc.url) : null });
    if (out.length >= k) break;
  }
  // Drop weak tail results (under 35% of the best match)
  return out.filter((r) => r.score >= out[0].score * 0.35);
}

/** A short excerpt around the best-matching sentence. */
export function excerpt(text, question, max = 320) {
  const terms = new Set(tokenize(expandQuery(question)));
  const sentences = text.split(/(?<=[.!?])\s+|\n/);
  let best = 0; let bestScore = -1;
  sentences.forEach((s, i) => { const sc = tokenize(s).filter((w) => terms.has(w)).length; if (sc > bestScore) { bestScore = sc; best = i; } });
  let out = sentences[best];
  for (let i = best + 1; i < sentences.length && out.length < max; i++) out += ` ${sentences[i]}`;
  if (out.length > max) out = `${out.slice(0, max).replace(/\s+\S*$/, '')}…`;
  return (best > 0 ? '… ' : '') + out;
}
