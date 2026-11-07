/**
 * Every kind of real-estate loan, grouped by what you're trying to do.
 * "Typical" terms are general 2026 market ranges for education, not quotes; they vary by lender and borrower.
 * Limits: 2026 conforming baseline $832,750; Orange County high-cost (FHA and conforming) $1,249,125.
 */
export const LOAN_TYPE_GROUPS = [
  { id: 'buy', title: 'Buying a home to live in', note: 'Start here if you want to own the home your family lives in.' },
  { id: 'own', title: 'Already own a home', note: 'Ways to use the value (equity) you\'ve built. Your home is the collateral, so borrow carefully.' },
  { id: 'invest', title: 'Investors and business owners', note: 'Not for buying your family home. Listed so you can tell them apart, and avoid being sold the wrong one.' },
];

export const LOAN_TYPES = [
  // ── Buy ─────────────────────────────────────────────────────────
  {
    id: 'chattel', group: 'buy', name: 'Chattel loan (manufactured / mobile home)',
    what: 'A loan for a manufactured home that is personal property: usually a home in a mobile home park where you rent the land (space).',
    who: 'Buyers of manufactured homes in parks, often one of the lowest-cost ways to own in Orange County.',
    typical: 'Usually several points higher than a mortgage, 5–10% down, terms of 15–25 years. If the home is on land you own and permanently attached, you can often get a regular mortgage (FHA, Fannie Mae MH Advantage, Freddie Mac CHOICEHome) instead, at a lower rate.',
    pros: ['Much lower purchase price than a house', 'Smaller loan and faster approval', 'FHA Title I and some credit unions offer manufactured-home loans'],
    cons: ['Higher interest rate than a mortgage', 'You still pay monthly space rent, which can rise', 'Homes can lose value; check the park\'s rules and rent history'],
    lowIncome: 'Can be a real path to ownership. Prop 1 (2026) includes CalHome money that can help with manufactured homes. Read the park lease and California\'s Mobilehome Residency Law protections first.',
    plain: 'Because the home sits on rented land, the loan is more like a car loan than a mortgage: higher rate, shorter term. Total cost (loan + space rent) is what matters.',
    eli5: 'A loan for a home that sits in a park. The home costs less, but you still pay rent for the ground.',
    url: 'https://www.hud.gov/program_offices/housing/title1',
  },
  {
    id: 'househack', group: 'buy', name: 'House hack: a 2–4 unit home with FHA',
    what: 'Buy a duplex, triplex, or fourplex, live in one unit, and rent the others.',
    who: 'Buyers who can manage being a landlord and want rent to help pay the mortgage.',
    typical: 'FHA allows 3.5% down on 2–4 units if you live there; lenders usually count about 75% of the expected rent as income. Loan limits are higher for more units.',
    pros: ['Tenants help pay your mortgage', 'Same low down payment as a single home', 'Builds wealth faster'],
    cons: ['You\'re a landlord: repairs, vacancies, and rules', 'Multi-unit homes are scarce and pricey in OC', 'Need reserves in case a unit sits empty'],
    lowIncome: 'This is the low-down-payment alternative to an investor "DSCR" loan, if you live in the property.',
    plain: 'Rent from the other units can count toward qualifying, so you may afford more than with a single-family home.',
    eli5: 'Buy a building with a few homes, live in one, and rent the others to help pay the loan.',
    url: 'https://www.hud.gov/buying/loans',
  },

  {
    id: 'jumbo', group: 'buy', name: 'Jumbo loan',
    what: 'A mortgage bigger than the government-backed limit: in Orange County, more than $1,249,125.',
    who: 'Buyers of expensive homes with strong income, credit, and savings.',
    typical: 'Often 10–20% down, credit 700+, 6–12 months of payments in savings, debt-to-income around 43% or less. Rates are often close to regular loans.',
    pros: ['Lets you borrow above the standard limit', 'No mortgage insurance at 20% down'],
    cons: ['Big down payment and savings required', 'Stricter approval', 'Most down payment programs don\'t apply'],
    lowIncome: 'Rarely relevant on a modest income. If a lender pushes a jumbo loan, the home may be beyond your budget.',
    plain: 'A jumbo loan is a regular mortgage that\'s too big for Fannie Mae, Freddie Mac, or FHA to back, so the lender keeps the risk and is pickier.',
    eli5: 'A super-sized house loan. Banks are extra careful, so you need lots of savings.',
  },

  // ── Already own ─────────────────────────────────────────────────
  {
    id: 'heloc', group: 'own', name: 'HELOC (home equity line of credit)',
    what: 'A credit line secured by your home. Borrow what you need, when you need it, up to a limit.',
    who: 'Owners with equity who need flexible money, such as for repairs.',
    typical: 'Variable rate (prime plus a margin). Often up to 80–85% of home value minus what you owe. A 10-year "draw" period, then 15–20 years of repayment.',
    pros: ['Pay interest only on what you use', 'Flexible for repairs over time', 'Usually lower rate than credit cards'],
    cons: ['Rate can rise', 'Payment jumps when the draw period ends', 'Miss payments and you can lose your home'],
    lowIncome: 'Use it for repairs that protect the home, not for everyday bills. For critical repairs, also ask about Habitat\'s Home Preservation Program.',
    plain: 'A HELOC works like a credit card backed by your house. That makes it cheaper than a card, and riskier.',
    eli5: 'A borrowing card that uses your house as the promise. Don\'t use it for small stuff.',
  },
  {
    id: 'home-equity', group: 'own', name: 'Home equity loan',
    what: 'A one-time lump sum, borrowed against your home\'s equity, with a fixed rate and payment.',
    who: 'Owners with a single big expense, like a roof or an accessibility remodel.',
    typical: 'Fixed rate, usually higher than a first mortgage; terms of 5–30 years; up to about 80–85% combined loan-to-value.',
    pros: ['Fixed, predictable payment', 'Keeps your low first-mortgage rate', 'Lower rate than personal loans'],
    cons: ['A second payment on your home', 'Closing costs', 'Your home is the collateral'],
    lowIncome: 'Compare with a cash-out refinance only if your current mortgage rate is higher than today\'s.',
    plain: 'A second mortgage paid out all at once. Good for one big, planned cost.',
    eli5: 'Borrow one big chunk using your house, and pay it back the same amount every month.',
  },
  {
    id: 'reverse', group: 'own', name: 'Reverse mortgage (HECM)',
    what: 'For homeowners 62 and older: turn home equity into cash with no monthly mortgage payment. The loan is repaid when you move out, sell, or pass away.',
    who: 'Older owners with a lot of equity who want to stay in their home. There is also a "HECM for Purchase" to buy a home suited for aging.',
    typical: 'FHA-insured; free HUD counseling required first. You must keep paying property taxes, insurance, and upkeep. Upfront and ongoing mortgage insurance and fees apply; the loan limit is set by HUD each year.',
    pros: ['No monthly mortgage payment', 'Stay in your home', 'You can never owe more than the home is worth (FHA protection)'],
    cons: ['The balance grows over time, leaving less for heirs', 'Fees are high', 'Missing taxes or insurance can cause foreclosure'],
    lowIncome: 'Can help a low-income senior stay housed. Always use a HUD-approved counselor, and avoid anyone pressuring you to buy other products with the money.',
    plain: 'Instead of you paying the bank each month, the bank pays you, and the loan grows until the home is sold.',
    eli5: 'For grandparents: the house gives them money now, and the loan gets paid back when the house is sold later.',
    url: 'https://www.hud.gov/program_offices/housing/sfh/hecm/hecmhome',
  },

  // ── Investors and business ──────────────────────────────────────
  {
    id: 'dscr', group: 'invest', name: 'DSCR loan (investor rental loan)',
    what: 'A private (non-QM) loan for rental properties that qualifies on the property\'s rent instead of your income. DSCR = rent ÷ mortgage payment.',
    who: 'Real estate investors buying rentals they won\'t live in.',
    typical: 'Often 20–25% down, rates about 1–2+ points above owner-occupied loans, DSCR of 1.0–1.25 or more, prepayment penalties common.',
    pros: ['No personal income documents needed', 'Can close in an LLC'],
    cons: ['Not for the home you live in', 'Higher rate, big down payment', 'Prepayment penalties'],
    lowIncome: 'If you will live in the property, use FHA (2–4 units) instead. It\'s far cheaper.',
    plain: 'The lender asks, "Does the rent cover the payment?" not, "How much do you earn?"',
    eli5: 'A loan for people who buy houses to rent to others. Not for your own family home.',
  },
  {
    id: 'commercial', group: 'invest', name: 'Commercial real estate loan',
    what: 'A loan for business property (shops, offices, warehouses) or apartment buildings with 5 or more units.',
    who: 'Businesses and investors.',
    typical: 'Often 20–35% down, 5–10 year terms with a large "balloon" payment, 20–25 year amortization, based on the property\'s income, usually with a personal guarantee.',
    pros: ['Finances income-producing property', 'Terms can be negotiated'],
    cons: ['Balloon payments mean refinancing risk', 'Large down payment', 'Not for homes'],
    lowIncome: 'Not a homebuying tool. A small business owner who wants to buy their own shop should look at SBA 504 first.',
    plain: 'Commercial loans are judged on the building\'s business income, and they usually come due in 5–10 years.',
    eli5: 'A loan to buy a store or office building, not a house.',
  },
  {
    id: 'sba', group: 'invest', name: 'SBA loans (504 and 7(a))',
    what: 'Government-backed small business loans. SBA 504 finances owner-occupied business property; SBA 7(a) is a general business loan that can also buy property.',
    who: 'Small business owners buying a building they\'ll use (at least 51% for their own business).',
    typical: 'SBA 504 often needs about 10% down for owner-occupied commercial property, with long fixed-rate terms. 7(a) loans go up to $5 million.',
    pros: ['Low down payment for a business property', 'Long, often fixed terms', 'Helps owners stop paying commercial rent'],
    cons: ['Can\'t be used for your home or rental housing', 'Lots of paperwork', 'Personal guarantee required'],
    lowIncome: 'Owning your business\'s building can stabilize your income, but it doesn\'t buy your home.',
    plain: 'SBA loans help small businesses buy the building they work in, with a smaller down payment than a regular commercial loan.',
    eli5: 'A government helper loan for small shops to buy their own building.',
    url: 'https://www.sba.gov/funding-programs/loans',
  },
];
