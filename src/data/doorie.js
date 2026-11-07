/**
 * Doorie, Front Door's chatbot. It answers ONLY questions about home loans and home buying in
 * Orange County, using Front Door's own checked content (no AI, $0 per question, nothing leaves
 * the device). Off-topic or out-of-area questions get a polite "try Google".
 *
 * Pipeline: normalize → topic gate (must be about home loans / buying / OC) → area gate (not another
 * state or county) → keyword-scored search over the knowledge base → best answer + links.
 */
import { PROGRAMS } from './programs';
import { GLOSSARY } from './glossary';
import { LOAN_TYPES } from './loanTypes';
import { LENDERS } from './lenders';
import LAWS from './caLaws.json';
import RATE_INFO from './rate.json';
import { OC_INCOME_LIMITS_2026 } from './incomeLimits';
import { OC_CITIES } from './ocCities';
import { CA_INCOME_LIMITS_2026 } from './caIncomeLimits';

const money = (n) => `$${Math.round(n).toLocaleString('en-US')}`;

// ── Curated answers to the most common questions ────────────────────
const FAQ = [
  { id: 'afford', title: 'How much home can I afford?', keywords: 'afford how much budget price max qualify income salary payment',
    plain: 'A safe house payment (loan, taxes, insurance) is about 30–35% of your income before taxes, and all debts together should stay under about 43%. Your friendly check-in does the math for your family and shows a price range.',
    eli5: 'Spend about $30–$35 of every $100 you earn on your home. The check-in figures out your number.', link: '#/plan', linkLabel: 'Take the check-in: see where you are' },
  { id: 'down-help', title: 'Is there help with the down payment in Orange County?', keywords: 'down payment help assistance grant dpa money save saving',
    plain: 'Yes. Options include CalHFA MyHome (up to 3.5%), city loans (Garden Grove up to $110,000, Santa Ana up to $120,000, Anaheim $50,000), the County Mortgage Assistance Program (up to $80,000 in unincorporated OC and 14 smaller cities), FHLBank WISH grants (4-to-1 match up to $32,837), bank grants, and Habitat for Humanity OC.',
    eli5: 'Yes! Many helpers pay part of the first big chunk. Your check-in shows which ones fit you.', link: '#/learn/programs', linkLabel: 'See all programs' },
  { id: 'rate', title: 'What are mortgage rates right now?', keywords: 'rate rates interest current today mortgage rate apr',
    plain: `The average 30-year fixed rate was ${RATE_INFO.value}% for the week of ${RATE_INFO.asOf} (Freddie Mac), compared with ${RATE_INFO.yearAgo}% a year earlier. Your rate depends on your credit, down payment, and lender, so get 3 quotes in the same week.`,
    eli5: `Right now borrowing for a house costs about ${RATE_INFO.value}% a year. Ask three banks for their price.`, link: '#/learn/rates', linkLabel: 'Why rates are high, and how to find a lower one' },
  { id: 'income-limits', title: 'What are the income limits in Orange County?', keywords: 'income limit limits ami median low income moderate qualify category',
    plain: `For a family of 4 in 2026: area median income ${money(OC_INCOME_LIMITS_2026.median[3])}; very low income up to ${money(OC_INCOME_LIMITS_2026.veryLow[3])}; low income up to ${money(OC_INCOME_LIMITS_2026.low[3])}; moderate up to ${money(OC_INCOME_LIMITS_2026.moderate[3])}. Limits change with household size.`,
    eli5: 'There is a chart of paychecks that decides who gets help. For a family of 4, "low income" here goes up to almost $149,000.', link: '#/learn/fit', linkLabel: 'Check where your family fits' },
  { id: 'credit', title: 'What credit score do I need?', keywords: 'credit score fico minimum need bad credit 580 620 640',
    plain: 'FHA loans can go as low as 580 (500 with 10% down). Conventional 3%-down loans usually need 620+, and CalHFA and GSFA help often needs 640–660+. Paying on time and keeping cards under 30% of their limits raises your score.',
    eli5: 'Your money report card needs to be at least 580 for the easiest loan. Pay bills on time to raise it.', link: '#/learn/words', linkLabel: 'Words lenders use' },
  { id: 'first-time', title: 'Am I a first-time homebuyer?', keywords: 'first time first-time buyer owned before',
    plain: 'For most programs, you count as a first-time buyer if you haven\'t owned a home in the last 3 years, even if you owned one long ago.',
    eli5: 'If you haven\'t owned a home in 3 years, you count as new.', link: '#/plan', linkLabel: 'Find my plan' },
  { id: 'habitat', title: 'How do I apply to Habitat for Humanity OC?', keywords: 'habitat humanity apply sweat equity orientation build',
    plain: 'Start with a free online orientation at habitatoc.org. Habitat OC serves households from about $55,850 to $166,300 (family of 4), asks for 200–500 sweat-equity hours and 1–5% down plus closing costs, and keeps the payment around 30–35% of income.',
    eli5: 'Go to a free online meeting first. You help build, and then you can buy a home at a fair price.', link: '#/learn/habitat', linkLabel: 'How Habitat works' },
  { id: 'map', title: 'Which cities does the County Mortgage Assistance Program cover?', keywords: 'county mortgage assistance program map 80000 which cities eligible',
    plain: 'The County of Orange MAP (up to $80,000, 3% simple interest, deferred 30 years) covers unincorporated OC plus Brea, Cypress, Dana Point, La Palma, Laguna Beach, Laguna Hills, Laguna Woods, Los Alamitos, Placentia, San Juan Capistrano, Seal Beach, Stanton, Villa Park, and Yorba Linda. Call the Affordable Housing Clearinghouse (949-859-9255) to confirm it is open.',
    eli5: 'The county helper only works in some towns. Big cities like Santa Ana have their own helpers.', link: '#/calculator', linkLabel: 'Check your city in the calculator' },
  { id: 'teachers', title: 'Is there help for teachers and school staff?', keywords: 'teacher teachers school staff aide educator schoolsfirst district',
    plain: 'Yes: SchoolsFirst FCU offers a $7,500 grant and a no-PMI loan with 3% down for school employees; GSFA Platinum Select adds a gift for educators; Teacher Loan Forgiveness and PSLF can lower student loan payments so you qualify for more.',
    eli5: 'If you work at a school, a school bank can give you $7,500 toward your home.', link: '#/learn/jobs', linkLabel: 'Help by job' },
  { id: 'firefighters', title: 'Is there help for firefighters, police, or nurses?', keywords: 'firefighter firefighters police officer nurse nurses emt healthcare hero heroes',
    plain: 'California has no state "hero" grant, but you can stack options: GSFA Platinum Select (extra gift for public safety and health care workers), Firefighters First Credit Union (3% down, no PMI), CalHFA MyHome, and city loans.',
    eli5: 'There isn\'t one big hero present here, but several smaller helpers add up.', link: '#/learn/jobs', linkLabel: 'Help by job' },
  { id: 'cheapest', title: 'Where can I get the cheapest mortgage?', keywords: 'cheapest lender lenders bank credit union where borrow lowest cost best',
    plain: 'In Orange County, credit unions like SchoolsFirst and Navy Federal had some of the lowest real costs in 2024 (HMDA data). Pick the lender that accepts your down payment help, then compare 3 Loan Estimates in the same week.',
    eli5: 'Small member banks often charge less. Ask three of them for their price.', link: '#/learn/lenders', linkLabel: 'Where to get the loan' },
  { id: 'dti', title: 'What is DTI?', keywords: 'dti debt to income ratio 30 35 43',
    plain: 'Debt-to-income (DTI) is your monthly debts, including the new house payment, divided by your gross monthly income. Aim for a house payment of 30–35% of income; lenders usually want all debts under about 43%.',
    eli5: 'It\'s how much of your paycheck goes to bills. Less is better.', link: '#/calculator', linkLabel: 'Try the DTI slider' },
  { id: 'pmi', title: 'What is PMI and how do I get rid of it?', keywords: 'pmi mip mortgage insurance remove cancel',
    plain: 'Mortgage insurance protects the lender when you put less than 20% down. On conventional loans it can be removed at 80% loan-to-value and drops off at 78%; FHA insurance usually lasts the life of the loan unless you refinance.',
    eli5: 'A seatbelt fee for the bank. Once you own enough of the house, it can go away.', link: '#/calculator', linkLabel: 'See when PMI ends in the amortization explorer' },
  { id: 'closing', title: 'How much are closing costs?', keywords: 'closing costs fees escrow cash to close',
    plain: 'Usually 2–5% of the price: lender fees, title, escrow, appraisal, and prepaid taxes and insurance. CalHFA ZIP, seller credits, and some grants can cover part of it.',
    eli5: 'The little fees at the end, often a few thousand dollars. Some helpers pay them.', link: '#/learn/words', linkLabel: 'Words lenders use' },
  { id: 'itin', title: 'Can I buy a home with an ITIN?', keywords: 'itin no ssn social security immigrant undocumented tax id',
    plain: 'Yes, through private and mission lenders (CDFIs, some credit unions and community banks). ITIN loans often need 10–20% down and 2 years of tax returns. Most government programs require a Social Security number. NeighborWorks OC is a good first stop.',
    eli5: 'Yes. Some lenders help people who pay taxes with a special tax number.', link: '#/learn/private', linkLabel: 'Private lending' },
  { id: 'self-employed', title: 'I\'m self-employed. Can I get a mortgage?', keywords: 'self employed gig 1099 business owner bank statement uber',
    plain: 'Yes. Standard loans use 2 years of tax returns. If write-offs make your income look low, bank-statement loans use 12–24 months of deposits instead, usually with a higher rate and 10%+ down.',
    eli5: 'Yes. Some banks look at the money going into your account instead of a paycheck stub.', link: '#/learn/private', linkLabel: 'Private lending' },
  { id: 'veteran', title: 'What help is there for veterans?', keywords: 'veteran veterans va military calvet service',
    plain: 'VA loans need $0 down and no monthly mortgage insurance; the funding fee is waived with a service-connected disability. CalVet home loans are another option, and Prop 1 (2026) adds $1.25 billion for them.',
    eli5: 'If you served, you can buy without a down payment.', link: '#/results/compare', linkLabel: 'Compare loans' },
  { id: 'disability', title: 'Is there help for buyers with a disability?', keywords: 'disability disabled ssi ssdi calable accessible',
    plain: 'Disability income (SSDI, SSI, VA) counts for a mortgage and can often be "grossed up". CalABLE lets you save without losing benefits, FHA 203(k) can include accessibility renovations, and Section 8 homeownership has special rules.',
    eli5: 'Disability checks count like a paycheck, and there\'s help to make a home easy to get around in.', link: '#/learn/disability', linkLabel: 'Buyers with a disability' },
  { id: 'class', title: 'Where do I take a homebuyer class?', keywords: 'homebuyer class education course certificate counselor counseling hud neighborworks',
    plain: 'NeighborWorks Orange County (714-490-1250) offers the 8-hour HUD-approved homebuyer class and free counseling; online options like eHome America are accepted by CalHFA. Most programs require the certificate.',
    eli5: 'Take the free class first. It\'s the ticket that lets you use the helpers.', link: '#/learn/steps', linkLabel: 'Your checklist' },
  { id: 'timeline', title: 'How long does buying a home take?', keywords: 'how long timeline time months weeks fast faster',
    plain: 'Often 3–9 months once your credit and savings are ready, longer for lotteries and waitlists. Doing steps at the same time (class, papers, lists, one lender for all programs) can save weeks.',
    eli5: 'A few months, sometimes more. Doing steps at the same time makes it faster.', link: '#/results/timeline', linkLabel: 'Your timeline and calendar' },
  { id: 'interest', title: 'How can I pay less interest?', keywords: 'pay less interest extra payment biweekly payoff early save',
    plain: 'Extra principal payments, paying half every two weeks, putting tax refunds toward the loan, a shorter term, refinancing when rates drop enough, and removing PMI early all cut total interest.',
    eli5: 'Pay a little extra and the loan ends sooner and costs less.', link: '#/learn/interest', linkLabel: 'Pay less interest' },
  { id: 'scams', title: 'How do I avoid scams?', keywords: 'scam scams fraud wire red flags predatory',
    plain: 'Real programs never charge to apply. Check every lender on NMLS Consumer Access, never wire money without calling escrow at a number you looked up, and avoid balloon payments and pressure to sign fast.',
    eli5: 'If someone wants money to give you "free money," it\'s a trick.', link: '#/learn/private', linkLabel: 'Red flags' },
  { id: 'laws', title: 'What new California laws affect homebuyers?', keywords: 'law laws new legislation bill 2027 2026 prop proposition',
    plain: 'From Jan 1, 2027: SB 1116 (more small starter homes), AB 1751 (fast-track for-sale townhomes, 10% for lower-income buyers), AB 956 (two ADUs per lot), and AB 2038 (insurers can\'t drop wildfire victims for two years). Prop 1 and Prop 37 (Nov 2026) are projected to pass.',
    eli5: 'New rules are coming that make it easier to build small homes to buy.', link: '#/learn/laws', linkLabel: 'New California laws' },
];

