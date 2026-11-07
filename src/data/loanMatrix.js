/**
 * Interactive loan matrix: every major loan type × the features that matter.
 * Standard agency guidelines as of 2026; lenders can add stricter "overlays".
 * Items marked (verify) changed recently or come from secondary sources.
 */
import { CREDIT_BANDS, BANKRUPTCY_OPTIONS, FORECLOSURE_OPTIONS } from './plans';
import { getIncomeCategory } from './incomeLimits';
import { regionOf } from './caIncomeLimits';
import { calculateMonthlyPayment } from '../utils/amortization';
import RATE_INFO from './rate.json';

const RATE = RATE_INFO.value;
const RANK = { acutelyLow: 0, extremelyLow: 1, veryLow: 2, low: 3, moderate: 4, above: 5 };

export const MATRIX_COLUMNS = [
  { id: 'down', label: 'Down payment', plain: 'The share of the price you pay up front. Down payment help can cover some or all of it.', eli5: 'The first slice you pay for yourself.' },
  { id: 'credit', label: 'Credit score', plain: 'The usual minimum score. Many lenders ask for more than the program minimum; that is called an "overlay".', eli5: 'How good your money report card needs to be.' },
  { id: 'income', label: 'Income limit', plain: 'Some loans are only for people under a certain income, based on area median income (AMI).', eli5: 'Some helpers are only for families who earn less than a certain amount.' },
  { id: 'mi', label: 'Mortgage insurance', plain: 'Extra monthly cost that protects the lender when you put less than 20% down. Some loans let you remove it later; FHA usually doesn\'t.', eli5: 'A seatbelt fee for the bank because you started with a small slice.' },
  { id: 'wait', label: 'After bankruptcy / foreclosure', plain: 'How long you usually must wait after a bankruptcy (Chapter 7) or a foreclosure before you can get this loan.', eli5: 'How long you wait in the "time-out" chair after big money trouble.' },
  { id: 'dti', label: 'Debt limit (DTI)', plain: 'How much of your gross monthly income can go to all debts, including the new house payment. Strong files can go higher with automated approval.', eli5: 'How many of your paycheck cookies can go to bills.' },
  { id: 'limit', label: 'Max loan (OC 2026)', plain: 'The biggest loan the program allows in Orange County for a single-family home.', eli5: 'The biggest loan the bank can give with this kind of loan.' },
  { id: 'firstTime', label: 'First-time buyer only?', plain: 'Whether you must not have owned a home in the last 3 years.', eli5: 'Is this only for people buying their very first house?' },
  { id: 'assume', label: 'Assumable?', plain: 'Whether a future buyer can take over your loan at your rate. This can make your home easier to sell if rates rise, and lets YOU take over a seller\'s low-rate loan.', eli5: 'Can someone else take over this loan later, like passing down a bike?' },
];

/**
 * calc: inputs for the payment estimate.
 *  downPct: what the buyer brings (after built-in help); helpPct: deferred help on top (no monthly payment)
 *  miAnnual: monthly mortgage insurance as % of loan per year; upfrontFee: % added to the loan
 */
