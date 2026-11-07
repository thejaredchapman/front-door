/**
 * "Find my plan" questionnaire: answer options, loan plans with pros/cons,
 * the rules that decide which plans fit, and money lessons tied to answers.
 *
 * Credit waiting periods after bankruptcy/foreclosure are the standard
 * agency guidelines (FHA, VA, Fannie/Freddie). Lenders can be stricter.
 * Program terms change. Results are a starting point for a talk with a
 * HUD-approved counselor or lender, not a loan decision.
 */
import { getIncomeCategory, limitsTable } from './incomeLimits';
import { regionOf } from './caIncomeLimits';
import { OC_CITIES, findOcCity } from './ocCities';

export const CREDIT_BANDS = [
  { id: 'unknown', label: "I don't know", score: null },
  { id: 'none', label: 'I have no credit yet', score: null },
  { id: 'poor', label: 'Under 580', score: 550 },
  { id: 'fair1', label: '580 – 619', score: 590 },
  { id: 'fair2', label: '620 – 639', score: 625 },
  { id: 'good1', label: '640 – 679', score: 650 },
  { id: 'good2', label: '680 – 739', score: 700 },
  { id: 'great', label: '740 or higher', score: 760 },
];

export const BANKRUPTCY_OPTIONS = [
  { id: 'none', label: 'Never', years: 99 },
  { id: 'lt2', label: 'Less than 2 years ago', years: 1 },
  { id: '2to4', label: '2 to 4 years ago', years: 3 },
  { id: 'gt4', label: 'More than 4 years ago', years: 5 },
];

export const FORECLOSURE_OPTIONS = [
  { id: 'none', label: 'Never', years: 99 },
  { id: 'lt3', label: 'Less than 3 years ago', years: 2 },
  { id: '3to7', label: '3 to 7 years ago', years: 5 },
  { id: 'gt7', label: 'More than 7 years ago', years: 8 },
];

/** Quiz city choices: "anywhere" plus every Orange County city (see src/data/ocCities.js). */
export const CITY_OPTIONS = [{ id: 'any', label: 'Anywhere in Orange County / not sure' }, ...OC_CITIES.map((c) => ({ id: c.id, label: c.name }))];

export const GROUPS = [
  { id: 'schoolsfirst', label: 'SchoolsFirst Federal Credit Union' },
  { id: 'ffcu', label: 'Firefighters First Credit Union' },
  { id: 'ocscu', label: "Orange County's Credit Union" },
  { id: 'otherCU', label: 'Another credit union' },
  { id: 'veteran', label: 'Military / veteran (VA or CalVet)' },
  { id: 'tribe', label: 'Federally recognized tribe' },
  { id: 'union', label: 'A labor union' },
  { id: 'uci', label: 'UC Irvine employee' },
  { id: 'voucher', label: 'Section 8 / Housing Choice Voucher' },
  { id: 'habitat', label: 'Went to a Habitat OC orientation' },
  { id: 'class', label: 'Finished a homebuyer class' },
];

/** Quiz layout: which answer keys count as answering each numbered question, grouped by step. */
export const QUIZ_STEPS = [
  { title: 'Your family & money', questions: [['householdSize'], ['income'], ['monthlyDebts'], ['savings']] },
  { title: 'Your credit', questions: [['credit'], ['latePayments', 'collections', 'q6'], ['bankruptcy'], ['foreclosure']] },
  { title: 'You & your work', questions: [['ownedRecently', 'parentsOwned'], ['occupation', 'jobTitle', 'employer'], ['groups', 'q11'], ['disability']] },
  { title: 'Where & how', questions: [['county', 'city'], ['payType', 'idType'], ['familyHelp', 'sellerOpen']] },
];

export const YES_NO = [{ id: true, label: 'Yes' }, { id: false, label: 'No' }];

export const PAY_TYPES = [
  { id: 'w2', label: 'Paycheck (W-2)' },
  { id: 'self', label: 'Self-employed / gig / 1099' },
  { id: 'mixed', label: 'Both' },
];

export const ID_TYPES = [
  { id: 'ssn', label: 'Social Security number' },
  { id: 'itin', label: 'ITIN (tax ID number)' },
  { id: 'skip', label: 'Prefer not to say' },
];

export const DEFAULT_ANSWERS = {
  householdSize: 4,
  income: 85000,
  occupation: 'any',
  ownedRecently: false,
  parentsOwned: false,
  credit: 'unknown',
  latePayments: false,
  collections: false,
  bankruptcy: 'none',
  foreclosure: 'none',
  monthlyDebts: 400,
  savings: 5000,
  county: 'Orange',
  city: 'any',
  groups: [],
  payType: 'w2',
  idType: 'ssn',
  familyHelp: false,
  sellerOpen: false,
  jobTitle: '',
  employer: '',
  disability: false,
};

const RANK = { acutelyLow: 0, extremelyLow: 1, veryLow: 2, low: 3, moderate: 4, above: 5 };

// ── helpers ────────────────────────────────────────────────────────
const ok = (text) => ({ level: 'ok', text });
const maybe = (text) => ({ level: 'maybe', text });
const no = (text) => ({ level: 'no', text });

function creditCheck(a, min, name) {
  const band = CREDIT_BANDS.find((b) => b.id === a.credit);
  if (band.score === null) {
    return maybe(a.credit === 'none'
      ? `You need some credit history. Many lenders want ${min}+ for ${name}.`
      : `Check your score for free. ${name} usually needs ${min}+.`);
  }
  return band.score >= min ? ok(`Your credit (${band.label}) meets the usual ${min}+.`) : no(`${name} usually needs ${min}+. Yours is ${band.label}.`);
}

