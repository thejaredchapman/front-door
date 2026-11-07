/**
 * Facts pulled from the Habitat for Humanity Hack-a-thon source documents.
 * Every item cites the document it came from so users (and judges) can check it.
 */

export const DOC_SOURCES = {
  impact: {
    title: 'Habitat for Humanity of Orange County, 2025 Impact Report (FY 2024–25)',
    url: 'https://www.habitatoc.org/',
  },
  audit: {
    title: 'Habitat for Humanity of Orange County, Audited Financial Statements, FY ended June 30, 2025',
    url: 'https://www.habitatoc.org/',
  },
  incomeLimits: {
    title: 'California HCD, Revised 2026 State Income Limits (memo dated June 23, 2026)',
    url: 'https://www.hcd.ca.gov/grants-and-funding/income-limits/state-and-federal-income-rent-and-loan-value-limits',
  },
  housingElement: {
    title: 'County of Orange, 2021–2029 Housing Element (adopted February 2025)',
    url: 'https://ocds.ocpublicworks.com/service-areas/oc-development-services/planning-development/codes-and-regulations/general-plan',
  },
  prop1: {
    title: 'Proposition 1 (Nov. 3, 2026): Veterans and Affordable Housing Bond Act of 2026, Text of Proposed Law',
    url: 'https://www.sos.ca.gov/elections/ballot-measures',
  },
  energy: {
    title: 'California Energy Commission, 2025 Single-Family Residential Compliance Manual (CEC-400-2025-005)',
    url: 'https://www.energy.ca.gov/programs-and-topics/programs/building-energy-efficiency-standards/2025-building-energy-efficiency',
  },
};

export const OC_REALITY = [
  {
    value: '$1.3M+',
    label: 'Median home price in Orange County',
    source: 'impact',
  },
  {
    value: '$130K',
    label: 'Median household income',
    source: 'impact',
  },
  {
    value: '10 : 1',
    label: 'Price-to-income ratio (about 4 : 1 is considered affordable)',
    source: 'impact',
  },
  {
    value: '$3,250',
    label: 'Average monthly rent countywide',
    source: 'impact',
  },
  {
    value: '50%+',
    label: 'Share of renters who are cost-burdened (pay more than 30% of income on housing)',
    source: 'impact',
  },
];

export const HABITAT_OC_FACTS = [
  { value: '239', label: 'Homes built and sold in 37 years, across 16 OC cities', source: 'impact' },
  { value: '710', label: 'Children who now have a place to call home', source: 'impact' },
  { value: '907', label: 'People attended a homeownership orientation last year', source: 'impact' },
  { value: '52', label: 'Homes repaired in FY 2025 so owners could stay safely (incl. 1 veteran)', source: 'audit' },
  { value: '100', label: 'Homes the "Keys to 100" campaign aims to build or preserve', source: 'impact' },
];

export const HABITAT_CITIES = [
  'Anaheim', 'Brea', 'Costa Mesa', 'Cypress', 'Fullerton', 'Huntington Beach', 'Irvine', 'La Habra',
  'Placentia', 'Rancho Santa Margarita', 'San Juan Capistrano', 'Santa Ana', 'Stanton', 'Tustin',
  'Westminster', 'Yorba Linda',
];

/** How the Habitat OC mortgage model works, per the FY2025 audit notes. */
export const HABITAT_MODEL = [
  {
    title: 'Homes sold at cost',
    plain: 'Habitat OC sells the homes it builds to low- and moderate-income families at cost, not at market price.',
    eli5: 'Habitat sells the house for only what it cost to build it. No extra profit added on top.',
    source: 'audit',
  },
  {
    title: 'Discounted first mortgage',
    plain: 'Since 2018, banking partners make the first mortgage at a discounted interest rate. Before that, Habitat itself made 0%-interest loans (some funded by the state CalHome program).',
    eli5: 'A bank lends the money, but charges less "rent on the money" than usual because it is partnering with Habitat.',
    source: 'audit',
  },
  {
    title: 'A "silent second" that protects you',
    plain: 'Homeowners also sign a small silent second mortgage (typically $1 to $1,000) with no payments and no interest. It is forgiven if you live in the home for the required time. It stops the home from being flipped for quick profit and blocks predatory lenders from refinancing you into a bad loan.',
    eli5: 'You sign a tiny extra promise that says, "This is our forever home." It costs nothing each month, and it keeps tricky lenders from taking advantage of you.',
    source: 'audit',
  },
  {
    title: 'Homes stay affordable',
    plain: 'If an owner sells, Habitat can buy the home back and resell it to another qualifying family. Two homes were repurchased and resold this way in FY 2025.',
    eli5: 'When a Habitat family moves out, the house gets passed to the next family who needs it.',
    source: 'audit',
  },
];

