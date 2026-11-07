/**
 * Orange County 2026 State Income Limits.
 * Source: California HCD, "Revised 2026 State Income Limits" memo, June 23, 2026
 * (income-limits-2026.pdf, Orange County table). Household sizes 1–8.
 *
 * Note: In high-cost areas HUD caps/floors limits, so in Orange County the
 * "Low income" (80% AMI) limit is HIGHER than the "Median income" row.
 * Programs always use the table, never arithmetic, to decide eligibility.
 */
import { CA_INCOME_LIMITS_2026, FEATURED_COUNTY } from './caIncomeLimits';

export const OC_AREA_MEDIAN_INCOME = 138600; // 4-person household, 2026

export const OC_INCOME_LIMITS_2026 = {
  acutelyLow: [14550, 16650, 18700, 20800, 22450, 24150, 25800, 27450],
  extremelyLow: [39100, 44700, 50300, 55850, 60350, 64800, 69300, 73750],
  veryLow: [65150, 74450, 83750, 93050, 100500, 107950, 115400, 122850],
  low: [104200, 119100, 134000, 148850, 160800, 172700, 184600, 196500],
  median: [97000, 110900, 124750, 138600, 149700, 160800, 171850, 182950],
  moderate: [116400, 133050, 149650, 166300, 179600, 192900, 206200, 219500],
};

// Ordered from lowest to highest limit, used to find the first category a household fits.
export const INCOME_CATEGORIES = [
  {
    id: 'acutelyLow',
    label: 'Acutely low income',
    short: 'Acutely low',
    amiLabel: 'about 15% of AMI',
    plain: 'Households in this range usually need deep rental help first. Homeownership is a longer-term goal, but programs like Habitat for Humanity and counseling can start you on the path.',
    eli5: 'Right now money is very, very tight. The first step is a safe, steady place to live and a plan. Owning a home can still be a goal for later.',
  },
  {
    id: 'extremelyLow',
    label: 'Extremely low income',
    short: 'Extremely low',
    amiLabel: 'about 30% of AMI',
    plain: 'Habitat for Humanity of Orange County generally serves households starting around 30% of AMI. Section 8 voucher holders may be able to use a voucher toward a mortgage where the housing authority allows it.',
    eli5: 'Money is tight, but some helpers are made exactly for you. Habitat for Humanity helps families like yours build and buy a home.',
  },
  {
    id: 'veryLow',
    label: 'Very low income',
    short: 'Very low',
    amiLabel: 'about 50% of AMI',
    plain: 'You fit most down payment assistance programs and Habitat. A deed-restricted (below-market-rate) home is often the most realistic path in Orange County.',
    eli5: 'You can get a lot of help. Some homes are sold at a special lower price just for families in your group.',
  },
  {
    id: 'low',
    label: 'Low income',
    short: 'Low',
    amiLabel: 'up to 80% of AMI',
    plain: 'This is the sweet spot for most assistance: county and city silent-second loans, CalHFA programs, Fannie Mae HomeReady and Freddie Mac Home Possible, Habitat, and below-market-rate ownership units.',
    eli5: 'You are in the group that the most helpers are built for. Lots of programs can chip in for the down payment.',
  },
  {
    id: 'moderate',
    label: 'Moderate income',
    short: 'Moderate',
    amiLabel: 'up to 120% of AMI',
    plain: 'You are above most "low income" programs, but many state programs (like CalHFA) use higher limits, and moderate-income below-market-rate homes exist in several Orange County cities.',
    eli5: 'You earn a bit too much for some helpers, but not for all of them. Some state helpers still say yes.',
  },
  {
    id: 'above',
    label: 'Above moderate income',
    short: 'Above moderate',
    amiLabel: 'over 120% of AMI',
    plain: 'Most income-limited assistance will not apply, but CalHFA limits can be higher than these, and FHA, VA, and conventional 3%-down loans have no income cap.',
    eli5: 'You earn more than most helpers allow, but you can still borrow with a small down payment.',
  },
];

/**
 * Returns the lowest category whose limit the income does not exceed.
 * Because OC's "low" limit is above its "median", we skip "median" here
 * and compare against acutely low → extremely low → very low → low → moderate.
 */
export function limitsTable(county = FEATURED_COUNTY) {
  return CA_INCOME_LIMITS_2026[county] || OC_INCOME_LIMITS_2026;
}

export function getIncomeCategory(annualIncome, householdSize, county = FEATURED_COUNTY) {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  const order = ['acutelyLow', 'extremelyLow', 'veryLow', 'low', 'moderate'];
  const table = limitsTable(county);
  for (const id of order) {
    if (annualIncome <= table[id][idx]) {
      return INCOME_CATEGORIES.find((c) => c.id === id);
    }
  }
  return INCOME_CATEGORIES.find((c) => c.id === 'above');
}

export function getPercentOfAmi(annualIncome, householdSize, county = FEATURED_COUNTY) {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  const medianForSize = limitsTable(county).median[idx];
  return (annualIncome / medianForSize) * 100;
}

export function getLimitsForSize(householdSize, county = FEATURED_COUNTY) {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  const { ami: _ami, ...table } = limitsTable(county);
  return Object.fromEntries(
    Object.entries(table).map(([k, arr]) => [k, arr[idx]])
  );
}