// ── Build the knowledge base ────────────────────────────────────────
function entries() {
  const kb = FAQ.map((f) => ({ ...f, source: 'Front Door' }));
  for (const p of PROGRAMS) {
    kb.push({ id: `p-${p.id}`, title: p.name, keywords: `${p.name} ${p.org} ${p.type}`, plain: `${p.gives} Who: ${p.who} Watch out: ${p.catch}`, eli5: p.eli5, link: p.url, linkLabel: 'Official page', source: p.org, status: p.status });
  }
  for (const g of GLOSSARY) kb.push({ id: `g-${g.term}`, title: g.term, keywords: g.term, plain: g.plain, eli5: g.eli5, link: '#/learn/words', linkLabel: 'Words lenders use' });
  for (const l of LOAN_TYPES) kb.push({ id: `lt-${l.id}`, title: l.name, keywords: `${l.name} ${l.id}`, plain: `${l.what} ${l.lowIncome}`, eli5: l.eli5, link: '#/learn/loan-types', linkLabel: 'Every kind of mortgage' });
  for (const l of LENDERS) kb.push({ id: `ln-${l.id}`, title: l.name, keywords: `${l.name} ${l.type}`, plain: `${l.who} ${l.perks}`, link: l.url, linkLabel: 'Their rates' });
  for (const l of LAWS) kb.push({ id: `law-${l.id}`, title: `${l.bill}: ${l.title}`, keywords: `${l.bill} ${l.title} ${l.category}`, plain: `${l.plain} ${l.impactWhy}`, eli5: l.eli5, link: l.url, linkLabel: 'Official source', verified: l.verified });
  for (const c of OC_CITIES) {
    const help = c.programIds.map((id) => PROGRAMS.find((p) => p.id === id)?.name).filter(Boolean);
    kb.push({ id: `city-${c.id}`, title: `Home buying help in ${c.name}`, keywords: `${c.name} city`,
      plain: `${help.length ? `Local programs: ${help.join(', ')}. ` : 'No city down payment loan found. '}${c.mapEligible ? 'The County Mortgage Assistance Program (up to $80,000) covers it.' : 'The County Mortgage Assistance Program does not cover it.'} Statewide help like CalHFA MyHome and WISH grants still applies.`,
      link: '#/calculator', linkLabel: `See ${c.name} in the calculator` });
  }
  return kb.map((e) => ({ ...e, _title: tokens(e.title), _keys: tokens(`${e.keywords || ''}`), _body: tokens(e.plain) }));
}