export const LOANS = [
  {
    id: 'fha', name: 'FHA', tagline: 'Easiest to qualify for',
    calc: { downPct: 3.5, helpPct: 0, miAnnual: 0.55, upfrontFee: 1.75 },
    rules: { minCredit: 580, bk: 2, fc: 3, firstTime: false, incomeMax: null, group: null, ssn: true },
    cells: {
      down: { v: '3.5% (10% if score 500–579)', d: 'With a 580+ score you need 3.5% down. Gifts and down payment help can pay it.' },
      credit: { v: '580+ (500 w/ 10% down)', d: 'FHA is the most forgiving on credit, but many lenders want 600–620+.' },
      income: { v: 'None', d: 'Anyone can use FHA, at any income.' },
      mi: { v: '1.75% upfront + ~0.55%/yr', d: 'Upfront premium is added to the loan. Annual MIP is usually for the life of the loan if you put less than 10% down; refinancing later is the usual way out. Rate is higher above $726,200.' },
      wait: { v: '2 yrs / 3 yrs', d: 'Can be shorter for documented hardship (job loss, illness) with re-established credit.' },
      dti: { v: '~43%, up to ~50%+', d: '31% housing / 43% total is the classic guide; automated approval often allows more with good compensating factors.' },
      limit: { v: '$1,249,125 (verify)', d: 'OC is a high-cost area, so FHA limits are near the national ceiling. Confirm at HUD\'s limit lookup.' },
      firstTime: { v: 'No', d: 'Repeat buyers can use FHA for a primary home.' },
      assume: { v: 'Yes ✓', d: 'A qualified buyer can take over an FHA loan, including its rate.' },
    },
  },
  {
    id: 'conv3', name: '3%-down conventional (HomeReady / Home Possible)', tagline: 'Cheaper insurance for lower incomes',
    calc: { downPct: 3, helpPct: 0, miAnnual: 0.45, upfrontFee: 0 },
    rules: { minCredit: 620, bk: 4, fc: 7, firstTime: false, incomeMax: 'low', group: null, ssn: true },
    cells: {
      down: { v: '3%', d: 'Gifts, grants, and Community Seconds (like city loans) can cover it.' },
      credit: { v: '620+', d: 'Pricing gets better at 680, 700, 720, 740+.' },
      income: { v: '≤ 80% AMI', d: 'Uses the area median income for where the home is.' },
      mi: { v: 'PMI, removable', d: 'Reduced coverage keeps it cheaper. It drops off automatically at 78% loan-to-value, or you can ask at 80%.' },
      wait: { v: '4 yrs / 7 yrs', d: 'Shorter (2 / 3 yrs) with documented extenuating circumstances.' },
      dti: { v: 'Up to ~50%', d: 'Through Fannie or Freddie automated underwriting.' },
      limit: { v: '$832,750; high-balance to $1,249,125', d: 'Above the baseline it\'s a "high-balance" loan with tighter rules. Verify current limits with FHFA.' },
      firstTime: { v: 'No (education required)', d: 'First-time buyers must take a homebuyer course.' },
      assume: { v: 'Usually no', d: 'Most conventional loans have a "due on sale" clause.' },
    },
  },
  {
    id: 'conv', name: 'Standard conventional (5–20% down)', tagline: 'Best for strong credit and savings',
    calc: { downPct: 5, helpPct: 0, miAnnual: 0.5, upfrontFee: 0 },
    rules: { minCredit: 620, bk: 4, fc: 7, firstTime: false, incomeMax: null, group: null, ssn: true },
    cells: {
      down: { v: '5–20%', d: 'Put down 20% and you skip mortgage insurance entirely.' },
      credit: { v: '620+ (740+ for best price)', d: 'Your score heavily affects the rate and PMI cost.' },
      income: { v: 'None', d: 'No income cap.' },
      mi: { v: 'PMI if < 20% down, removable', d: 'Cost depends on credit and down payment; it ends when you reach enough equity.' },
      wait: { v: '4 yrs / 7 yrs', d: 'Same as other conventional loans.' },
      dti: { v: 'Up to ~45–50%', d: 'Automated underwriting decides.' },
      limit: { v: '$832,750; high-balance to $1,249,125', d: 'Verify current limits with FHFA.' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Usually no', d: '' },
    },
  },
  {
    id: 'va', name: 'VA', tagline: '$0 down for people who served',
    calc: { downPct: 0, helpPct: 0, miAnnual: 0, upfrontFee: 2.15 },
    rules: { minCredit: 580, bk: 2, fc: 2, firstTime: false, incomeMax: null, group: 'veteran', ssn: true },
    cells: {
      down: { v: '$0', d: 'No down payment needed.' },
      credit: { v: 'No VA minimum (lenders ~580–620)', d: 'VA sets no minimum; lenders do.' },
      income: { v: 'None (residual income test)', d: 'VA checks that enough money is left each month after bills ("residual income").' },
      mi: { v: 'None monthly; funding fee (verify)', d: 'One-time funding fee (about 2.15% first use with < 5% down). Waived with a service-connected disability.' },
      wait: { v: '2 yrs / 2 yrs', d: 'Among the most forgiving after credit trouble.' },
      dti: { v: '~41% guide + residual income', d: 'Can go higher if residual income is strong.' },
      limit: { v: 'No limit with full entitlement', d: 'Partial entitlement has county limits.' },
      firstTime: { v: 'No', d: 'Can be reused.' },
      assume: { v: 'Yes ✓', d: 'Assumable by qualified buyers.' },
    },
  },
  {
    id: 'usda', name: 'USDA (rural)', tagline: '$0 down outside big cities',
    calc: { downPct: 0, helpPct: 0, miAnnual: 0.35, upfrontFee: 1 },
    rules: { minCredit: 640, bk: 3, fc: 3, firstTime: false, incomeMax: 'moderate', group: 'rural', ssn: true },
    cells: {
      down: { v: '$0', d: 'Only in USDA-eligible areas. Check the address.' },
      credit: { v: '~640 for automated approval', d: 'Lower scores need manual review.' },
      income: { v: '≤ 115% AMI', d: 'USDA uses its own income table by county and household size.' },
      mi: { v: '1% upfront + 0.35%/yr', d: 'Cheaper than FHA mortgage insurance.' },
      wait: { v: '3 yrs / 3 yrs', d: '' },
      dti: { v: '29% / 41%', d: 'Housing / total debt guides.' },
      limit: { v: 'Set by income, not a loan cap', d: 'How much you can borrow depends on what you can repay.' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Yes (with approval)', d: '' },
    },
  },
  {
    id: 'calhfa', name: 'CalHFA FHA + MyHome (+ ZIP)', tagline: 'State pays your down payment',
    calc: { downPct: 0, helpPct: 3.5, miAnnual: 0.55, upfrontFee: 1.75 },
    rules: { minCredit: 640, bk: 2, fc: 3, firstTime: true, incomeMax: null, group: null, ssn: true },
    cells: {
      down: { v: '$0 of your own', d: 'MyHome covers the 3.5% FHA down payment as a deferred junior loan. ZIP can add 0% help for closing costs.' },
      credit: { v: 'Higher than FHA (often 640–660, verify)', d: 'CalHFA sets its own minimum; ask a CalHFA lender.' },
      income: { v: 'CalHFA limit (OC ~$274K, verify)', d: 'Much higher than HUD/HCD limits.' },
      mi: { v: 'Same as FHA', d: '1.75% upfront plus annual MIP.' },
      wait: { v: 'FHA rules: 2 / 3 yrs', d: '' },
      dti: { v: 'Program cap (often ~45–50%)', d: 'CalHFA may cap DTI below FHA\'s maximum.' },
      limit: { v: 'FHA limit', d: '' },
      firstTime: { v: 'Yes', d: 'And homebuyer education is required.' },
      assume: { v: 'First loan: yes; MyHome: repaid', d: 'MyHome is repaid when you sell, refinance, or pay off.' },
    },
  },
  {
    id: 'section184', name: 'Section 184 (Native American)', tagline: 'Low down for tribal members',
    calc: { downPct: 2.25, helpPct: 0, miAnnual: 0.25, upfrontFee: 1 },
    rules: { minCredit: 0, bk: 2, fc: 3, firstTime: false, incomeMax: null, group: 'tribe' },
    cells: {
      down: { v: '~2.25% (verify)', d: 'Lower on very small loans.' },
      credit: { v: 'Flexible (no set minimum)', d: 'Manual review is common.' },
      income: { v: 'None', d: '' },
      mi: { v: '1% upfront + 0.25%/yr (verify)', d: 'Loan guarantee fee instead of PMI.' },
      wait: { v: 'Case by case', d: '' },
      dti: { v: '~41%', d: '' },
      limit: { v: 'FHA-like limits', d: '' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Yes (to eligible buyers)', d: '' },
    },
  },
  {
    id: 'cu', name: 'Credit-union no-PMI loan (SchoolsFirst, Firefighters First)', tagline: 'Members only, no mortgage insurance',
    calc: { downPct: 3, helpPct: 0, miAnnual: 0, upfrontFee: 0 },
    rules: { minCredit: 620, bk: 4, fc: 7, firstTime: true, incomeMax: null, group: 'cu' },
    cells: {
      down: { v: '3% (≥1% your own)', d: 'SchoolsFirst adds a $7,500 grant for eligible school employees.' },
      credit: { v: 'Set by the credit union', d: 'Ask; often 620–680+.' },
      income: { v: 'Grant: ≤ ~$150K (SchoolsFirst)', d: 'The loan itself has no income cap.' },
      mi: { v: 'None', d: 'The credit union keeps the loan and skips PMI.' },
      wait: { v: 'Lender policy', d: '' },
      dti: { v: 'Lender policy', d: '' },
      limit: { v: 'Up to $1,000,000 (SchoolsFirst)', d: '' },
      firstTime: { v: 'Yes for these programs', d: '' },
      assume: { v: 'Usually no', d: 'Firefighters First\'s option is an adjustable 7/1 rate.' },
    },
  },
  {
    id: 'habitat', name: 'Habitat for Humanity mortgage', tagline: 'Payment sized to your income',
    calc: { downPct: 3, helpPct: 0, miAnnual: 0, upfrontFee: 0, habitat: true },
    rules: { minCredit: 0, bk: 2, fc: 3, firstTime: false, incomeMax: 'moderate', group: null, residencyOC: true },
    cells: {
      down: { v: '1–5% + closing costs', d: 'Plus 200–500 sweat-equity hours.' },
      credit: { v: '"Good standing"', d: 'No high score needed, but no recent serious problems.' },
      income: { v: 'Very low to moderate (OC 4-person: $55,850–$166,300)', d: 'Each affiliate and project sets its range.' },
      mi: { v: 'None', d: 'Bank partners lend at discounted rates; a silent second protects you.' },
      wait: { v: 'Case by case', d: '' },
      dti: { v: 'Payment ≈ 30–35% of income', d: 'The whole point is a payment you can afford.' },
      limit: { v: 'Home sold at cost', d: '' },
      firstTime: { v: 'Housing need required', d: 'Overcrowded, unsafe, or paying over 30% of income.' },
      assume: { v: 'No; Habitat can buy back', d: 'Resale shares the gain so the home stays affordable.' },
    },
  },
  {
    id: 'jumbo', name: 'Jumbo (above $1,249,125 in OC)', tagline: 'For loans bigger than the standard limit',
    calc: { downPct: 20, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 0 },
    rules: { minCredit: 700, bk: 4, fc: 7, firstTime: false, incomeMax: null, group: 'jumbo', ssn: true },
    cells: {
      down: { v: 'Often 10–20%', d: '20% down avoids mortgage insurance.' },
      credit: { v: 'Often 700+', d: 'Stricter than regular loans.' },
      income: { v: 'None', d: 'But you need high income to qualify for the payment.' },
      mi: { v: 'None at 20% down', d: '' },
      wait: { v: 'Often 4–7 yrs', d: 'Lender policy; usually like conventional or stricter.' },
      dti: { v: '~43% or less', d: 'Plus 6–12 months of payments in savings.' },
      limit: { v: 'Above $1,249,125', d: 'Only needed when the loan is bigger than the OC limit.' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Usually no', d: '' },
    },
  },
  {
    id: 'chattel', name: 'Chattel (manufactured home in a park)', tagline: 'Lower price, higher rate, plus space rent',
    calc: { downPct: 10, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 2.5, term: 20 },
    rules: { minCredit: 580, bk: 2, fc: 3, firstTime: false, incomeMax: null, group: 'chattel' },
    cells: {
      down: { v: 'Often 5–10%', d: '' },
      credit: { v: 'Varies; ~580+ with FHA Title I', d: 'Credit unions and specialty lenders set their own minimums.' },
      income: { v: 'None', d: '' },
      mi: { v: 'Usually none', d: 'FHA Title I has an insurance premium.' },
      wait: { v: 'Lender policy', d: '' },
      dti: { v: 'Lender policy', d: 'Include monthly space rent in your budget.' },
      limit: { v: 'Home price only (land is rented)', d: 'If the home is on land you own and permanently attached, a regular mortgage may be cheaper.' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Sometimes', d: '' },
    },
  },
  {
    id: 'nonqm', name: 'Bank-statement / non-QM (private)', tagline: 'For self-employed and gig income',
    calc: { downPct: 10, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 1.5 },
    rules: { minCredit: 620, bk: 2, fc: 3, firstTime: false, incomeMax: null, group: 'selfEmployed' },
    cells: {
      down: { v: 'Often 10–20%', d: 'Bigger down payments usually get better rates.' },
      credit: { v: 'Often 620+', d: 'Set by each private lender.' },
      income: { v: 'None', d: 'Income is proven with 12–24 months of bank statements.' },
      mi: { v: 'Usually none', d: 'The higher rate and down payment take its place.' },
      wait: { v: 'Often 2 / 3 yrs or less', d: 'Some lend sooner after credit events, at a higher price.' },
      dti: { v: 'Up to ~50%', d: 'Lender policy.' },
      limit: { v: 'Lender policy (often high)', d: '' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Usually no', d: 'Ask about prepayment penalties.' },
    },
  },
  {
    id: 'itinloan', name: 'ITIN mortgage (private)', tagline: 'No Social Security number needed',
    calc: { downPct: 15, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 1.5 },
    rules: { minCredit: 0, bk: 2, fc: 3, firstTime: false, incomeMax: null, group: 'itin' },
    cells: {
      down: { v: 'Often 10–20%', d: 'Some CDFIs and credit unions go lower.' },
      credit: { v: 'Flexible; alternative credit OK', d: 'Rent, utility, and phone payment history can count.' },
      income: { v: 'None', d: '2 years of ITIN tax returns are typical.' },
      mi: { v: 'Usually none', d: '' },
      wait: { v: 'Lender policy', d: '' },
      dti: { v: 'Lender policy', d: '' },
      limit: { v: 'Lender policy', d: '' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Usually no', d: '' },
    },
  },
  {
    id: 'sellerfin', name: 'Seller financing (private)', tagline: 'The seller is your bank',
    calc: { downPct: 10, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 0.5 },
    rules: { minCredit: 0, bk: 0, fc: 0, firstTime: false, incomeMax: null, group: 'seller' },
    cells: {
      down: { v: 'Negotiated (often 10%+)', d: '' },
      credit: { v: 'Seller decides', d: '' },
      income: { v: 'None', d: '' },
      mi: { v: 'None', d: '' },
      wait: { v: 'Seller decides', d: '' },
      dti: { v: 'Seller decides', d: '' },
      limit: { v: 'Home price', d: '' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'Depends on contract', d: 'Watch for a balloon payment, usually due in 5–10 years.' },
    },
  },
  {
    id: 'hardmoney', name: 'Hard money (private): not for families', tagline: 'Short, expensive, risky',
    calc: { downPct: 25, helpPct: 0, miAnnual: 0, upfrontFee: 0, rateAdd: 4.5 },
    rules: { minCredit: 0, bk: 0, fc: 0, firstTime: false, incomeMax: null, group: 'never' },
    cells: {
      down: { v: '20–35% typical', d: '' },
      credit: { v: 'Little weight', d: 'Based on the property\'s value, not you.' },
      income: { v: 'Little weight', d: '' },
      mi: { v: 'None, but 2–5 points upfront', d: '' },
      wait: { v: 'None', d: '' },
      dti: { v: 'Not checked', d: 'That\'s exactly why it\'s risky for families.' },
      limit: { v: 'Based on property value', d: '' },
      firstTime: { v: 'No', d: '' },
      assume: { v: 'No; due in 1–3 years', d: 'Must be refinanced or paid off quickly.' },
    },
  },
];

/** Compare a loan's rules with the quiz answers. Returns { level, notes[] }. */
export function loanFit(loan, a) {
  const notes = [];
  let level = 'yes';
  const worse = (l) => { if (l === 'no' || (l === 'maybe' && level === 'yes')) level = l; };
  const r = loan.rules;
  const band = CREDIT_BANDS.find((b) => b.id === a.credit);
  if (r.minCredit) {
    if (band.score === null) { worse('maybe'); notes.push(`Usually needs ${r.minCredit}+; check your score.`); }
    else if (band.score < r.minCredit) { worse('no'); notes.push(`Usually needs ${r.minCredit}+.`); }
  }
  const bkYears = BANKRUPTCY_OPTIONS.find((x) => x.id === a.bankruptcy).years;
  const fcYears = FORECLOSURE_OPTIONS.find((x) => x.id === a.foreclosure).years;
  if (bkYears < r.bk) { worse('no'); notes.push(`Wait ${r.bk} yrs after bankruptcy.`); }
  if (fcYears < r.fc) { worse('no'); notes.push(`Wait ${r.fc} yrs after foreclosure.`); }
  if (a.latePayments || a.collections) { worse('maybe'); notes.push('Recent late payments or collections: lender will look closely.'); }
  if (r.firstTime && a.ownedRecently) { worse('no'); notes.push('First-time buyers only.'); }
  if (r.incomeMax) {
    const cat = getIncomeCategory(a.income, a.householdSize, a.county);
    if (RANK[cat.id] > RANK[r.incomeMax]) { worse('no'); notes.push('Income is over the limit.'); }
  }
  if (r.group === 'veteran' && !a.groups.includes('veteran')) { worse('no'); notes.push('Veterans/service members.'); }
  if (r.group === 'tribe' && !a.groups.includes('tribe')) { worse('no'); notes.push('Tribal members.'); }
  if (r.group === 'cu' && !(a.groups.some((g) => ['schoolsfirst', 'ffcu'].includes(g)) || ['teacher', 'firefighter'].includes(a.occupation))) {
    worse('no'); notes.push('School staff or firefighters (members).');
  }
  if (r.residencyOC && a.idType === 'itin' && (a.county || 'Orange') === 'Orange') { worse('no'); notes.push('Habitat OC requires US citizenship or permanent residency.'); }
  if (r.ssn && a.idType === 'itin') { worse('no'); notes.push('Usually requires a Social Security number.'); }
  if (r.group === 'selfEmployed' && a.payType === 'w2') { worse('no'); notes.push('Made for self-employed income; W-2 workers usually do better with standard loans.'); }
  if (r.group === 'itin' && a.idType !== 'itin') { worse('no'); notes.push('For ITIN filers.'); }
  if (r.group === 'seller') { worse(a.sellerOpen ? 'maybe' : 'no'); notes.push('High risk: attorney, escrow, and title insurance required.'); }
  if (r.group === 'never') { worse('no'); notes.push('Not recommended for a family home.'); }
  if (r.group === 'jumbo') { worse('maybe'); notes.push('Only needed if your loan is above $1,249,125 in OC.'); }
  if (r.group === 'chattel') { worse('maybe'); notes.push('For manufactured homes on rented land; add space rent to your budget.'); }
  if (r.group === 'rural') {
    if (a.county === 'Orange') { worse('no'); notes.push('Not available in Orange County.'); }
    else { worse('maybe'); notes.push(regionOf(a.county).mostlyRural ? 'Check the address for USDA eligibility.' : 'Only outer areas may qualify.'); }
  }
  return { level, notes };
}

/** Estimated cash needed and monthly cost for a loan at a given price. */
export function loanCost(loan, price, a) {
  const c = loan.calc;
  const own = (price * c.downPct) / 100;
  const help = (price * c.helpPct) / 100;
  const baseLoan = Math.max(0, price - own - help);
  const financed = baseLoan * (1 + c.upfrontFee / 100);
  const pi = calculateMonthlyPayment(financed, RATE + (c.rateAdd || 0), c.term || 30);
  const mi = (baseLoan * c.miAnnual) / 100 / 12;
  const tax = (price * 1.1) / 100 / 12;
  const ins = 1800 / 12;
  const closing = price * 0.03;
  const monthly = c.habitat ? (a.income / 12) * 0.3 : pi + mi + tax + ins;
  return { own, help, baseLoan, monthly, cash: own + closing, mi };
}

