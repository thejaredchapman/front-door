/**
 * "Five buyers, one market": illustrative Orange County households (not real people).
 * Dollar results are computed in the component from these inputs, the current rate (rate.json),
 * and 2026 HCD income limits. Median home price: Habitat OC 2025 Impact Report ("more than $1.3 million").
 */
export const OC_MEDIAN_PRICE = 1300000;
export const OC_LOAN_LIMIT = 1249125;

export const BUYERS = [
  {
    id: 'low', tier: 'Low income', name: 'Maria', size: 3, income: 58000, savings: 3000, debts: 250,
    job: 'Home health aide, single mom of two',
    story: 'Maria works nights caring for seniors and rents a one-bedroom in Santa Ana for her family of three. She pays her bills on time and has saved a little, but every rent increase eats her savings.',
    eli5: 'Maria works hard caring for others. Rent takes most of her money, so saving is hard.',
    path: 'A market-price home isn\'t realistic yet, and that is not her fault. Her best paths are Habitat for Humanity OC (her income fits), below-market-rate home lotteries, and Santa Ana\'s My First Home loan, starting with a free homebuyer class.',
  },
  {
    id: 'middle', tier: 'Middle income', name: 'The Nguyens', size: 4, income: 125000, savings: 25000, debts: 650,
    job: 'Dental assistant and warehouse supervisor, two kids',
    story: 'Across most of America, the Nguyens would be solidly middle class. In Orange County, $125,000 for a family of four is officially "low income", because prices here are so high that the government adjusts the limits up.',
    eli5: 'In most places they would have plenty. Here, houses cost so much that the government calls them low income.',
    path: 'They qualify for the most help: Garden Grove\'s 0% loan (up to $110,000), CalHFA MyHome, WISH matching grants, and below-market townhomes. Stacked together, a condo or townhome is within reach.',
  },
  {
    id: 'upper', tier: 'Upper-middle income', name: 'Daniel & Priya', size: 3, income: 210000, savings: 90000, debts: 1100,
    job: 'Teacher and registered nurse, one kid',
    story: 'Two professionals serving their community, with good credit and real savings. They earn too much for most low-income programs, but not nearly enough for the median home.',
    eli5: 'They earn a lot, but not enough for most houses here, and too much for most helpers. They\'re stuck in the middle.',
    path: 'Their best moves: SchoolsFirst\'s no-PMI school-employee loan, GSFA Select for public servants (if under its income limit), a townhome or condo, a 2–4 unit "house hack" with FHA, or watching for Prop 37\'s new-home loans.',
  },
  {
    id: 'high', tier: 'High income', name: 'The Harrises', size: 4, income: 420000, savings: 320000, debts: 1800,
    job: 'Software engineer and attorney, two kids',
    story: 'The Harrises earn far more than most households. They can finally afford around the median price, but they still face bidding wars, high insurance costs, and a loan big enough to need jumbo rules.',
    eli5: 'They earn a lot of money, and even they have to stretch and compete to buy a typical house here.',
    path: 'A jumbo or high-balance loan with 20% down, a strong pre-approval, and patience. They don\'t need assistance, and shouldn\'t take it.',
  },
  {
    id: 'ultra', tier: 'Ultra-high income', name: 'Alex', size: 2, income: 1500000, savings: 2500000, debts: 3000,
    job: 'Startup executive',
    story: 'Alex can buy almost any home, often with cash. Cash offers win bidding wars and close fast, which is one reason prices stay high for everyone else.',
    eli5: 'Alex has so much money they can pay for a house all at once. That makes it harder for everyone else to win.',
    path: 'Alex\'s choices shape the market more than the market shapes Alex\'s. It\'s a reminder that high prices come from too few homes and lots of competition, not from anything working families did wrong.',
  },
];