// ── Text helpers ────────────────────────────────────────────────────
const STOP = new Set('a an the is are am i me my we our you your can could do does how what which who where when why to of for in on at by with and or if it its be get got there this that much many any some about from will would should please tell know want need oc orange county california'.split(' '));
function norm(s) { return (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9$%\s-]/g, ' '); }
function tokens(s) { return norm(s).split(/[\s-]+/).filter((w) => w && !STOP.has(w)).map(stem); }
function stem(w) { return w.length > 4 ? w.replace(/(ings|ing|ers|er|es|s)$/, '') : w; }

// Words that make a question "about home loans / buying a home".
const TOPIC = new Set(['loan', 'mortgage', 'down', 'payment', 'home', 'house', 'condo', 'townhome', 'buy', 'buyer', 'purchase', 'own', 'owner', 'credit', 'score', 'rate', 'interest', 'apr', 'fha', 'va', 'usda', 'calhfa', 'myhome', 'zip', 'dream', 'habitat', 'grant', 'assistance', 'dpa', 'dti', 'income', 'ami', 'pmi', 'mip', 'escrow', 'closing', 'lender', 'bank', 'union', 'refinance', 'refi', 'heloc', 'equity', 'reverse', 'jumbo', 'chattel', 'mobile', 'manufactured', 'afford', 'qualify', 'approval', 'preapproval', 'pre', 'apply', 'first', 'section', 'voucher', 'itin', 'self', 'employed', 'veteran', 'calvet', 'disability', 'teacher', 'nurse', 'firefighter', 'police', 'property', 'tax', 'insurance', 'hoa', 'adu', 'law', 'prop', 'proposition', 'wish', 'mcc', 'gsfa', 'schoolsfirst', 'neighborworks', 'counselor', 'class', 'amortization', 'principal', 'term', 'points', 'quote', 'scam', 'foreclosure', 'bankruptcy', 'saving', 'save', 'deposit', 'cosigner', 'gift', 'family', 'seller', 'rent', 'lottery', 'bmr', 'inclusionary', 'land', 'trust', 'clt', 'map', 'subsidy', 'program', 'help'].map(stem));
const OC_CITY_NAMES = OC_CITIES.filter((c) => c.id !== 'unincorporated').map((c) => ({ id: c.id, name: norm(c.name).trim(), toks: tokens(c.name) }));
const GENERIC = new Set(['tell', 'info', 'information', 'live', 'living', 'move', 'moving', 'city', 'area', 'near', 'option', 'options'].map(stem));

