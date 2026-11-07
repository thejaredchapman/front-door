/**
 * Builds a personal home-readiness report from the "Find my plan" answers.
 * Scores and targets are simple, transparent rules of thumb for coaching, not lending decisions.
 */
import { CREDIT_BANDS, evaluatePlans, moneyLessons, otherHelpers } from '../data/plans';
import { LOANS, loanFit, loanCost } from '../data/loanMatrix';
import { getPercentOfAmi } from '../data/incomeLimits';
import { buildSteps, schedule } from '../data/timeline';
import { priceFromMonthlyBudget } from './affordableCost';
import RATE_INFO from '../data/rate.json';

const RATE = RATE_INFO.value;

function affordable(monthlyIncome, debts, rate = RATE, ratio = 30) {
  const budget = Math.max(0, Math.min(monthlyIncome * (ratio / 100), monthlyIncome * 0.43 - debts));
  const { price } = priceFromMonthlyBudget({
    monthlyBudget: budget, annualRate: rate, downPaymentPercent: 3.5, propertyTaxRate: 1.1, annualInsurance: 1800, annualMiRate: 0.55,
  });
  return { budget, price };
}

const CREDIT_POINTS = { great: 25, good2: 22, good1: 18, fair2: 13, fair1: 9, poor: 4, unknown: 8, none: 5 };

