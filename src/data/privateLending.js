/**
 * Private lending: options outside government-backed (FHA/VA/USDA) and
 * Fannie/Freddie loans, with honest risks and red flags.
 * Rates, down payments and terms are TYPICAL RANGES that vary widely by lender and borrower;
 * they are not quotes. Always compare with a HUD counselor's help.
 */

export const PRIVATE_OPTIONS = [
  {
    id: 'cdfi',
    name: 'Mission lenders (CDFIs) and community banks',
    who: 'Anyone, especially people with thin credit, ITIN numbers, or unusual income.',
    typical: 'Rates near the market; flexible underwriting; often paired with coaching.',
    plain: 'Community Development Financial Institutions (CDFIs) are private, mission-driven lenders certified by the U.S. Treasury to serve people banks often miss. NeighborWorks Orange County is a CDFI. Community banks and credit unions can also keep loans "in portfolio" and set their own, more flexible rules.',
    eli5: 'Some lenders exist to help families banks usually say no to. They are like a friendly neighborhood bank with a mission.',
    pros: ['Flexible about credit history and income types', 'Often include free coaching', 'Fair, transparent terms'],
    cons: ['Limited money; may have waitlists', 'Fewer loan choices than big lenders'],
    risk: 'low',
    url: 'https://www.cdfifund.gov/',
  },
  {
    id: 'bank-statement',
    name: 'Bank-statement and other non-QM loans (self-employed, gig workers)',
    who: 'Self-employed people, gig drivers, small business owners, and workers paid in cash who show income through deposits instead of W-2s.',
    typical: 'Often 10%+ down and rates about 1–3 points above standard loans (varies).',
    plain: '"Non-QM" loans don\'t follow the standard federal "qualified mortgage" rules. Lenders use 12–24 months of bank statements instead of tax returns to prove income. Useful if your tax returns show low income because of write-offs.',
    eli5: 'If you work for yourself, a bank can look at the money going into your bank account instead of a paycheck stub.',
    pros: ['Works when tax returns understate income', 'No W-2 needed'],
    cons: ['Higher rate and bigger down payment', 'Can\'t combine with most down payment programs', 'May include prepayment penalties: ask!'],
    risk: 'medium',
    url: 'https://www.consumerfinance.gov/owning-a-home/',
  },
  {
    id: 'itin',
    name: 'ITIN mortgages',
    who: 'People who file taxes with an Individual Taxpayer Identification Number (ITIN) instead of a Social Security number.',
    typical: 'Often 10–20% down; rates usually above standard loans (varies).',
    plain: 'Most government-backed loans and down payment programs require a Social Security number. ITIN borrowers usually rely on private lenders, CDFIs, community banks, and some credit unions. Two years of tax filings with your ITIN and a steady work history help a lot.',
    eli5: 'If you pay taxes with a special tax number instead of a Social Security number, some lenders still can help you buy a home.',
    pros: ['A real path to ownership without an SSN', 'Builds credit history in your name'],
    cons: ['Bigger down payment and higher rate', 'Fewer lenders, so shop carefully', 'Most public assistance programs not available'],
    risk: 'medium',
    url: 'https://www.hud.gov/findacounselor',
  },
  {
    id: 'family',
    name: 'Family loans and gifts',
    who: 'Anyone with relatives willing and able to help.',
    typical: 'A gift has no repayment. A family loan should charge at least the IRS "applicable federal rate" (AFR) to avoid tax issues.',
    plain: 'A gift (with a signed gift letter) is the simplest: lenders accept it for the down payment. A family loan works too, but write a promissory note, consider recording it, and know the lender will count the monthly payment as debt. Giving more than the yearly gift-tax exclusion only means the giver files a form; tax is rarely owed.',
    eli5: 'Family can give you money for your house as a present, or lend it. A present needs a letter; a loan needs a written promise.',
    pros: ['Cheapest money available', 'Flexible terms', 'Gifts count toward FHA, conventional, and many programs'],
    cons: ['Can strain relationships if things go wrong', 'Loans count as debt in your DTI', 'Paperwork needed so the lender accepts it'],
    risk: 'low',
    url: 'https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-gift-taxes',
  },
  {
    id: 'seller',
    name: 'Seller financing ("owner will carry")',
    who: 'Buyers who find a seller who owns the home free and clear and is willing to act as the bank.',
    typical: 'Down payment and rate are negotiated; often a balloon payment in 5–10 years.',
    plain: 'The seller lends you the money and you pay them monthly. It can help when banks say no. But federal and state rules apply, many deals end with a large "balloon" payment, and you must refinance before it\'s due. Always use a licensed escrow, title insurance, and a real estate attorney, and make sure the deed is in YOUR name at closing.',
    eli5: 'The person selling the house lets you pay them a little each month instead of borrowing from a bank. You need a lawyer to make sure it\'s fair.',
    pros: ['Flexible approval', 'Can close faster', 'Terms are negotiable'],
    cons: ['Balloon payment risk', 'Rate may be high', 'If the seller still has a mortgage, their bank can call the loan due'],
    risk: 'high',
    url: 'https://www.consumerfinance.gov/owning-a-home/',
  },
  {
    id: 'rto',
    name: 'Rent-to-own and lease-option deals',
    who: 'Renters who want time to fix credit or save while living in the home.',
    typical: 'Upfront "option fee" (often several percent) plus above-market rent.',
    plain: 'You rent with the right to buy later. Part of the rent may count toward a down payment. The danger: if you miss a payment or can\'t get a mortgage in time, you can lose the option fee and every rent credit. Never sign a "contract for deed" or "land contract" where you don\'t get the title until the very end.',
    eli5: 'You rent a house that you might buy later. But if anything goes wrong, you can lose the extra money you paid.',
    pros: ['Live in the home while you get ready', 'Locks in a price'],
    cons: ['Lose the fee and credits if you don\'t buy', 'Often overpriced', 'Common in scams'],
    risk: 'high',
    url: 'https://www.consumerfinance.gov/',
  },
  {
    id: 'hard-money',
    name: 'Hard-money / private-money loans',
    who: 'Mostly investors and house flippers. Rarely right for a family home.',
    typical: 'Often 10–15% rates, 2–5 points upfront, 1–3 year terms (varies).',
    plain: 'Short-term loans from private investors based on the property\'s value, not your income. They are expensive and must be paid off or refinanced quickly. If a lender offers this for your family home, get a second opinion from a HUD counselor first.',
    eli5: 'A very expensive, very short loan meant for people who fix and sell houses, not for families.',
    pros: ['Very fast', 'Little paperwork'],
    cons: ['Very expensive', 'Due in 1–3 years', 'High risk of losing the home'],
    risk: 'high',
    url: 'https://www.hud.gov/findacounselor',
  },
];

export const RED_FLAGS = [
  'Pressure to sign today, or blank spaces in documents',
  'Upfront fees before you get a written Loan Estimate',
  'A balloon payment, prepayment penalty, or interest-only period you didn\'t ask for',
  'The loan amount or rate changes at closing without explanation',
  'Being told to lie about income, or to stop paying your current bills',
  'No license number, or a lender who won\'t give one',
  'Title stays with the seller until you finish paying (contract for deed)',
  'Wire instructions sent by email or text. Always call escrow at a number you looked up yourself',
];

export const CHECK_A_LENDER = [
  { name: 'NMLS Consumer Access', what: 'Every mortgage lender and loan officer must have an NMLS license number.', url: 'https://www.nmlsconsumeraccess.org/' },
  { name: 'California DFPI', what: 'Look up California-licensed lenders and file complaints.', url: 'https://dfpi.ca.gov/' },
  { name: 'California DRE', what: 'Check real estate brokers who arrange loans.', url: 'https://www.dre.ca.gov/' },
  { name: 'CFPB complaints', what: 'Search complaints and submit your own.', url: 'https://www.consumerfinance.gov/complaint/' },
];
