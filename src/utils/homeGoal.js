/**
 * Home goal math: what price fits both the monthly budget and the cash on hand, when the
 * cash will be there, and how VA or CalHFA MyHome would change that. All in the browser.
 * Rules of thumb only: not a loan decision, not a guaranteed closing date.
 */
import { GOAL, LOAN_LIMITS_2026, VA_FEE, MYHOME, PROGRAM_CHECK_EXPIRES } from '../data/goalRules';
import { CREDIT_BANDS } from '../data/plans';

export function pmt(principal, rate, years = GOAL.years) {
  if (principal <= 0) return 0;
  const n = years * 12;
  const r = rate / 1200;
  if (r <= 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

/** Monthly cost to own at a price. financedFeePct adds a fee to the loan (VA); noMi skips mortgage insurance. */
export function monthlyCost({ price, downPct, rate, insurance = 0, hoa = 0, financedFeePct = 0, noMi = false }) {
  const base = price * (1 - downPct / 100);
  const principal = base * (1 + financedFeePct / 100);
  const pi = pmt(principal, rate);
  const tax = (price * GOAL.taxPct) / 1200;
  const mi = !noMi && downPct < 20 ? (base * GOAL.miPct) / 1200 : 0;
  const maint = (price * GOAL.maintPct) / 1200;
  return { principal, pi, tax, insurance, hoa, mi, maint, total: pi + tax + insurance + hoa + mi + maint };
}

/** Largest monthly ownership cost that fits: housing share of income, total debt ≤ 36%, and the person's own comfort number. */
export function paymentCap({ income, debts, ratio = 30, comfort = -1 }) {
  const g = income / 12;
  const cap = Math.max(0, Math.min(g * (ratio / 100), g * (GOAL.backEnd / 100) - debts));
  return comfort >= 0 ? Math.min(cap, comfort) : cap;
}

export function cashNeeded({ price, downPct, reserve, assistance = 0 }) {
  const downCash = (price * downPct) / 100;
  const closing = (price * GOAL.closingPct) / 100;
  return Math.max(reserve, downCash + closing + reserve - assistance);
}

/** Biggest price where fits(price) is true, by bisection, rounded down to $1,000. */
function maxPrice(fits, ceiling = GOAL.priceCeiling) {
  if (!fits(0)) return 0;
  if (fits(ceiling)) return Math.floor(ceiling / 1000) * 1000;
  let lo = 0;
  let hi = ceiling;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) lo = mid; else hi = mid;
  }
  return Math.max(0, Math.floor(lo / 1000) * 1000);
}

const creditScore = (a) => CREDIT_BANDS.find((b) => b.id === a.credit)?.score ?? null;
export const firstTimeStatus = (a) => (a.ownedRecently === 'unsure' ? 'unsure' : a.ownedRecently ? 'no' : 'yes');
const isPrimaryType = (a) => ['single', 'condo'].includes(a.propertyType);
const checkExpired = (today) => today.toISOString().slice(0, 10) > PROGRAM_CHECK_EXPIRES;

/** Program status for the what-if models: potential | review | not-matched. */
export function programStatus(id, a, today = new Date()) {
  let status;
  if (id === 'va') {
    if (!a.groups.includes('veteran')) return 'not-matched';
    status = ['veteran', 'active', 'guard', 'survivor'].includes(a.militaryRole) && isPrimaryType(a) ? 'potential' : 'review';
  } else if (id === 'myhome') {
    const first = firstTimeStatus(a);
    if (first === 'no' || a.income > MYHOME.ocIncomeLimit || (a.county || 'Orange') !== 'Orange') return 'not-matched';
    status = first === 'unsure' || !isPrimaryType(a) || a.income <= 0 ? 'review' : 'potential';
  } else return 'not-matched';
  return status === 'potential' && checkExpired(today) ? 'review' : status;
}