function waitCheck(a, { bk, fc }) {
  const b = BANKRUPTCY_OPTIONS.find((x) => x.id === a.bankruptcy).years;
  const f = FORECLOSURE_OPTIONS.find((x) => x.id === a.foreclosure).years;
  const out = [];
  if (b < bk) out.push(no(`Usually must wait ${bk} years after a bankruptcy.`));
  if (f < fc) out.push(no(`Usually must wait ${fc} years after a foreclosure or short sale.`));
  return out;
}

/** Recent late payments / collections don't auto-disqualify, but lenders look closely. */
function historyFlags(a) {
  const out = [];
  if (a.latePayments) out.push(maybe('Recent late payments: expect questions. A letter explaining why can help.'));
  if (a.collections) out.push(maybe('Collections: some must be paid or set on a payment plan before closing.'));
  return out;
}

/** For lenders without a published minimum score: low or unknown credit is a "maybe", not a "no". */
function softCredit(a) {
  const band = CREDIT_BANDS.find((b) => b.id === a.credit);
  if (band.score === null) return [maybe('The lender will check your credit. Find out your score first.')];
  if (band.score < 620) return [maybe('Credit under 620 may be hard for this lender. Ask what they require.')];
  return [];
}

function firstTime(a) {
  return a.ownedRecently ? no('Requires no home owned in the last 3 years.') : ok('You count as a first-time buyer.');
}

function has(a, id) {
  return a.groups.includes(id);
}