export function buildReport(a, ratio = 30) {
  const { ctx, results } = evaluatePlans(a);
  const monthlyIncome = ctx.monthlyIncome;
  const band = CREDIT_BANDS.find((b) => b.id === a.credit);
  const dti = ctx.debtRatio;
  const now = affordable(monthlyIncome, a.monthlyDebts, RATE, ratio);

  // ── Readiness score (100 points, 5 pillars) ──
  let credit = CREDIT_POINTS[a.credit] ?? 8;
  if (a.latePayments) credit -= 5;
  if (a.collections) credit -= 4;
  if (a.bankruptcy === 'lt2' || a.foreclosure === 'lt3') credit = Math.min(credit, 3);
  credit = Math.max(0, credit);

  const debt = dti <= 0.1 ? 20 : dti <= 0.2 ? 15 : dti <= 0.3 ? 9 : dti <= 0.4 ? 4 : 0;

  const reserve = now.budget * 2;
  const savingsTarget = Math.round((now.price * 0.04 + reserve) / 100) * 100; // ~1% down + ~3% closing + 2 months' payments
  const savingsScore = savingsTarget > 0 ? Math.round(Math.min(1, a.savings / savingsTarget) * 20) : 0;

  const good = results.filter((r) => r.fit === 'good' && r.id !== 'credit-first');
  const maybes = results.filter((r) => r.fit === 'maybe');
  const programs = Math.min(20, good.length * 5 + maybes.length);

  let prep = 0;
  if (a.groups.includes('class')) prep += 7;
  if (a.groups.includes('habitat')) prep += 4;
  if (band.score !== null) prep += 4;
  prep = Math.min(15, prep);

  const pillars = [
    { id: 'credit', name: 'Credit', score: credit, max: 25 },
    { id: 'debt', name: 'Debt', score: debt, max: 20 },
    { id: 'savings', name: 'Savings', score: savingsScore, max: 20 },
    { id: 'programs', name: 'Programs that fit', score: programs, max: 20 },
    { id: 'prep', name: 'Preparation', score: prep, max: 15 },
  ];
  const total = pillars.reduce((s, p) => s + p.score, 0);
  const stage = total >= 80 ? 'Ready to talk to lenders'
    : total >= 60 ? 'Almost ready'
      : total >= 40 ? 'Getting ready'
        : 'Building the foundation';

  // ── What-if: buying power after improvements ──
  const targetDebts = monthlyIncome * 0.15;
  const debtCut = Math.max(0, a.monthlyDebts - targetDebts);
  const afterDebt = affordable(monthlyIncome, a.monthlyDebts - debtCut, RATE, ratio);
  const afterRate = affordable(monthlyIncome, a.monthlyDebts, RATE - 0.5, ratio);
  const monthlyToSave = Math.max(0, Math.ceil((savingsTarget - a.savings) / 12 / 10) * 10);

  // ── Strengths and things to work on ──
  const strengths = [];
  const gaps = [];
  if (band.score !== null && band.score >= 640) strengths.push(`Your credit (${band.label}) opens most loan types.`);
  else if (band.score !== null && band.score >= 580) gaps.push(`Your credit (${band.label}) works for FHA, but 640+ opens CalHFA and GSFA help.`);
  else gaps.push(band.score === null ? 'You don\'t know your credit score yet. That\'s step one.' : `Your credit (${band.label}) is below most loan minimums (580).`);
  if (a.latePayments) gaps.push('Late payments in the last year. 12 on-time months makes a big difference.');
  if (a.collections) gaps.push('An account in collections may need a payment plan before closing.');
  if (a.bankruptcy === 'lt2' || a.foreclosure === 'lt3') gaps.push('A recent bankruptcy or foreclosure means a waiting period for most loans.');
  if (dti <= 0.15) strengths.push(`Low debt: only ${Math.round(dti * 100)}% of your income goes to debt payments.`);
  else gaps.push(`${Math.round(dti * 100)}% of your income goes to debt. Under 15% gives you more buying power.`);
  if (a.savings >= savingsTarget) strengths.push('Your savings cover a typical down payment share, closing costs, and a cushion.');
  else gaps.push(`You have ${Math.round((a.savings / Math.max(1, savingsTarget)) * 100)}% of a suggested $${savingsTarget.toLocaleString()} savings goal.`);
  if (!a.ownedRecently) strengths.push('You count as a first-time buyer, which unlocks most assistance.');
  if (!a.parentsOwned && !a.ownedRecently) strengths.push('As a first-generation buyer, you may qualify for Dream For All when it reopens.');
  if (good.length) strengths.push(`${good.length} plan${good.length === 1 ? '' : 's'} already fit${good.length === 1 ? 's' : ''} you.`);
  if (a.groups.some((g) => ['schoolsfirst', 'ffcu', 'ocscu', 'otherCU', 'veteran', 'tribe', 'uci'].includes(g))) strengths.push('You belong to a group with its own home-buying help.');
  if (!a.groups.includes('class')) gaps.push('You haven\'t taken a homebuyer class yet. Most programs require it.');

  // ── Phased action plan ──
  const phases = [
    {
      title: 'Next 30 days',
      items: [
        band.score === null ? 'Get your free credit reports (annualcreditreport.com) and your score from your bank or card app.' : 'Pull your free credit reports and dispute any errors.',
        !a.groups.includes('class') && 'Sign up for and finish the 8-hour homebuyer class (online is fastest).',
        'Make a one-page budget: income, every bill, and what you can save each payday.',
        `Open a separate "home" savings account and automate about $${monthlyToSave.toLocaleString()} a month.`,
        'Send the provider emails from your plan (counselor first).',
        results.some((r) => r.id === 'habitat' && r.fit !== 'notYet') && !a.groups.includes('habitat') && 'Register for a Habitat orientation.',
      ].filter(Boolean),
    },
    {
      title: 'Next 90 days',
      items: [
        a.latePayments || a.collections ? 'Pay every bill on time. Set up autopay for minimums. Ask your counselor about collections.' : 'Keep every payment on time (autopay helps).',
        band.score !== null && band.score < 680 && 'Pay credit cards below 30% of their limits (under 10% is best) before the statement date.',
        debtCut > 0 && `Pay down about $${Math.round(debtCut).toLocaleString()}/month of debt payments (smallest balance first, or highest interest first).`,
        'Gather documents: 2 years of tax returns and W-2s, 30 days of pay stubs, 2 months of bank statements.',
        'Join interest and lottery lists for below-market homes and your city\'s program.',
        'Meet a counselor to review your credit and pick your 2–3 best plans.',
      ].filter(Boolean),
    },
    {
      title: 'In 6 months',
      items: [
        'Get 3 Loan Estimates from different lenders in the same week, and compare them in the quote comparer.',
        'Get pre-approved with a lender who handles CalHFA and your local programs.',
        `Reach at least half of your $${savingsTarget.toLocaleString()} savings goal.`,
        'Take the check-in again to see your new score and plans.',
      ],
    },
    {
      title: 'In 12 months',
      items: [
        `Reach your $${savingsTarget.toLocaleString()} savings goal (down payment share, closing costs, and 2 months of payments).`,
        a.bankruptcy === 'lt2' || a.foreclosure === 'lt3' ? 'Keep rebuilding credit until your waiting period ends, then get pre-approved.' : 'Be house-hunting or in a lottery, with your down payment help reserved.',
        'Keep an emergency fund after you buy. Homes need repairs.',
      ],
    },
  ];

  const loans = LOANS.map((l) => ({ ...l, fit: loanFit(l, a), cost: loanCost(l, Math.max(1, now.price), a) }))
    .filter((l) => l.fit.level !== 'no');
  const steps = buildSteps(a, results);
  const fast = schedule(steps, 'fast');

  return {
    ctx,
    results,
    pctAmi: getPercentOfAmi(a.income, a.householdSize, a.county),
    band,
    dti,
    now,
    pillars,
    total,
    stage,
    savingsTarget,
    monthlyToSave,
    whatIf: {
      debtCut,
      debtGain: afterDebt.price - now.price,
      rateGain: afterRate.price - now.price,
    },
    strengths,
    gaps,
    phases,
    plans: results.filter((r) => r.fit !== 'notYet'),
    loans,
    fastWeeks: fast.totalWeeks,
    helpers: otherHelpers(a),
    lessons: moneyLessons(a, ctx, ratio),
    ratio,
  };
}
