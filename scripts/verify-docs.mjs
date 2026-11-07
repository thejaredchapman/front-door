#!/usr/bin/env node
/**
 * Front Door document verification ("do the facts in the app match the source documents?").
 *
 *   npm run verify:docs                                   # uses the default hackathon docs folder
 *   npm run verify:docs -- --docs "/path/to/pdf folder"
 *
 * No AI. Extracts text from the source PDFs with `pdftotext` (poppler) and checks:
 *   1. Every number in every county's 2026 income-limit rows (src/data/caIncomeLimits.js) appears,
 *      in order, in that county's block of the HCD PDF.
 *   2. Every figure the app quotes from Prop 1, the Habitat OC Impact Report and audit, the OC Housing
 *      Element, the HCD memo, and the 2025 Energy Code manual is present in the source text,
 *      and the app still shows the same value.
 * Writes docs/verification-report.md and exits 1 if anything fails.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir, homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const DOCS = args.includes('--docs') ? args[args.indexOf('--docs') + 1] : join(homedir(), 'Downloads', 'Habitat For Humanity Hack-a-thon');

const FILES = {
  limits: 'income-limits-2026.pdf',
  prop1: 'California_Prop_1_2026_Full_Text.pdf',
  impact: '2024-25-Annual-Report-13.pdf',
  audit: 'Habitat-for-Humanity-of-OC-Inc.-HFHOC-FS-Audit-Report-2025-Final-1.pdf',
  element: 'OC Housing Element AdoptedFeb2025.pdf',
  energy: '2025 BUILDING ENERGY EFFICIENCY STANDARDS CEC-400-2025-005.pdf',
};

// ── extract text ────────────────────────────────────────────────────
const tmp = mkdtempSync(join(tmpdir(), 'loanlens-verify-'));
const text = {};
const fingerprints = {};
for (const [key, file] of Object.entries(FILES)) {
  const pdf = join(DOCS, file);
  if (!existsSync(pdf)) { console.error(`Missing source document: ${pdf}`); process.exit(2); }
  const out = join(tmp, `${key}.txt`);
  execFileSync('pdftotext', ['-layout', pdf, out], { stdio: 'ignore' });
  text[key] = readFileSync(out, 'utf8');
  fingerprints[key] = createHash('sha256').update(readFileSync(pdf)).digest('hex').slice(0, 12);
}
const flat = Object.fromEntries(Object.entries(text).map(([k, v]) => [k, v.replace(/\s+/g, ' ')]));

// ── app data (plain ES modules with no imports) ─────────────────────
const { CA_INCOME_LIMITS_2026 } = await import(pathToFileURL(join(ROOT, 'src/data/caIncomeLimits.js')).href);
const facts = await import(pathToFileURL(join(ROOT, 'src/data/ocFacts.js')).href);

const results = [];
const check = (group, claim, ok, evidence = '') => results.push({ group, claim, ok: Boolean(ok), evidence });
const has = (doc, s) => flat[doc].includes(s);
const near = (doc, a, b, within = 400) => {
  const t = flat[doc];
  let i = t.indexOf(a);
  while (i >= 0) {
    const window = t.slice(Math.max(0, i - within), i + a.length + within);
    if (window.includes(b)) return true;
    i = t.indexOf(a, i + 1);
  }
  return false;
};
const snippet = (doc, s, pad = 60) => {
  const i = flat[doc].indexOf(s);
  return i < 0 ? '' : `…${flat[doc].slice(Math.max(0, i - pad), i + s.length + pad).trim()}…`;
};

// ── 1. income limits: every number, in order, per county ───────────
const lines = text.limits.split('\n');
const ROWS = ['acutelyLow', 'extremelyLow', 'veryLow', 'low', 'median', 'moderate'];
let limitNumbers = 0;
for (const [county, data] of Object.entries(CA_INCOME_LIMITS_2026)) {
  const idx = lines.findIndex((l) => new RegExp(`^\\s*${county.replace(/\./g, '\\.')} County\\s*$`).test(l));
  if (idx < 0) { check('Income limits (HCD 2026)', `${county} County block found`, false); continue; }
  const block = lines.slice(Math.max(0, idx - 6), idx + 8).join(' ');
  const amiOk = block.includes(`$${data.ami.toLocaleString('en-US')}`);
  let rowsOk = 0;
  const bad = [];
  for (const row of ROWS) {
    // numbers must appear in order (rows can wrap across lines in the PDF)
    let pos = 0;
    const ok = data[row].every((n) => {
      const m = new RegExp(`(^|\\D)${n}(\\D|$)`, 'g');
      m.lastIndex = pos;
      const hit = m.exec(block);
      if (!hit) return false;
      pos = hit.index + 1;
      return true;
    });
    if (ok) rowsOk += 1; else bad.push(row);
    limitNumbers += data[row].length;
  }
  check('Income limits (HCD 2026)', `${county}: AMI $${data.ami.toLocaleString('en-US')} and all 48 limits`, amiOk && rowsOk === ROWS.length, bad.length ? `mismatch in: ${bad.join(', ')}` : 'all rows match');
}
check('Income limits (HCD 2026)', 'Memo is the revision dated June 23, 2026', has('limits', 'June 23, 2026') && has('limits', 'Revised 2026 State Income Limits'), snippet('limits', 'Revised 2026 State Income Limits'));

// ── 2. Prop 1 (Nov 3, 2026) ─────────────────────────────────────────
const P = facts.PROP1;
const prop1Pairs = [
  ['Total bond $10 billion', P.total === '$10 billion', '($10,000,000,000)', 'Bonds in the total amount'],
  ['Veterans bonds $1.25 billion', P.veterans === '$1.25 billion', '($1,250,000,000)', 'farm and home aid for veterans'],
  ['$500M Home Purchase Assistance Fund to CalHFA', P.homebuyerLines.some((l) => l.amount === '$500 million' && /Home Purchase Assistance/.test(l.what)), '($500,000,000) to be deposited into the Home Purchase', 'California Housing Finance Agency'],
  ['$600M CalHome / Self-Help Housing Fund', P.homebuyerLines.some((l) => l.amount === '$600 million' && /CalHome/.test(l.what)), '($600,000,000) to be deposited into the Self-Help', 'CalHome Program'],
  ['$200M Local Housing Trust Fund matching', P.homebuyerLines.some((l) => l.amount === '$200 million' && /Local Housing Trust/.test(l.what)), '($200,000,000) to be deposited in the Affordable Housing Innovation Fund', 'Local Housing Trust Fund Matching Grant'],
  ['$5.1B Multifamily Housing Program', P.otherLines.some((l) => l.startsWith('$5.1B')), '($5,100,000,000)', 'Multifamily Housing Program'],
  ['$1.15B supportive housing', P.otherLines.some((l) => l.startsWith('$1.15B')), '($1,150,000,000)', 'supportive housing'],
  ['$150M youth housing', P.otherLines.some((l) => /\$150M for youth/.test(l)), '($150,000,000)', 'youth housing'],
  ['$750M Portfolio Reinvestment Program', P.otherLines.some((l) => l.startsWith('$750M')), '($750,000,000)', 'Portfolio Reinvestment Program'],
  ['$500M Infill Infrastructure Grants', P.otherLines.some((l) => l.startsWith('$500M Infill')), '($500,000,000) for the Infill Infrastructure', 'Infill Infrastructure Grant'],
  ['$450M Joe Serna Jr. Farmworker Housing', P.otherLines.some((l) => l.startsWith('$450M')), '($450,000,000)', 'Joe Serna'],
  ['$350M UC/CSU student housing', P.otherLines.some((l) => l.startsWith('$350M')), '($350,000,000)', 'student housing'],
  ['$200M Tribal Housing Grants', P.otherLines.some((l) => /Tribal/.test(l)), '($200,000,000)', 'Tribal Housing Grant'],
];
for (const [claim, inApp, a, b] of prop1Pairs) check('Prop 1 (2026) text', claim, inApp && near('prop1', a, b, 500), inApp ? snippet('prop1', a, 40) : 'app no longer shows this value');

// ── 3. Habitat OC Impact Report and audit ───────────────────────────
const reality = Object.fromEntries(facts.OC_REALITY.map((f) => [f.value, f]));
const habitat = Object.fromEntries(facts.HABITAT_OC_FACTS.map((f) => [f.value, f]));
const impactChecks = [
  ['Median home price more than $1.3 million', reality['$1.3M+'], () => has('impact', 'more than $1.3 million')],
  ['Median household income $130,000', reality['$130K'], () => has('impact', '$130,000')],
  ['10-to-1 price-to-income ratio', reality['10 : 1'], () => has('impact', '10-to-1')],
  ['Average rent about $3,250', reality['$3,250'], () => has('impact', '$3,250')],
  ['More than half of renters cost-burdened', reality['50%+'], () => has('impact', 'More than half of renters are cost-burdened')],
  ['239 homes in 37 years in 16 cities', habitat['239'], () => near('impact', '239 Homes in 37 years', '16 cities', 50)],
  ['710 children have a place to call home', habitat['710'], () => has('impact', '710 Children')],
  ['907 orientation attendees', habitat['907'], () => has('impact', '907 Orientation Attendees')],
  ['Keys to 100 goal', habitat['100'], () => has('impact', 'Keys to 100')],
];
for (const [claim, inApp, fn] of impactChecks) check('Habitat OC Impact Report', claim, inApp && fn(), inApp ? '' : 'app no longer shows this value');
for (const city of facts.HABITAT_CITIES) check('Habitat OC Impact Report', `Built in ${city}`, has('impact', city));
check('Habitat OC Impact Report', 'Hassan family quote is verbatim', has('impact', 'first immigrant in my family to own a home'));

const auditChecks = [
  ['52 homes repaired in FY2025 (incl. 1 veteran home)', habitat['52'] && has('audit', 'Fifty-two (52) homes, including one (1) veterans')],
  ['239 homes built and sold since inception', has('audit', '239 homes previously constructed')],
  ['Silent second typically $1 to $1,000', has('audit', '$1 to $1000')],
  ['Third-party bank first mortgages since 2018', has('audit', 'Beginning in 2018')],
  ['Two homes repurchased and resold', has('audit', 'Two (2) homes were repurchased')],
  ['Homes sold to low- and moderate-income families at cost', has('audit', 'moderate-income families at cost')],
  ['Some mortgages funded by CalHome', has('audit', 'CalHome')],
];
for (const [claim, ok] of auditChecks) check('Habitat OC audit (FY2025)', claim, ok);

// ── 4. OC Housing Element ───────────────────────────────────────────
for (const row of facts.HOUSING_ELEMENT.affordability2023) {
  const inc = `$${row.income.toLocaleString('en-US')}`;
  const price = `$${row.price.toLocaleString('en-US')}`;
  check('OC Housing Element (Feb 2025)', `${row.category}: income ${inc}, affordable price ${price}`, near('element', inc, price, 120));
}
check('OC Housing Element (Feb 2025)', '"public subsidies are generally required"', has('element', 'public subsidies are generally required'));
check('OC Housing Element (Feb 2025)', 'MAP serves first-time buyers at 80% AMI or less', has('element', 'homebuyers whose annual income is 80% or less of the Area Median Income'));
check('OC Housing Element (Feb 2025)', 'MCC tax credit of up to 15%', has('element', 'tax credit of up to 15%'));
check('OC Housing Element (Feb 2025)', 'Median price $609,000 (2015) and $1,055,000 (July 2023)', /2015\s+[\d,]+\s+[\d.]+%\s+609,000/.test(flat.element) && has('element', '1,055,000'));

// ── 5. 2025 Energy Code manual ──────────────────────────────────────
const energyChecks = [
  ['Heat pump heating on the prescriptive path', 'required to be a heat pump'],
  ['Window U-factor 0.27 in many climate zones', 'reduced to 0.27'],
  ['Mandatory window U-factor 0.40', 'U-factor of 0.40'],
  ['Battery-ready for 125-amp+ panels', '125 amp service panel'],
  ['Solar sized by usable roof area (SARA)', 'solar access roof area'],
  ['Fire-zone (WUI) window exception', 'wildland-urban interface'],
];
for (const [claim, s] of energyChecks) check('2025 Energy Code manual', claim, has('energy', s), snippet('energy', s, 30));

// ── report ──────────────────────────────────────────────────────────
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
const now = new Date().toISOString();
const groups = [...new Set(results.map((r) => r.group))];
const md = [
  '# Document verification report',
  '',
  `Run: ${now} · **${passed} of ${results.length} checks passed**${failed.length ? ` · **${failed.length} failed**` : ''} · ${limitNumbers.toLocaleString()} income-limit numbers compared`,
  '',
  'Generated by `npm run verify:docs`. Compares facts shown in Front Door with the text of the hackathon source documents (no AI).',
  '',
  '| Source | File | SHA-256 (first 12) |',
  '| --- | --- | --- |',
  ...Object.entries(FILES).map(([k, f]) => `| ${k} | ${f} | \`${fingerprints[k]}\` |`),
  '',
  ...groups.flatMap((g) => {
    const rs = results.filter((r) => r.group === g);
    return [`## ${g} (${rs.filter((r) => r.ok).length}/${rs.length})`, '', '| | Claim | Evidence |', '| --- | --- | --- |',
      ...rs.map((r) => `| ${r.ok ? '✅' : '❌'} | ${r.claim} | ${(r.evidence || '').replace(/\|/g, '\\|').slice(0, 140)} |`), ''];
  }),
].join('\n');
writeFileSync(join(ROOT, 'docs', 'verification-report.md'), md);

for (const g of groups) {
  const rs = results.filter((r) => r.group === g);
  console.log(`${rs.every((r) => r.ok) ? '✅' : '❌'} ${g}: ${rs.filter((r) => r.ok).length}/${rs.length}`);
}
for (const f of failed) console.log(`   ❌ ${f.claim}${f.evidence ? ` (${f.evidence})` : ''}`);
console.log(`\n${passed}/${results.length} passed · ${limitNumbers.toLocaleString()} income-limit numbers checked · report: docs/verification-report.md`);
if (readdirSync(tmp).length) execFileSync('rm', ['-rf', tmp]);
process.exit(failed.length ? 1 : 0);