// Common loan words in Spanish, Vietnamese (accents removed), French, Chinese, and Arabic → English,
// so questions in other languages reach the same answers.
const SYNONYMS = [
  ['¿cuánto', 'how much afford'], ['cuanto', 'how much afford'], ['pagar', 'afford payment'], ['casa', 'home'], ['vivienda', 'home'], ['préstamo', 'loan'], ['prestamo', 'loan'],
  ['hipoteca', 'mortgage'], ['enganche', 'down payment'], ['pago inicial', 'down payment'], ['crédito', 'credit'], ['credito', 'credit'], ['puntaje', 'score'],
  ['interés', 'interest rate'], ['interes', 'interest rate'], ['tasa', 'rate'], ['ayuda', 'help assistance'], ['comprar', 'buy'], ['primera vez', 'first time'],
  ['điểm tín dụng', 'credit score'], ['điểm', 'score'], ['nhà', 'home'], ['vay', 'loan'], ['mua', 'buy'], ['tiền đặt cọc', 'down payment'], ['lãi suất', 'interest rate'], ['tín dụng', 'credit'], ['hỗ trợ', 'help assistance'],
  ['maison', 'home'], ['prêt', 'loan'], ['hypothèque', 'mortgage'], ['acheter', 'buy'], ['apport', 'down payment'], ['taux', 'rate'], ['aide', 'help assistance'],
  ['买房', 'buy home'], ['房', 'home'], ['贷款', 'loan'], ['首付', 'down payment'], ['利率', 'interest rate'], ['信用', 'credit'], ['补助', 'help assistance'], ['多少', 'how much afford'],
  ['منزل', 'home'], ['بيت', 'home'], ['قرض', 'loan'], ['رهن', 'mortgage'], ['فائدة', 'interest rate'], ['دفعة أولى', 'down payment'], ['مساعدة', 'help assistance'], ['ائتمان', 'credit'],
];
function translateKeywords(question) {
  let q = ` ${question.toLowerCase()} `;
  for (const [from, to] of SYNONYMS) if (q.includes(from)) q += ` ${to}`;
  return q;
}