/** The scenario terms for base / va / myhome. */
function scenario(id, a) {
  if (id === 'va') {
    const fee = a.vaExempt === 'yes' ? VA_FEE.exempt : a.vaUse === 'first' ? VA_FEE.first : VA_FEE.subsequent;
    return { downPct: 0, financedFeePct: fee, noMi: true, ceiling: GOAL.priceCeiling, assist: () => 0, feePct: fee };
  }
  if (id === 'myhome') {
    const d = a.downPct;
    const limit = d < 5 ? LOAN_LIMITS_2026.conforming : LOAN_LIMITS_2026.highCost;
    return {
      downPct: d, financedFeePct: 0, noMi: false,
      ceiling: Math.min(GOAL.priceCeiling, limit / (1 - d / 100)),
      assist: (price) => Math.min((price * MYHOME.pct) / 100, (price * (d + GOAL.closingPct)) / 100),
    };
  }
  return { downPct: a.downPct, financedFeePct: 0, noMi: false, ceiling: GOAL.priceCeiling, assist: () => 0 };
}

/** Can MyHome be modeled with numbers for this person? (Potential match, credit ≥ 680, 30 years, 3%+ down.) */
export function myHomeModelable(a, today) {
  const score = creditScore(a);
  return programStatus('myhome', a, today) === 'potential' && score !== null && score >= MYHOME.minCredit && a.downPct >= 3 && a.downPct < 100;
}
export function vaModelable(a, today) {
  return programStatus('va', a, today) === 'potential';
}

function costFor(id, a, price) {
  const s = scenario(id, a);
  const cost = monthlyCost({ price, downPct: s.downPct, rate: a.rate, insurance: a.insurance, hoa: a.hoa, financedFeePct: s.financedFeePct, noMi: s.noMi });
  const cash = cashNeeded({ price, downPct: s.downPct, reserve: a.reserve, assistance: s.assist(price) });
  return { cost, cash, assistance: s.assist(price), s };
}

const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export function addMonths(d, n) {
  const x = new Date(d);
  const day = x.getDate();
  x.setDate(1);
  x.setMonth(x.getMonth() + n);
  const last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate();
  x.setDate(Math.min(day, last));
  return x;
}

/** Highest price at the target date for a scenario (base | va | myhome). */
export function goalAt(id, a, cap, today = new Date()) {
  const months = a.targetMonths;
  const projected = a.savings + Math.max(0, a.monthlySaving) * months;
  const s = scenario(id, a);
  const price = maxPrice((p) => {
    const { cost, cash } = costFor(id, a, p);
    return cost.total <= cap + 0.01 && cash <= projected + 0.01 && p <= s.ceiling + 0.01;
  }, s.ceiling);
  return { price, projected, targetDate: addDays(today, Math.round(months * 30.4375)) };
}

/** When the cash will be there for a given price, and what's blocking if not. */
export function timelineAt(id, a, cap, price, today = new Date()) {
  const s = scenario(id, a);
  const { cost, cash, assistance } = costFor(id, a, price);
  const gap = Math.max(0, cash - a.savings);
  let status;
  let months = null;
  if (price <= 0) status = 'no-goal';
  else if (price > s.ceiling + 0.01) status = 'program-limit';
  else if (cost.total > cap + 0.01) status = 'over-budget';
  else if (gap > 0.01 && a.monthlySaving <= 0) status = 'no-saving';
  else {
    months = gap <= 0.01 ? 0 : Math.ceil((gap - 0.01) / a.monthlySaving);
    status = months > GOAL.horizonMonths ? 'beyond-horizon' : 'ready';
    if (status === 'beyond-horizon') months = null;
  }
  return { status, months, date: months === null ? null : addMonths(today, months), cost, cash, gap, assistance, feePct: s.feePct };
}

/** Everything the results page needs, in one call. */
export function buildGoal(a, ratio = 30, today = new Date()) {
  const cap = paymentCap({ income: a.income, debts: a.monthlyDebts, ratio, comfort: a.comfort });
  const base = goalAt('base', a, cap, today);
  const baseTimeline = timelineAt('base', a, cap, base.price, today);
  const programs = ['va', 'myhome'].map((id) => {
    const status = programStatus(id, a, today);
    const modelable = id === 'va' ? vaModelable(a, today) : myHomeModelable(a, today);
    if (!modelable) return { id, status, modelable };
    const goal = goalAt(id, a, cap, today);
    const tl = timelineAt(id, a, cap, base.price, today);
    const sooner = baseTimeline.months !== null && tl.months !== null ? baseTimeline.months - tl.months : null;
    return { id, status, modelable, goal, priceChange: goal.price - base.price, timeline: tl, monthsSooner: sooner };
  });
  return { cap, base, baseTimeline, programs };
}
