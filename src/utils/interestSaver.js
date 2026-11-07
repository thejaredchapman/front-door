import { calculateMonthlyPayment } from './amortization';

/**
 * Simulate a fixed-rate loan with optional extra principal.
 * - extraMonthly: added every month
 * - extraYearly: added once a year in `yearlyMonth` (1–12, e.g. 4 = April tax refund)
 * - lumpSum: one-time payment at month `lumpMonth`
 * - biweekly: half-payments every two weeks = 13 full payments a year,
 *   modeled as an extra 1/12 of a payment each month
 * Returns months to payoff, total interest, and the balance at the end of each year.
 */
export function simulate({ principal, annualRate, termYears, extraMonthly = 0, extraYearly = 0, yearlyMonth = 4, lumpSum = 0, lumpMonth = 12, biweekly = false }) {
  const r = annualRate / 100 / 12;
  const base = calculateMonthlyPayment(principal, annualRate, termYears);
  const maxMonths = termYears * 12;
  let balance = principal;
  let interest = 0;
  let month = 0;
  const yearly = [principal];

  while (balance > 0.005 && month < maxMonths + 1) {
    month += 1;
    const i = balance * r;
    interest += i;
    let pay = base + extraMonthly + (biweekly ? base / 12 : 0);
    if (extraYearly && month % 12 === yearlyMonth % 12) pay += extraYearly;
    if (lumpSum && month === lumpMonth) pay += lumpSum;
    balance = Math.max(0, balance + i - pay);
    if (month % 12 === 0) yearly.push(balance);
  }
  if (month % 12 !== 0) yearly.push(0);
  return { months: month, interest, payment: base, yearly };
}

export function compareTerm(principal, annualRate, termYears) {
  const pay = calculateMonthlyPayment(principal, annualRate, termYears);
  return { termYears, payment: pay, interest: pay * termYears * 12 - principal };
}
