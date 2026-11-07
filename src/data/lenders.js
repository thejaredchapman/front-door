/**
 * Where to get the loan: lenders serving Orange County, from docs/research/cheapest-lenders.json
 * (checked 2026-11-07). Published rates are "as low as" examples for strong credit; they rank lenders,
 * they are not quotes. HMDA = what Orange County borrowers actually paid on 2024 conventional 30-year
 * purchase loans (median "rate spread" vs. the market benchmark and median total loan costs).
 */

export const HMDA_SOURCE = {
  label: 'HMDA 2024, Orange County conventional 30-year purchase loans (FFIEC/CFPB Data Browser)',
  url: 'https://ffiec.cfpb.gov/data-browser/',
};

// Mainstream lenders open to typical buyers (private-wealth and builder lenders left out).
export const HMDA_OC_2024 = [
  { lender: 'Navy Federal Credit Union', n: 41, spread: -0.30, costs: 6260 },
  { lender: 'U.S. Bank', n: 759, spread: -0.15, costs: 7857 },
  { lender: 'SchoolsFirst FCU', n: 354, spread: -0.03, costs: 5698 },
  { lender: 'JPMorgan Chase', n: 346, spread: 0.02, costs: 7003 },
  { lender: 'Rocket Mortgage', n: 1170, spread: 0.13, costs: 8246 },
  { lender: 'United Wholesale Mortgage (broker channel)', n: 1450, spread: 0.19, costs: 11018 },
  { lender: 'Wescom Credit Union', n: 17, spread: 0.20, costs: 8214 },
  { lender: "Orange County's Credit Union", n: 16, spread: 0.21, costs: 6621 },
];

const SOCAL = ['Orange', 'Los Angeles', 'Riverside', 'San Bernardino', 'San Diego', 'Ventura', 'Imperial'];

