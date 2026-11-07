import { limitsTable } from '../data/incomeLimits';

/**
 * California Health & Safety Code §50052.5(b): "affordable housing cost" for
 * owner-occupied housing (assistance on or after Jan 1, 1991).
 *
 *   Extremely low: 30% × 30% of AMI (adjusted for household size)
 *   Very low:      30% × 50% of AMI
 *   Lower income:  30% × 70% of AMI
 *   Moderate:      35% × 110% of AMI
 *
 * Statute: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=50052.5
 * Caveats: (1) the statute adjusts AMI for the household size "appropriate for
 * the unit" (usually bedrooms + 1); we use the household size you enter.
 * (2) Housing cost includes utilities and maintenance (25 CCR §6920), so those
 * are subtracted before solving for a loan. Agencies may apply their own rules.
 */
export const STATUTE_TIERS = {
  extremelyLow: { label: 'Extremely low', costShare: 0.30, amiShare: 0.30 },
  veryLow: { label: 'Very low', costShare: 0.30, amiShare: 0.50 },
  low: { label: 'Lower income', costShare: 0.30, amiShare: 0.70 },
  moderate: { label: 'Moderate', costShare: 0.35, amiShare: 1.10 },
};

export function amiForHousehold(householdSize, county) {
  const idx = Math.min(Math.max(householdSize, 1), 8) - 1;
  return limitsTable(county).median[idx];
}

export function affordableMonthlyHousingCost(tierId, householdSize, county) {
  const tier = STATUTE_TIERS[tierId];
  if (!tier) return 0;
  return (tier.costShare * tier.amiShare * amiForHousehold(householdSize, county)) / 12;
}

/**
 * Solve for the highest price whose full monthly cost fits the budget.
 * monthly = P&I(loan) + price × taxRate/12 + insurance/12 + HOA + utilities + maintenance
 * loan = price × (1 − down%)
 */
export function priceFromMonthlyBudget({
  monthlyBudget,
  annualRate,
  termYears = 30,
  downPaymentPercent = 0,
  propertyTaxRate = 1.1,
  annualInsurance = 1800,
  monthlyHoa = 0,
  monthlyUtilities = 0,
  monthlyMaintenance = 0,
  annualMiRate = 0, // mortgage insurance as % of the loan per year (e.g. FHA 0.55)
}) {
  const fixed = annualInsurance / 12 + monthlyHoa + monthlyUtilities + monthlyMaintenance;
  const available = monthlyBudget - fixed;
  if (available <= 0) return { price: 0, loanAmount: 0, monthlyPI: 0, monthlyTax: 0, fixed };

  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const piPerLoanDollar = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const loanShare = 1 - downPaymentPercent / 100;
  const perPriceDollar = loanShare * (piPerLoanDollar + annualMiRate / 100 / 12) + propertyTaxRate / 100 / 12;
  const price = available / perPriceDollar;

  return {
    price,
    loanAmount: price * loanShare,
    monthlyPI: price * loanShare * piPerLoanDollar,
    monthlyTax: (price * propertyTaxRate) / 100 / 12,
    fixed,
  };
}