// Places outside Orange County → out of scope.
const OTHER_COUNTIES = Object.keys(CA_INCOME_LIMITS_2026).filter((c) => c !== 'Orange').map((c) => norm(c));
const STATES = ['texas', 'florida', 'new york', 'arizona', 'nevada', 'oregon', 'washington state', 'colorado', 'illinois', 'georgia', 'utah', 'ohio', 'hawaii', 'idaho', 'tennessee', 'north carolina', 'new jersey', 'massachusetts', 'virginia', 'michigan', 'pennsylvania', 'canada', 'mexico'];

let KB = null;
export const SUGGESTIONS = ['How much home can I afford?', 'Is there help with the down payment in Orange County?', 'What credit score do I need?', 'How do I apply to Habitat for Humanity OC?', 'What are mortgage rates right now?', 'Where can I get the cheapest mortgage?'];

/**
 * Answer a question. Returns { kind: 'answer' | 'offtopic' | 'outofarea', title?, plain?, eli5?, link?, linkLabel?, related?[] }.
 */
export function askDoorie(question) {
  if (!KB) KB = entries();
  const expanded = translateKeywords(question || '');
  const q = norm(expanded);
  const words = tokens(expanded);
  if (!words.length) return { kind: 'offtopic' };

  // Whole-name city match ("los alamitos", not just "los").
  const city = OC_CITY_NAMES.find((c) => new RegExp(`\\b${c.name}\\b`).test(q)) || null;
  const mentionsOC = Boolean(city) || /orange county|\boc\b/.test(norm(question));
  const otherPlace = !mentionsOC && (OTHER_COUNTIES.some((c) => new RegExp(`\\b${c}\\b`).test(q)) || STATES.some((s) => q.includes(s)));
  const hasTopic = words.some((w) => TOPIC.has(w));
  // A city name alone is on-topic only for "tell me about <city>"-style questions.
  const cityOnly = city && words.filter((w) => !city.toks.includes(w)).every((w) => GENERIC.has(w));
  if (!hasTopic && !cityOnly) return { kind: 'offtopic' };
  if (otherPlace) return { kind: 'outofarea' };

  const scored = KB.map((e) => {
    let s = 0;
    for (const w of words) {
      if (e._title.includes(w)) s += 3;
      if (e._keys.includes(w)) s += 2;
      if (e._body.includes(w)) s += 0.5;
    }
    if (e.id && FAQ.some((f) => f.id === e.id)) s *= 1.3; // prefer curated answers
    if (e.status === 'closed') s *= 0.4; // closed programs rank low
    if (city && e.id === `city-${city.id}`) s += 14; // a named city gets its own answer
    return { e, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);

  if (!scored.length || scored[0].s < 2) {
    return { kind: 'answer', title: 'I\'m not sure about that one yet', plain: 'I couldn\'t find that in Front Door\'s information. Your check-in or a free HUD-approved counselor (NeighborWorks OC, 714-490-1250) can help with your exact situation.', eli5: 'I don\'t know that one. A free helper can answer it.', link: '#/plan', linkLabel: 'Take the check-in: see where you are' };
  }
  const best = scored[0].e;
  const related = scored.slice(1, 4).filter((x) => x.s >= scored[0].s * 0.5).map((x) => x.e.title);
  return { kind: 'answer', ...best, related };
}