// ── the plans ──────────────────────────────────────────────────────
export const PLANS = [
  {
    id: 'credit-first',
    name: 'Build-your-credit plan (6–24 months)',
    kind: 'Get ready first',
    simple: 'Fix the foundation first, then buy with a cheaper loan.',
    pros: ['Better credit = lower interest = smaller payment every month', 'Free help from HUD counselors', 'You save money while you wait'],
    cons: ['Takes time', 'Prices and rates may change while you wait'],
    url: 'https://www.hud.gov/findacounselor',
    check: (a, ctx) => {
      const r = [];
      const band = CREDIT_BANDS.find((b) => b.id === a.credit);
      if (band.score !== null && band.score < 580) r.push(ok('Your score is under 580. Raising it opens up most plans.'));
      if (a.credit === 'none') r.push(ok('No credit yet. A secured card or credit-builder loan can start it.'));
      if (a.bankruptcy === 'lt2') r.push(ok('A recent bankruptcy means a waiting period for most loans.'));
      if (a.foreclosure === 'lt3') r.push(ok('A recent foreclosure means a waiting period for most loans.'));
      if (a.latePayments) r.push(ok('Late payments in the last year hurt approval. 12 on-time months helps a lot.'));
      if (ctx.debtRatio > 0.2) r.push(ok(`Your debts take ${Math.round(ctx.debtRatio * 100)}% of your income. Paying them down raises what you can borrow.`));
      return r.length ? r : [no('Not needed: your credit picture already looks ready.')];
    },
  },
  {
    id: 'habitat',
    name: 'Habitat for Humanity of Orange County',
    kind: 'Build & buy',
    simple: 'Help build homes, take classes, then buy one at a price that fits your paycheck.',
    pros: ['Monthly payment kept to about 30–35% of income', 'Home sold at cost, not market price', 'A silent second protects you from bad lenders', 'Coaching and community support'],
    cons: ['200–500 volunteer (sweat-equity) hours', 'Very few homes; you may wait', 'When you sell, Habitat shares the gain so the home stays affordable', 'Need 1–5% down plus closing costs'],
    url: 'https://habitatoc.org/review-qualifications',
    check: (a, ctx) => {
      const r = [];
      const idx = Math.min(Math.max(a.householdSize, 1), 8) - 1;
      const table = limitsTable(ctx.county);
      const min = table.extremelyLow[idx];
      const max = table.moderate[idx];
      if (!ctx.isOC) r.push(maybe(`Outside Orange County, find your local Habitat affiliate (habitat.org/local). Each sets its own income range.`));
      if (a.income < min) r.push((ctx.isOC ? no : maybe)(`Habitat OC's range for your household starts at about $${min.toLocaleString()}${ctx.isOC ? '' : ' (OC rule, using your county\'s limits)'}.`));
      else if (a.income > max) r.push((ctx.isOC ? no : maybe)(`Habitat OC's range for your household tops out at about $${max.toLocaleString()}${ctx.isOC ? '' : ' (OC rule, using your county\'s limits)'}.`));
      else r.push(ok(ctx.isOC ? 'Your income is inside Habitat OC\'s 2026 range.' : 'Your income fits the kind of range Habitat affiliates usually serve.'));
      if (a.bankruptcy === 'lt2' || a.foreclosure === 'lt3' || a.collections) r.push(maybe('Habitat asks for credit "in good standing". Recent problems may need fixing first.'));
      if (ctx.savingsPct < 1) r.push(maybe('You\'ll need savings for 1–5% down plus closing costs.'));
      r.push(has(a, 'habitat') ? ok('You already went to an orientation. Great first step!') : maybe('Next step: attend a free online orientation.'));
      return r;
    },
  },
  {
    id: 'fha-myhome',
    name: 'FHA loan + CalHFA MyHome down payment help',
    kind: 'Loan',
    simple: 'An easy-to-get main loan, with the state paying your down payment.',
    pros: ['Accepts lower credit scores (580+)', 'MyHome covers the 3.5% down payment', 'No payment on MyHome until you sell or refinance', 'No income cap on FHA'],
    cons: ['Monthly mortgage insurance, usually for the life of the loan', 'MyHome must be paid back later', 'CalHFA often wants a higher score than FHA; ask the lender'],
    url: 'https://www.calhfa.ca.gov/homebuyer/programs/myhome.htm',
    check: (a) => [creditCheck(a, 580, 'FHA'), firstTime(a), ...waitCheck(a, { bk: 2, fc: 3 }), ...historyFlags(a)],
  },
  {
    id: 'homeready',
    name: '3%-down conventional loan (HomeReady / Home Possible)',
    kind: 'Loan',
    simple: 'A regular loan with a tiny down payment for families earning under 80% of the area median.',
    pros: ['Only 3% down', 'Cheaper mortgage insurance than FHA', 'Mortgage insurance can be removed once you own 20%', 'Can stack with MyHome and city loans'],
    cons: ['Needs better credit (about 620+)', 'Longer wait after bankruptcy (4 yrs) or foreclosure (7 yrs)', 'Income limit: 80% of area median'],
    url: 'https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/homeready-mortgage',
    check: (a, ctx) => [
      RANK[ctx.category.id] <= RANK.low ? ok('Your income is under the 80% limit.') : no('Your income is above the 80% AMI limit.'),
      creditCheck(a, 620, 'A 3%-down conventional loan'),
      ...waitCheck(a, { bk: 4, fc: 7 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'city-loan',
    name: 'City or county 0% loan + below-market-price home',
    kind: 'Down payment help',
    simple: 'Your city lends a big chunk of the price with no monthly payment, or sells you a special lower-price home.',
    pros: ['Big help: up to $110,000 (Garden Grove), $120,000 (Santa Ana), $80,000 (County MAP, smaller cities)', 'Usually 0–3%, no payment until you sell', 'Below-market homes cost far less than normal homes'],
    cons: ['The home must be in that city', 'Lotteries and waitlists', 'Resale price is often capped', 'Rules and funding change; call first'],
    url: 'https://ggcity.org/FTHB',
    check: (a, ctx) => {
      // City loans sit on top of a first mortgage, so the main-loan waiting periods apply too.
      const r = [firstTime(a), ...waitCheck(a, { bk: 2, fc: 3 })];
      if (RANK[ctx.category.id] > RANK.moderate) r.push(no('Your income is above the moderate limit most city programs use.'));
      else r.push(ok(`Your income group (${ctx.category.short}) fits city programs.`));
      if (!ctx.isOC) r.push(maybe(`Call the ${ctx.county} County housing department and your city's housing office to ask which down payment loans are open.`));
      else if (a.city === 'garden-grove') r.push(ok('Garden Grove\'s program is confirmed active for 2026.'));
      else if (a.city === 'santa-ana') r.push(maybe('Santa Ana\'s My First Home: up to $120,000 (low) or $80,000 (moderate) if you live or work in Santa Ana. Confirm 2026 terms (714-667-2250).'));
      else if (a.city === 'anaheim') r.push(maybe('Anaheim offers $50,000 at 1% deferred for first-time buyers; confirm it is taking applications.'));
      else if (a.city === 'irvine') r.push(maybe('Irvine: watch for below-market-rate home lotteries; no city loan found.'));
      else if (['huntington-beach', 'tustin', 'brea'].includes(a.city)) r.push(maybe('Your city has below-market-rate homes for income-qualified buyers. Join its interest list.'));
      if (ctx.isOC) {
        const city = findOcCity(a.city);
        if (city?.mapEligible) r.push(ok(`The County Mortgage Assistance Program (up to $80,000) covers ${city.name}.`));
        else if (city) r.push(maybe(`The county's $80,000 loan doesn't cover ${city.name}; it only covers unincorporated OC and 14 smaller cities.`));
        else r.push(maybe('The County Mortgage Assistance Program (up to $80,000) only covers unincorporated OC and 14 smaller cities such as Brea, Cypress, Placentia, Stanton, and Yorba Linda. Otherwise, call your city\'s housing office.'));
      }
      if (ctx.savingsPct < 1) r.push(maybe('Most city programs need 1–3% of the price from your own savings.'));
      return r;
    },
  },
  {
    id: 'va',
    name: 'VA loan (and CalVet)',
    kind: 'Loan',
    simple: 'For people who served: buy with no down payment.',
    pros: ['$0 down', 'No monthly mortgage insurance', 'Friendlier after credit problems (2-year waits)'],
    cons: ['One-time funding fee (waived with a service-connected disability)', 'Home must pass VA inspection rules'],
    url: 'https://www.va.gov/housing-assistance/home-loans/',
    check: (a) => [
      has(a, 'veteran') ? ok('You said you served. Thank you!') : no('For veterans and service members only.'),
      creditCheck(a, 580, 'Most VA lenders'),
      ...waitCheck(a, { bk: 2, fc: 2 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'schoolsfirst',
    name: 'SchoolsFirst School Employee Mortgage + $7,500 grant',
    kind: 'Loan + grant',
    simple: 'If you work at a school, a credit union gives you $7,500 and a loan with no mortgage insurance.',
    pros: ['$7,500 grant you never repay', 'No mortgage insurance (PMI)', '3% down', 'Counts all school staff, not just teachers'],
    cons: ['Must use their loan', 'Grant: first-time buyers earning up to about $150K', 'At least 1% must be your own money'],
    url: 'https://www.schoolsfirstfcu.org/about-us/newsroom/2026/2026-05-12-press-release/',
    check: (a) => {
      const school = a.occupation === 'teacher' || has(a, 'schoolsfirst');
      return [
        school ? ok('You work at a school or are a member.') : no('For school employees who are SchoolsFirst members.'),
        a.income <= 150224 ? ok('Your income is under the grant limit (~$150K).') : maybe('Over ~$150K: the loan works, but not the grant.'),
        firstTime(a),
        ...softCredit(a),
        ...waitCheck(a, { bk: 4, fc: 7 }),
        ...historyFlags(a),
      ];
    },
  },
  {
    id: 'teacher-boost',
    name: 'Teacher & school-staff boost: student loan relief + district benefits',
    kind: 'Job-based help',
    simple: 'Lower your monthly student loan bill and use school-employee benefits, so you qualify for more home.',
    pros: [
      'Teacher Loan Forgiveness (up to $17,500 after 5 years at a qualifying low-income school) and Public Service Loan Forgiveness (after 120 qualifying payments)',
      'An income-driven repayment plan can cut your student loan payment, and lenders count that lower payment',
      'Lenders count your yearly contract salary, even on a 10-month schedule',
      'Some districts build employee housing on district land (California Teacher Housing Act)',
      '403(b) loans and SchoolsFirst membership',
    ],
    cons: ['Forgiveness takes years of service', 'District housing is mostly rentals with waitlists', 'Loan programs and rules change; confirm with your servicer'],
    url: 'https://studentaid.gov/manage-loans/forgiveness-cancellation/teacher',
    check: (a) => [
      a.occupation === 'teacher' ? ok('You work in a school.') : no('For teachers and school staff.'),
      a.monthlyDebts > 0 ? maybe('If student loans are part of your monthly debts, check income-driven repayment and forgiveness at studentaid.gov.') : ok('Low debts already. Keep it that way.'),
      maybe('Ask district HR about employee housing, partner lenders, and the SchoolsFirst grant.'),
    ],
  },
  {
    id: 'ffcu',
    name: 'Firefighters First Credit Union first-time buyer loan',
    kind: 'Loan',
    simple: 'A firefighter credit union loan with 3% down and no mortgage insurance.',
    pros: ['3% down', 'No mortgage insurance (PMI)'],
    cons: ['Adjustable rate: it can change after 7 years', 'No grant found'],
    url: 'https://www.firefightersfirstcu.org/Personal/Home-Loans',
    check: (a) => [
      a.occupation === 'firefighter' || has(a, 'ffcu') ? ok('You are a firefighter or member.') : no('For firefighters and their families.'),
      firstTime(a),
      ...softCredit(a),
      ...waitCheck(a, { bk: 4, fc: 7 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'gsfa',
    name: 'GSFA Platinum Select (public servants)',
    kind: 'Down payment help',
    simple: 'Extra down payment help for firefighters, police, health workers, and school staff.',
    pros: ['Down payment help up to about 5%', 'Select adds a gift of up to 1.5% for public servants', 'You do NOT need to be a first-time buyer'],
    cons: ['Mostly a second loan, not a grant (Standard has monthly payments)', 'Loan can\'t be over $832,750', 'Needs credit 640+'],
    url: 'https://gsfahome.org/programs/dpa/platinum.shtml',
    check: (a) => [
      ['firefighter', 'police', 'healthcare', 'teacher'].includes(a.occupation) ? ok('Your job qualifies for "Select".') : maybe('Your job may qualify for the standard version (no extra gift).'),
      creditCheck(a, 640, 'GSFA'),
      ...waitCheck(a, { bk: 2, fc: 3 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'section184',
    name: 'Section 184 loan (Native American buyers)',
    kind: 'Loan',
    simple: 'A low-down-payment loan for members of federally recognized tribes.',
    pros: ['Low down payment', 'Flexible on credit', 'Usable anywhere in California'],
    cons: ['Must use an approved Section 184 lender'],
    url: 'https://www.hud.gov/section184',
    check: (a) => [has(a, 'tribe') ? ok('You are a tribal member.') : no('For enrolled tribal members only.')],
  },
  {
    id: 'voucher',
    name: 'Housing Choice Voucher homeownership',
    kind: 'Monthly help',
    simple: 'Your Section 8 voucher helps pay the mortgage instead of rent.',
    pros: ['Monthly help with the payment', 'Run by the OC Housing Authority'],
    cons: ['Must already have a voucher', 'Hard to make work at OC prices'],
    url: 'https://housingauthority.oc.gov/special-housing-programs/homeownership-program',
    check: (a) => [has(a, 'voucher') ? ok('You have a voucher.') : no('Only for current voucher holders.'), firstTime(a)],
  },
  {
    id: 'zero-stack',
    name: '$0-down stack: FHA or 3%-down loan + CalHFA MyHome + ZIP',
    kind: 'Loan + help',
    simple: 'The state pays your whole down payment, and a 0% loan helps with closing costs, so you bring little or no cash.',
    pros: ['MyHome covers the full 3.5% (FHA) or 3% (conventional) down payment', 'ZIP is a 0% loan for closing costs', 'No monthly payment on either helper', 'Works with any job'],
    cons: ['You owe the helpers back when you sell or refinance', 'Bigger loan means a bigger payment', 'ZIP comes with a slightly higher main-loan rate', 'You still need deposit money and a small cushion'],
    url: 'https://www.calhfa.ca.gov/homebuyer/programs/index.htm',
    check: (a) => [creditCheck(a, 580, 'FHA'), firstTime(a), ...waitCheck(a, { bk: 2, fc: 3 }), ...historyFlags(a)],
  },
  {
    id: 'ocscu-zero',
    name: "Orange County's Credit Union: Zero Down home loan",
    kind: 'Loan',
    simple: 'A local credit union loan where you put nothing down.',
    pros: ['$0 down payment', 'No maximum income', 'Local lender that knows Orange County'],
    cons: ['2026 terms not confirmed: call first', 'Borrowing 100% means a bigger payment', 'Must become a member'],
    url: 'https://orangecountyscu.org/products/home-loans/zero-down-home-loan',
    check: (a, ctx) => [
      ...(ctx.isOC ? [] : [no('A local Orange County credit union. Look for a credit union near you with a similar loan.')]),
      has(a, 'ocscu') ? ok('You are already a member.') : maybe('You must join the credit union first. Ask who can join.'),
      maybe('Terms could not be confirmed for 2026.'),
      ...softCredit(a),
      ...waitCheck(a, { bk: 4, fc: 7 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'gnnd',
    name: 'HUD Good Neighbor Next Door: 50% off',
    kind: 'Job-based discount',
    simple: 'Police, firefighters, EMTs, and teachers can buy certain HUD homes at half price.',
    pros: ['50% off the list price', 'Only $100 down with an FHA loan', 'The discount is forgiven after you live there 3 years'],
    cons: ['Almost no homes in Orange County right now', 'Only HUD-owned homes in special areas', 'Must live there 3 years'],
    url: 'https://www.hud.gov/program_offices/housing/sfh/reo/goodn/gnndabot',
    check: (a) => [
      ['firefighter', 'police', 'teacher'].includes(a.occupation) ? ok('Your job qualifies.') : no('For police, firefighters, EMTs, and pre-K–12 teachers.'),
      maybe('No Orange County homes were found. Check hudhomestore.gov, including nearby counties.'),
    ],
  },
  {
    id: 'uci',
    name: 'UC Irvine campus homes (University Hills)',
    kind: 'Job-based home',
    simple: 'UC Irvine workers can buy below-market homes near campus.',
    pros: ['Prices far below market', 'Close to work'],
    cons: ['Long waitlist; faculty get priority', 'Resale price is limited', 'Only for UCI employees'],
    url: 'https://icha.uci.edu/for-sale-housing/',
    check: (a) => [has(a, 'uci') ? ok('You work for UC Irvine.') : no('Only for full-time UC Irvine employees.'), maybe('Join the waitlist early. It is long.')],
  },
  {
    id: 'usda',
    name: 'USDA rural home loan (Section 502)',
    kind: 'Loan',
    simple: 'In eligible rural and small-town areas, buy with no down payment.',
    pros: ['$0 down', 'Lower mortgage insurance than FHA', 'Direct loans can lower the payment for very low incomes'],
    cons: ['Only in USDA-eligible areas: check the exact address', 'Income limits apply (up to 115% of area median for guaranteed loans)', 'Not available in most of Orange County, LA, or the Bay Area'],
    url: 'https://eligibility.sc.egov.usda.gov',
    check: (a, ctx) => {
      const r = [];
      if (ctx.isOC) r.push(no('Orange County is urban, so USDA loans almost never apply here.'));
      else if (ctx.region.mostlyRural) r.push(ok(`${ctx.region.name} has many USDA-eligible areas. Check your address.`));
      else r.push(maybe('Some outer areas of your county may qualify. Check the exact address.'));
      r.push(RANK[ctx.category.id] <= RANK.moderate ? ok('Your income is likely under the USDA limit.') : maybe('Your income may be over the USDA limit.'));
      r.push(...waitCheck(a, { bk: 3, fc: 3 }), ...historyFlags(a));
      return r;
    },
  },
  {
    id: 'cdfi',
    name: 'Mission lender (CDFI), community bank, or credit union portfolio loan',
    kind: 'Private lending',
    simple: 'Private, mission-driven lenders with more flexible rules for people banks often turn down.',
    pros: ['Flexible about thin credit, ITIN, or unusual income', 'Often include free coaching', 'Fair terms; many work with down payment programs'],
    cons: ['Limited money; may have a waitlist', 'Fewer loan choices'],
    url: 'https://www.cdfifund.gov/',
    check: (a, ctx) => {
      const r = [ok('Open to many kinds of borrowers.')];
      if (a.idType === 'itin') r.push(ok('Many CDFIs and community banks lend to ITIN borrowers.'));
      if (a.payType !== 'w2') r.push(ok('Can look at self-employed income more flexibly.'));
      if (ctx.isOC) r.push(maybe('Start with NeighborWorks Orange County (a CDFI) for coaching and referrals.'));
      r.push(...waitCheck(a, { bk: 2, fc: 3 }), ...historyFlags(a));
      return r;
    },
  },
  {
    id: 'bank-statement',
    name: 'Bank-statement loan (self-employed & gig workers)',
    kind: 'Private lending',
    simple: 'A private loan that proves your income with bank deposits instead of W-2s.',
    pros: ['Works when tax write-offs make your income look low', 'No W-2 or pay stubs needed'],
    cons: ['Often 10%+ down', 'Rate often 1–3 points higher', 'Can\'t combine with most assistance', 'Watch for prepayment penalties'],
    url: 'https://www.consumerfinance.gov/owning-a-home/',
    check: (a) => [
      a.payType === 'w2' ? no('Made for self-employed or gig income. With a W-2 job, standard loans are cheaper.') : ok('Your self-employed or gig income fits this kind of loan.'),
      creditCheck(a, 620, 'Most bank-statement lenders'),
      ...waitCheck(a, { bk: 2, fc: 3 }),
      ...historyFlags(a),
      maybe('Compare with a CDFI first: rates and terms vary a lot.'),
    ],
  },
  {
    id: 'itin',
    name: 'ITIN mortgage',
    kind: 'Private lending',
    simple: 'A home loan for people who file taxes with an ITIN instead of a Social Security number.',
    pros: ['A real path to owning without an SSN', 'Builds credit in your name'],
    cons: ['Often 10–20% down', 'Higher rate', 'Most public down payment programs not available'],
    url: 'https://www.hud.gov/findacounselor',
    check: (a) => [
      a.idType === 'itin' ? ok('You file taxes with an ITIN.') : no('For ITIN filers. With an SSN, standard loans are usually cheaper.'),
      maybe('Lenders usually want 2 years of tax returns filed with your ITIN.'),
      ...waitCheck(a, { bk: 2, fc: 3 }),
      ...historyFlags(a),
    ],
  },
  {
    id: 'family-help',
    name: 'Family gift or family loan',
    kind: 'Private lending',
    simple: 'Relatives give or lend part of the down payment, with the right paperwork.',
    pros: ['Cheapest money there is', 'Gifts count for FHA, conventional, and many programs', 'Flexible'],
    cons: ['A loan counts as debt in your DTI', 'Needs a gift letter or promissory note', 'Can strain relationships'],
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes',
    check: (a) => [
      a.familyHelp ? ok('You said family may be able to help.') : no('Only if family is able and willing to help.'),
      ok('Get a signed gift letter, or a written note for a loan (charge at least the IRS "AFR" rate).'),
    ],
  },
  {
    id: 'seller-finance',
    name: 'Seller financing ("owner will carry")',
    kind: 'Private lending',
    simple: 'The seller acts as your bank, and you pay them monthly.',
    pros: ['Flexible approval', 'Terms are negotiable', 'Can close fast'],
    cons: ['Often a big "balloon" payment in 5–10 years', 'Rate may be high', 'Needs an attorney, escrow, and title insurance'],
    url: 'https://www.consumerfinance.gov/owning-a-home/',
    check: (a) => [
      a.sellerOpen ? maybe('Possible, but high risk. Use a real estate attorney and licensed escrow.') : no('Only if you find a willing seller, and want to take on the risk.'),
      maybe('Make sure the deed is in your name at closing, and plan how you\'ll refinance before any balloon.'),
    ],
  },
  {
    id: 'disability',
    name: 'Disability path: income, savings, and accessible-home help',
    kind: 'Special program',
    simple: 'Benefits like SSI and SSDI can count as income, and there are programs to save and to make a home accessible.',
    pros: [
      'SSDI, SSI, and VA disability income count for a mortgage, and non-taxable income can be "grossed up" (often by 25%)',
      'CalABLE accounts let you save for a home without losing SSI or Medi-Cal (rules apply)',
      'FHA 203(k) loans can include accessibility renovations in one mortgage',
      'Section 8 homeownership has special rules for families with a disability',
      'Veterans: VA funding fee waived for service-connected disability; Specially Adapted Housing grants',
      'Habitat Home Preservation makes accessibility repairs for owners',
    ],
    cons: ['Benefit letters must show income will continue (usually 3+ years)', 'ABLE money used for housing has SSI timing rules', 'Accessible homes are scarce, so start early'],
    url: 'https://www.calable.ca.gov/',
    check: (a) => [
      a.disability ? ok('Someone in your home has a disability. These tools are made for you.') : no('For households where someone has a disability.'),
      a.disability ? maybe('Ask your lender to "gross up" non-taxable benefit income and to count all benefit letters.') : ok(''),
      ...(a.disability && a.groups.includes('veteran') ? [ok('As a veteran with a disability, ask about the VA funding fee waiver and Specially Adapted Housing grants.')] : []),
    ].filter((r) => r.text),
  },
  {
    id: 'dream',
    name: 'California Dream For All (next round)',
    kind: 'Get ready first',
    simple: 'Big state help for first-generation buyers. Closed now, so get ready for the next lottery.',
    pros: ['Up to 20% of the price (max $150,000)', 'No monthly payment on it'],
    cons: ['Closed in 2026; next round not announced', 'Lottery', 'When you sell, you share part of the gain with the state'],
    url: 'https://www.calhfa.ca.gov/dream/',
    check: (a) => [
      a.parentsOwned ? no('At least one buyer must be first-generation (parents did not own).') : ok('You may be a first-generation buyer.'),
      firstTime(a),
      maybe('Closed right now. Sign up for CalHFA alerts.'),
    ],
  },
];

/**
 * Up-front cash, start tags, and a first step for each plan.
 * tags: 'zeroDown' ($0 or near-$0 of your own for the down payment),
 *       'job' (based on your work), 'org' (through a group you join or belong to).
 */
export const PLAN_META = {
  'credit-first': { down: 'No money needed to start', tags: [], firstStep: 'Pull your free credit reports at annualcreditreport.com and book a free HUD counselor.' },
  habitat: { down: '1–5% down + closing costs', tags: ['org'], firstStep: 'Sign up for a free online orientation at habitatoc.org.' },
  'fha-myhome': { down: '$0 of your own for the down payment (MyHome pays 3.5%)', tags: ['zeroDown'], firstStep: 'Ask a CalHFA-approved lender for a pre-approval with MyHome.' },
  'zero-stack': { down: '$0 down payment; little cash for closing', tags: ['zeroDown'], firstStep: 'Take the homebuyer class, then ask a CalHFA lender: "Can I do MyHome + ZIP?"' },
  homeready: { down: '3%, or $0 of your own with MyHome', tags: ['zeroDown'], firstStep: 'Ask a lender for a HomeReady or Home Possible quote plus MyHome.' },
  'city-loan': { down: '1–3% of the price from you', tags: [], firstStep: 'Call your city housing office and ask to join the interest list.' },
  va: { down: '$0', tags: ['zeroDown', 'job', 'org'], firstStep: 'Get your Certificate of Eligibility (COE) at va.gov.' },
  'ocscu-zero': { down: '$0', tags: ['zeroDown', 'org'], firstStep: 'Call Orange County\'s Credit Union and ask how to join and about Zero Down.' },
  schoolsfirst: { down: '3% (at least 1% yours); $7,500 grant helps', tags: ['job', 'org'], firstStep: 'Join SchoolsFirst (if you aren\'t a member) and ask about the School Employee Mortgage Grant.' },
  'teacher-boost': { down: 'Doesn\'t change the down payment; raises what you qualify for', tags: ['job'], firstStep: 'Log in at studentaid.gov, check your forgiveness progress, and use the Loan Simulator for a lower payment.' },
  ffcu: { down: '3%', tags: ['job', 'org'], firstStep: 'Call Firefighters First Credit Union about the first-time buyer loan.' },
  gsfa: { down: 'Help up to ~5.5% can cover the down payment', tags: ['zeroDown', 'job'], firstStep: 'Find a GSFA-approved lender and ask about Platinum "Select".' },
  gnnd: { down: '$100 with an FHA loan', tags: ['zeroDown', 'job'], firstStep: 'Check hudhomestore.gov for "Good Neighbor Next Door" listings.' },
  uci: { down: 'Varies by home', tags: ['job', 'org'], firstStep: 'Call ICHA at 949-824-7345 to join the waitlist.' },
  section184: { down: 'Low (ask the lender)', tags: ['org'], firstStep: 'Find a HUD-approved Section 184 lender at hud.gov/section184.' },
  voucher: { down: 'Varies', tags: ['org'], firstStep: 'Call OC Housing Authority (714-480-2973) about the homeownership option.' },
  usda: { down: '$0', tags: ['zeroDown'], firstStep: 'Check your address at eligibility.sc.egov.usda.gov, then ask a USDA-approved lender.' },
  cdfi: { down: 'Varies; often works with down payment help', tags: ['private', 'org'], firstStep: 'Ask NeighborWorks OC or a HUD counselor for a CDFI or community-bank referral.' },
  'bank-statement': { down: 'Often 10%+', tags: ['private'], firstStep: 'Gather 12–24 months of business and personal bank statements, then get 3 quotes.' },
  itin: { down: 'Often 10–20%', tags: ['private'], firstStep: 'Gather 2 years of ITIN tax returns and ask a CDFI or community bank about ITIN loans.' },
  'family-help': { down: 'Covers what family gives', tags: ['private', 'zeroDown'], firstStep: 'Ask your lender for their gift-letter form before any money moves.' },
  'seller-finance': { down: 'Negotiated', tags: ['private'], firstStep: 'Talk to a HUD counselor and a real estate attorney before you sign anything.' },
  disability: { down: 'Same as your loan; benefits help you qualify', tags: ['org'], firstStep: 'Gather your benefit award letters, and open a CalABLE account if you receive SSI.' },
  dream: { down: 'Covers up to 20% when open', tags: ['zeroDown'], firstStep: 'Sign up for CalHFA email alerts so you hear when the next round opens.' },
};

export const START_FILTERS = [
  { id: 'all', label: 'All plans' },
  { id: 'zeroDown', label: '💵 $0 or almost $0 down' },
  { id: 'job', label: '🧑‍🚒 Based on my job' },
  { id: 'org', label: '🤝 Through a group I belong to' },
  { id: 'private', label: '🏦 Private lending' },
];

/** Government-backed and agency loans that generally require a Social Security number. */
const NEEDS_SSN = ['fha-myhome', 'zero-stack', 'homeready', 'va', 'gsfa', 'usda', 'dream'];

/** Run every plan's rules and sort: good fits first, then maybes, then not-yets. */
export function evaluatePlans(a) {
  const county = a.county || 'Orange';
  const category = getIncomeCategory(a.income, a.householdSize, county);
  const monthlyIncome = a.income / 12 || 1;
  const ctx = {
    county,
    isOC: county === 'Orange',
    region: regionOf(county),
    category,
    monthlyIncome,
    debtRatio: a.monthlyDebts / monthlyIncome,
    savingsPct: (a.savings / 400000) * 100, // vs a ~$400K below-market home
  };
  const order = { good: 0, maybe: 1, notYet: 2 };
  const results = PLANS.map((plan) => {
    const reasons = plan.check(a, ctx);
    if (a.idType === 'itin' && NEEDS_SSN.includes(plan.id)) reasons.push(no('Usually requires a Social Security number. See ITIN and CDFI options.'));
    if (a.idType === 'itin' && plan.id === 'habitat' && ctx.isOC) reasons.push(no('Habitat OC requires US citizenship or permanent residency.'));
    let fit = 'good';
    if (reasons.some((r) => r.level === 'no')) fit = 'notYet';
    else if (reasons.some((r) => r.level === 'maybe')) fit = 'maybe';
    return { ...plan, ...PLAN_META[plan.id], reasons, fit };
  })
    // "credit-first" with only a "no" means not needed: hide it
    .filter((p) => !(p.id === 'credit-first' && p.fit === 'notYet'));
  results.sort((x, y) => order[x.fit] - order[y.fit]);
  return { ctx, results };
}

/** Other people and groups who can help fund or prepare, based on answers. */
export function otherHelpers(a) {
  const list = [
    (a.county || 'Orange') === 'Orange'
      ? { name: 'NeighborWorks Orange County', what: 'Free homebuyer class and coaching (required by most programs).', url: 'https://www.ehomeamerica.org/nwoc' }
      : { name: 'A HUD-approved housing counselor near you', what: 'Free homebuyer class and coaching (required by most programs).', url: 'https://www.hud.gov/findacounselor' },
    (a.county || 'Orange') === 'Orange'
      ? { name: 'OC Mortgage Credit Certificate', what: 'Money back on your taxes every year for part of your interest.', url: 'https://ocgov.com/residents/mortgage-credit-certificate-program' }
      : { name: `Mortgage Credit Certificate for ${a.county} County`, what: 'Many counties offer an MCC (a yearly tax credit on part of your interest). Ask your county housing department or a CalHFA lender.', url: 'https://www.calhfa.ca.gov/homebuyer/programs/index.htm' },
    ...((a.county || 'Orange') === 'Orange' ? [] : [{ name: 'Your local Habitat for Humanity', what: 'Find the affiliate that serves your county.', url: 'https://www.habitat.org/local/affiliate' }]),
    { name: 'FHLBank SF WISH grant', what: 'A matching grant through participating banks. Ask your lender if they offer WISH.', url: 'https://fhlbsf.com/products/community-programs-grants/wish' },
  ];
  if (has(a, 'otherCU') || has(a, 'ocscu')) list.push({ name: 'Your credit union', what: 'Ask about first-time buyer loans, low-down options, and member grants. Orange County\'s CU advertises 0% and 3% down.', url: 'https://orangecountyscu.org/products/home-loans/zero-down-home-loan' });
  if (has(a, 'union')) list.push({ name: 'Your labor union', what: 'Ask about member mortgage discounts or hardship help. We could not confirm a current union homebuyer program.', url: 'https://www.hud.gov/findacounselor' });
  if (has(a, 'uci')) list.push({ name: 'UC Irvine campus housing (ICHA)', what: 'Below-market for-sale homes for UCI employees. Join the waitlist.', url: 'https://icha.uci.edu/for-sale-housing/' });
  if (a.occupation !== 'any') list.push({ name: 'Your employer\'s HR office', what: 'Ask: "Do we offer any home-buying benefit, loan, or partnership?" Benefits change often.', url: null });
  if (['firefighter', 'police', 'healthcare', 'teacher'].includes(a.occupation)) list.push({ name: 'Homes for Heroes (private)', what: 'A rebate after closing from agent and lender fees. Not a grant. Compare before you sign.', url: 'https://www.homesforheroes.com' });
  return list;
}

/** Short money lessons that fit this person's answers. */
export function moneyLessons(a, ctx, ratio = 30) {
  const share = ratio / 100;
  const lessons = [];
  const band = CREDIT_BANDS.find((b) => b.id === a.credit);
  const pct = Math.round(ctx.debtRatio * 100);

  if (band.score === null) {
    lessons.push({ title: 'Know your credit score', plain: 'Get your free credit reports at annualcreditreport.com, and see your score free through many banks and card apps. Checking your own credit does not lower it.', eli5: 'Your credit score is a report card for paying bills. Looking at your own report card is free and does not hurt it.' });
  } else if (band.score < 640) {
    lessons.push({ title: 'Raise your score', plain: 'Pay every bill on time (that is about 35% of your score). Keep each card under 30% of its limit, ideally under 10%. Don\'t open new cards right before you apply. Dispute errors on your report.', eli5: 'Pay on time, every time. Don\'t fill your credit cards close to the top. Small steps raise your grade.' });
  } else {
    lessons.push({ title: 'Protect your good credit', plain: 'Don\'t open new credit, finance a car, or co-sign while you shop for a home. Lenders re-check your credit before closing.', eli5: 'Your grade is good! Don\'t borrow anything new until you get your house keys.' });
  }

  lessons.push({
    title: `Your debt-to-income: ${pct}%`,
    plain: `You spend about ${pct}% of your monthly income on debt payments. Lenders usually want all debts, including the new house payment, under about 43–50%. Every $100 of monthly debt you pay off lets you borrow roughly $14,000 more.`,
    eli5: `Out of every $100 you earn, about $${pct} already goes to paying old bills. The fewer old bills, the bigger the house helper can be.`,
  });

  lessons.push({
    title: 'The 30–35% rule',
    plain: `A comfortable housing payment is 30–35% of your gross income. At the ${ratio}% you chose, that is about $${Math.round(ctx.monthlyIncome * share).toLocaleString()} a month, including taxes and insurance.`,
    eli5: `Try to spend no more than $${ratio} of every $100 on your home. For you, that's about $${Math.round(ctx.monthlyIncome * share).toLocaleString()} each month.`,
  });

  if (a.savings < 3 * ctx.monthlyIncome * share) {
    lessons.push({ title: 'Build a cushion', plain: 'Aim for at least 3 months of housing payments saved after you buy, for repairs and emergencies. Automate a small transfer every payday into a separate account.', eli5: 'Keep a rainy-day jar. Houses sometimes break, and the jar keeps you safe.' });
  }

  if (a.occupation === 'teacher') {
    lessons.push({ title: 'Teacher tip: your student loans and your mortgage', plain: 'Lenders count your monthly student loan payment as debt. On an income-driven plan, that payment can be much smaller, and lenders use it. Teacher Loan Forgiveness and Public Service Loan Forgiveness can erase balances over time. Bring your teaching contract to the lender: they count your yearly salary even if you\'re paid over 10 months. Keep summer savings so payments never slip.', eli5: 'If you pay back school loans, a smaller monthly school-loan bill means the bank lets you borrow more for a house. Teachers can even get some school loans erased.' });
  }
  if (a.payType !== 'w2' || a.idType === 'itin' || a.sellerOpen) {
    lessons.push({ title: 'Private loans: check before you sign', plain: 'Private and non-QM loans can be fair, or predatory. Look up every lender on NMLS Consumer Access and the California DFPI. Ask in writing about balloon payments, prepayment penalties, and rate changes, and have a HUD counselor review the Loan Estimate.', eli5: 'Some private lenders are great and some are tricky. Check that they have a license, and ask a free helper to read the papers with you.' });
  }
  lessons.push({ title: 'Spot the scams', plain: 'Real assistance programs never charge an upfront fee to apply. Never wire money for closing without calling your escrow officer on a number you looked up yourself.', eli5: 'If someone wants money to give you "free money," it\'s a trick. Always double-check by phone.' });
  return lessons;
}