/** Prop 1 (Nov 2026) allocations most relevant to buyers. Text of proposed law, Sec. 54054(b). */
export const PROP1 = {
  total: '$10 billion',
  veterans: '$1.25 billion',
  homebuyerLines: [
    {
      amount: '$500 million',
      what: 'Home Purchase Assistance Fund, continuously appropriated to CalHFA for down payment help (the program family behind MyHome and Dream For All).',
    },
    {
      amount: '$600 million',
      what: 'CalHome / Self-Help Housing Fund: forgivable loans for ownership developments, self-help (sweat-equity) programs like Habitat, and manufactured homes.',
    },
    {
      amount: '$1.25 billion',
      what: 'CalVet Farm and Home loans for California veterans (separate veterans bond in the same measure).',
    },
    {
      amount: '$200 million',
      what: 'Local Housing Trust Fund matching grants, which can flow to trusts like the Orange County Housing Finance Trust.',
    },
  ],
  otherLines: [
    '$5.1B Multifamily Housing Program (affordable rentals)',
    '$1.15B supportive housing (incl. $150M for youth housing)',
    '$750M Portfolio Reinvestment Program',
    '$500M Infill Infrastructure Grants',
    '$450M Joe Serna Jr. Farmworker Housing',
    '$350M UC/CSU student housing',
    '$200M acquisition and preservation',
    '$200M Tribal Housing Grants',
  ],
  status: 'Projected to pass (about 60.5% yes, AP). Results are certified December 11, 2026.',
  plain: 'Proposition 1 authorizes $10 billion in general obligation bonds for affordable housing, plus $1.25 billion for veterans\' home loans. Most of it builds rentals, but over $1 billion is aimed directly at helping people buy homes. Money takes time to flow: expect new rounds of CalHFA and CalHome help over the next several years, not overnight.',
  eli5: 'Prop 1 is the state asking voters, "Can we borrow money to help people get homes?" Some of that money helps people pay for the down payment, and some helps groups like Habitat build homes.',
};

/** 2025 Energy Code (applies to permits on or after Jan 1, 2026): why it matters to a buyer. */
export const ENERGY_CODE = {
  plain: 'New single-family homes permitted under California\'s 2025 Energy Code must use a heat pump for heating (or prove equal performance), meet tighter window and insulation standards, include solar PV sized to the roof, and be battery-ready if they have a 125-amp or larger panel. For a buyer, that usually means lower monthly utility bills. That matters because lenders look at your whole monthly budget, and utilities are part of what you actually pay.',
  eli5: 'New homes in California are built like a good thermos: they keep heat in during winter and out during summer, and many make their own power from the sun. That means smaller electric bills, so more of your money is left for the mortgage.',
  points: [
    'Heat pump heating required on the prescriptive path (all climate zones)',
    'Window U-factor max tightened to 0.27 in many climate zones; mandatory max 0.40',
    'Solar PV sizing based on usable roof area',
    'Battery-ready wiring for new homes with 125A+ panels',
    'Fire-zone (WUI) windows get an exception from some window rules',
  ],
};

/** Housing Element: what the County says it uses to close the gap. */
export const HOUSING_ELEMENT = {
  plain: 'The County\'s Housing Element finds that home prices have risen faster than incomes since 2015, and that "public subsidies are generally required" for very low-income buyers. Its affordability table (2023, family of 4, 10% down, 4.5% rate) estimated a low-income family could afford about $478,000, far below the county median.',
  eli5: 'The County did the math and agreed: houses here cost way more than most families earn. That is why helpers exist to fill the gap.',
  tools: [
    'Orange County Mortgage Assistance Program: silent (deferred-payment) down payment loans for first-time buyers at or below 80% AMI, in unincorporated areas and participating cities',
    'Mortgage Credit Certificate (MCC): a federal tax credit of up to 15% of the mortgage interest paid each year (per the Housing Element)',
    'Down Payment Assistance loans, which can be combined with an MCC',
    'CalHome funds for down payments, mortgage financing, and homebuyer counseling',
    'Permanent Local Housing Allocation (PLHA) funds, which can include down payment help',
    'CalHFA below-market-rate first mortgages through approved private lenders',
    'CDBG and HOME funds that can support homebuyer assistance',
  ],
  affordability2023: [
    { category: 'Extremely low (≤30%)', income: 43050, price: 141147 },
    { category: 'Very low (31–50%)', income: 71750, price: 275961 },
    { category: 'Low (51–80%)', income: 114800, price: 478333 },
    { category: 'Moderate (81–120%)', income: 127800, price: 541525 },
  ],
};