export const LENDERS = [
  {
    id: 'schoolsfirst', name: 'SchoolsFirst Federal Credit Union', type: 'Credit union',
    who: 'Current and retired school employees and their families.',
    eligible: (a) => a.occupation === 'teacher' || a.groups.includes('schoolsfirst'),
    products: [
      { name: 'School Employee Special, no PMI, 3% down', rate: 7.125, apr: 7.19, points: 0 },
      { name: 'HomeAccess first-time buyer, 3% down (no income cap)', rate: 7.0, apr: 7.37, points: 0 },
      { name: 'FHA 30-year (620 credit score)', rate: 7.0, apr: 7.78, points: 0 },
    ],
    asOf: '2026-11-07',
    perks: 'No-PMI loan for school staff; posts each rate with +1, 0, and −1 point so you can compare points vs. credits.',
    worksWith: ['schoolsfirst'],
    hmda: 'SchoolsFirst FCU',
    url: 'https://schoolsfirstfcu.org/rates/mortgage-purchase',
  },
  {
    id: 'navy', name: 'Navy Federal Credit Union', type: 'Credit union',
    who: 'Military, veterans, Department of Defense civilians and contractors, and their families.',
    eligible: (a) => a.groups.includes('veteran'),
    products: [
      { name: 'Homebuyers Choice, 0% down (720 credit score)', rate: 7.375, apr: 7.713, points: 0.5 },
      { name: 'VA 30-year', rate: 6.0, apr: 6.48, points: 1.0 },
    ],
    asOf: '2026-11-07',
    perks: 'Lowest median rate spread among mainstream lenders in OC (2024). Homebuyers Choice has a 1% origination fee and a 1.75% funding fee.',
    worksWith: ['va'],
    hmda: 'Navy Federal Credit Union',
    url: 'https://www.navyfederal.org/loans-cards/mortgage/mortgage-rates.html',
  },
  {
    id: 'ffcu', name: 'Firefighters First Credit Union', type: 'Credit union',
    who: 'Firefighters and their families.',
    eligible: (a) => a.occupation === 'firefighter' || a.groups.includes('ffcu'),
    products: [{ name: '7/1 ARM first-time buyer, no PMI, 3% down (720+ score)', rate: 6.125, apr: 6.508, points: null }],
    asOf: 'undated page, read 2026-11-07',
    perks: 'No PMI with 3% down; debt-to-income up to 45%; 3 months of reserves. Adjustable after 7 years.',
    worksWith: [],
    url: 'https://www.firefightersfirstcu.org/Rates',
  },
  {
    id: 'occu', name: "Orange County's Credit Union", type: 'Credit union',
    who: 'People who live or work in Orange, Los Angeles, Riverside, or San Bernardino County.',
    eligible: (a) => ['Orange', 'Los Angeles', 'Riverside', 'San Bernardino'].includes(a.county),
    products: [{ name: '30-year fixed (example: 780 score, 60% loan-to-value)', rate: 6.875, apr: 7.063, points: 0.625 }],
    asOf: '2026-11-06',
    perks: 'Advertises a 0%-down ARM and no-closing-cost options.',
    worksWith: [],
    hmda: "Orange County's Credit Union",
    url: 'https://www.orangecountyscu.org/homeloans',
  },
  {
    id: 'golden1', name: 'Golden 1 Credit Union', type: 'Credit union',
    who: 'Anyone who lives or works in California.',
    eligible: (a) => Boolean(a.county),
    products: [],
    asOf: 'rate page did not load (2026-11-07)',
    perks: 'CalHFA-approved, so it can pair with MyHome, ZIP, and Dream For All. Reported first-time buyer closing credit of $2,500 or $5,000 for lower-income members (unverified).',
    worksWith: ['calhfa'],
    url: 'https://www.golden1.com/loans/home-loans/purchase',
  },
  {
    id: 'wescom', name: 'Wescom Credit Union', type: 'Credit union',
    who: 'People who live, work, worship, or attend school in Orange County and nearby counties.',
    eligible: (a) => SOCAL.includes(a.county),
    products: [],
    asOf: 'posted rates are a year old',
    perks: 'Advertises 0% and 3% down options with mortgage-insurance discounts.',
    worksWith: [],
    hmda: 'Wescom Credit Union',
    url: 'https://www.wescom.org/home-loans/mortgage',
  },
  {
    id: 'nwoc', name: 'NeighborWorks Orange County', type: 'Nonprofit lender & counselor',
    who: 'Income-qualified buyers; anyone can take the class.',
    eligible: (a) => a.county === 'Orange',
    products: [],
    asOf: 'read 2026-11-07',
    perks: 'Offers conventional, FHA, and CalHFA loans plus down payment help, the 8-hour HUD class ($30), and free counseling. A good first stop for ITIN or thin-credit buyers.',
    worksWith: ['calhfa', 'city'],
    url: 'https://www.nwoc.org/',
  },
  {
    id: 'usbank', name: 'U.S. Bank', type: 'Bank',
    who: 'Anyone; grants depend on income and the home\'s location.',
    eligible: () => true,
    products: [],
    asOf: '2026-11-07',
    perks: 'American Dream: help of the greater of $5,500 or 3%, up to $10,000, available in California.',
    worksWith: ['bank-grants'],
    hmda: 'U.S. Bank',
    url: 'https://www.usbank.com/home-loans/mortgage/american-dream-mortgage.html',
  },
  {
    id: 'chase', name: 'Chase', type: 'Bank',
    who: 'Anyone; grants only in select neighborhoods.',
    eligible: () => true,
    products: [],
    asOf: 'grant page dated 2026-04-27',
    perks: 'Chase Homebuyer Grant of $2,500 or $5,000 in select areas.',
    worksWith: ['bank-grants'],
    hmda: 'JPMorgan Chase',
    url: 'https://chase.com/personal/mortgage/education/financing-a-home/chase-homebuyer-grant',
  },
];

/** Which subsidies in someone's plan can be used with a given lender. */
// weight: how much a pairing is worth when ranking (members-only grants > state help > city loans > address-dependent bank grants)
const PAIRING = {
  schoolsfirst: { label: 'SchoolsFirst $7,500 grant', plans: ['schoolsfirst'], weight: 3 },
  va: { label: 'VA loan ($0 down)', plans: ['va'], weight: 3 },
  calhfa: { label: 'CalHFA MyHome / ZIP / Dream For All', plans: ['fha-myhome', 'zero-stack', 'dream'], weight: 2 },
  city: { label: 'City and county down payment loans', plans: ['city-loan'], weight: 1 },
  'bank-grants': { label: 'This bank\'s down payment grant (if the address qualifies)', plans: [], weight: 0.5 },
};

export function lendersFor(a, plans) {
  const open = new Set(plans.filter((p) => p.fit !== 'notYet').map((p) => p.id));
  return LENDERS.map((l) => {
    const matched = l.worksWith
      .map((k) => PAIRING[k])
      .filter((p) => p && (p.plans.length === 0 || p.plans.some((id) => open.has(id))));
    const hmda = HMDA_OC_2024.find((h) => h.lender === l.hmda) || null;
    const score = matched.reduce((n, p) => n + p.weight, 0);
    return { ...l, canJoin: l.eligible(a), pairs: matched.map((p) => p.label), score, hmda };
  }).sort((x, y) => (y.canJoin - x.canJoin) || (y.score - x.score) || ((x.hmda?.costs ?? 99999) - (y.hmda?.costs ?? 99999)));
}
