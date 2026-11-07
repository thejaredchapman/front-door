/**
 * Planning assumptions for the home goal, savings timeline, and program what-ifs.
 * These are budgeting rules of thumb, not underwriting. Program figures need periodic re-checks
 * against the official sources listed next to each constant.
 */
export const GOAL = {
  years: 30,
  taxPct: 1.1, // OC property tax ≈ 1.1% of price a year (Prop 13 base + local)
  closingPct: 3, // closing costs as cash at closing, % of price
  maintPct: 1, // upkeep, % of price a year
  miPct: 0.6, // mortgage insurance, % of the loan a year, when under 20% down
  backEnd: 36, // housing + other debts, % of gross income (CFPB budgeting guidance)
  priceCeiling: 10_000_000,
  horizonMonths: 120,
};

export const CHECKED_ON = '2026-11-07';
/** After this date, program "Potential match" falls back to "More details needed" and numeric what-ifs turn off. */
export const PROGRAM_CHECK_EXPIRES = '2027-02-05';

/** 2026 Orange County one-unit loan limits (FHFA 2026 list; SchoolsFirst also publishes both figures). */
export const LOAN_LIMITS_2026 = { conforming: 832750, highCost: 1249125 };

/** VA purchase funding fee with $0 down (va.gov funding-fee table). */
export const VA_FEE = { exempt: 0, first: 2.15, subsequent: 3.3 };

/** CalHFA MyHome: conventional option modeled at 3%; FHA option up to 3.5% shown for information only. */
export const MYHOME = { pct: 3, fhaPct: 3.5, minCredit: 680, ocIncomeLimit: 274000 };

export const TARGET_MONTHS = [3, 6, 12, 18, 24, 36];
export const DOWN_OPTIONS = [3, 3.5, 5, 10, 15, 20, 25, 40];
export const PROPERTY_TYPES = [
  { id: 'single', label: 'House (single-family)' },
  { id: 'condo', label: 'Condo or townhome' },
  { id: 'other', label: 'Something else / not sure' },
];
export const MILITARY_ROLES = [
  { id: 'unsure', label: 'Not sure' },
  { id: 'veteran', label: 'Veteran' },
  { id: 'active', label: 'Active duty' },
  { id: 'guard', label: 'Guard or Reserve' },
  { id: 'survivor', label: 'Surviving spouse' },
  { id: 'family', label: 'Family member of someone who served' },
];
export const VA_USE = [
  { id: 'unsure', label: 'Not sure' },
  { id: 'first', label: 'Never used it' },
  { id: 'subsequent', label: 'Used it before' },
];
export const YES_NO_UNSURE = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Not sure' },
];
