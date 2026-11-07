/**
 * Community Down Payment Fund concept + tax benefits for buyers, donors, and employers.
 *
 * status: 'exists' (current law/program), 'verify' (current but details changed recently,
 * confirm with a tax pro), 'idea' (a policy proposal: does NOT exist in California today).
 * This is general education, not tax or legal advice.
 */

export const FUND_STEPS = [
  {
    title: 'A nonprofit holds the fund',
    plain: 'The fund lives inside a 501(c)(3) charity, for example a community foundation or a housing nonprofit like Habitat for Humanity OC acting as host. That is what makes gifts tax-deductible and lets lenders accept the money.',
    eli5: 'A trusted helper group holds the money jar so everyone knows it is safe and fair.',
  },
  {
    title: 'Everyone can chip in',
    plain: 'Residents give any amount, once or monthly. Companies give directly, match employee gifts, or sponsor a family\'s grant. Unions, churches, clubs, school PTAs, and hospital foundations can run drives, or set up named pools that serve local teachers, nurses, and first responders under the fund\'s fair rules.',
    eli5: 'Lots of people put a little money in the jar. Companies put in a lot. Together it gets big.',
  },
  {
    title: 'Fair rules pick who gets help',
    plain: 'Families qualify by published rules (for example: first-time buyer, at or under 80% of area median income, finished a homebuyer class). Donors can\'t choose a specific family. That rule keeps gifts deductible and the process fair.',
    eli5: 'The jar has rules, like a game. Families who follow the rules can get help. Nobody can pick favorites.',
  },
  {
    title: 'Money goes straight to closing',
    plain: 'The grant is wired to escrow at closing, never to the buyer\'s hands. It can be a grant or a forgivable loan that is paid back only if the home is sold within, say, 5 years, which refills the fund.',
    eli5: 'The money goes right to the house sale, so it can only be used for the house.',
  },
  {
    title: 'Lenders accept it',
    plain: 'FHA allows down payment gifts from charitable organizations, employers, unions, and government agencies. Fannie Mae and Freddie Mac allow grants from nonprofits and employers too. Gifts from anyone who profits from the sale (the seller, builder, or agent) are not allowed.',
    eli5: 'The banks say "yes, that money counts" as long as it doesn\'t come from the person selling the house.',
  },
];

export const FUND_RULES = [
  'Host it in a 501(c)(3) and register fundraising with the California Attorney General\'s Registry of Charities.',
  'Publish eligibility rules; donors cannot earmark a gift for a named person (earmarked gifts are not deductible).',
  'No money from the seller, builder, or real estate agents of the home (FHA "interested party" rule).',
  'Pay grants to escrow at closing with a gift letter from the nonprofit.',
  'Track and report every dollar; publish an annual report like Habitat OC does.',
  'Have a lawyer and CPA review the structure before accepting money.',
];

/** Benefits for the BUYER. */
export const BUYER_BENEFITS = [
  {
    name: 'Mortgage Credit Certificate (MCC)',
    status: 'exists',
    plain: 'A yearly federal tax credit for part of your mortgage interest. The Orange County program says it is available and currently funded.',
    eli5: 'Money back at tax time every year for part of the interest you paid.',
    url: 'https://ocgov.com/residents/mortgage-credit-certificate-program',
  },
  {
    name: 'Save your tax refund (EITC, CalEITC, Child Tax Credits)',
    status: 'exists',
    plain: 'Many working families get a big refund from the Earned Income Tax Credit, CalEITC, the Young Child Tax Credit, and the Child Tax Credit. Use IRS Form 8888 to send part of it straight to a home savings account. File free with VITA volunteers.',
    eli5: 'Lots of families get extra money back at tax time. Put part of it in your house jar right away, before you spend it.',
    url: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers',
  },
  {
    name: 'IRA first-time homebuyer withdrawal',
    status: 'exists',
    plain: 'You can take up to $10,000 (lifetime) from an IRA for a first home without the 10% early-withdrawal penalty. Regular income tax still applies to traditional IRA money. Roth IRA contributions (not earnings) can be withdrawn any time.',
    eli5: 'Grown-up savings for when you\'re old can help buy your first home, up to $10,000, without a penalty fee.',
    url: 'https://www.irs.gov/taxtopics/tc557',
  },
  {
    name: '401(k) or 403(b) loan',
    status: 'exists',
    plain: 'Many workplace plans let you borrow from your own account (usually up to $50,000 or half your balance) and repay yourself with interest. Plans often allow longer repayment for a home purchase. Risk: if you leave your job, it may be due quickly.',
    eli5: 'You borrow from your own savings and pay yourself back. Be careful if you change jobs.',
    url: 'https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-loans',
  },
  {
    name: 'Mortgage interest and property tax deductions',
    status: 'verify',
    plain: 'Homeowners who itemize can deduct mortgage interest and state and local taxes, including property tax. The state and local tax cap was raised for 2025–2029, but most lower-income buyers take the standard deduction, so this often doesn\'t help them. Ask a tax preparer.',
    eli5: 'Some homeowners pay less tax because of their house. Many families don\'t get this one, so don\'t count on it.',
    url: 'https://www.irs.gov/publications/p936',
  },
  {
    name: 'Community land trust property tax treatment',
    status: 'verify',
    plain: 'California law gives special property tax treatment to land held by qualifying community land trusts, which can lower tax bills on CLT homes. Confirm details with the County Assessor.',
    eli5: 'Houses on land-trust ground can have smaller tax bills.',
    url: 'https://www.boe.ca.gov/proptaxes/welfareexemption.htm',
  },
];

/** Benefits for DONORS and EMPLOYERS. */
export const DONOR_BENEFITS = [
  {
    name: 'Individual gifts to the fund',
    status: 'verify',
    plain: 'Gifts to a 501(c)(3) fund are deductible if you itemize. Starting in 2026, people who do NOT itemize can deduct up to $1,000 (single) or $2,000 (married filing jointly) in cash gifts. New 2026 rules also add a small floor for itemizers. California has its own rules. Confirm with a tax pro.',
    eli5: 'If you give to the helper jar, you may pay a little less tax.',
    url: 'https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contribution-deductions',
  },
  {
    name: 'Corporate gifts and matching',
    status: 'verify',
    plain: 'Corporations can deduct charitable gifts (generally up to 10% of taxable income; a new 1% floor starts in 2026). Matching employee gifts doubles the impact and is easy to run through payroll giving.',
    eli5: 'Companies can give too, and they also pay less tax when they do.',
    url: 'https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contribution-deductions',
  },
  {
    name: 'Employer-assisted housing (EAH)',
    status: 'exists',
    plain: 'An employer can give its own workers down payment grants or forgivable loans and deduct the cost as a business expense. For the worker, that help is usually taxable income, so many employers "gross up" the grant or use a forgivable loan.',
    eli5: 'A boss can help their workers buy homes. The worker may owe some tax on the help, so good bosses add a little extra to cover it.',
    url: 'https://www.hud.gov/topics/homeownership',
  },
  {
    name: 'Donating goods to Habitat ReStore',
    status: 'exists',
    plain: 'Furniture, appliances, and building materials donated to a Habitat ReStore can be deductible at fair market value (IRS Publication 561; Form 8283 for non-cash gifts over $500). ReStore sales fund homes. Habitat OC\'s ReStores grossed about $2.76M last year.',
    eli5: 'Give your old couch to the Habitat store. They sell it and use the money to build houses.',
    url: 'https://www.irs.gov/publications/p561',
  },
];

/** Policy IDEAS: none of these exist in California today. */
export const POLICY_IDEAS = [
  {
    name: 'California First-Time Homebuyer Savings Account',
    plain: 'About a dozen states, including Colorado, Virginia, Montana, and Oregon, let people deduct deposits into a homebuyer savings account from state income tax. California could do the same, and let parents, employers, and the community fund deposit too.',
    eli5: 'A special piggy bank for your first house where the state doesn\'t take tax on what you save.',
  },
  {
    name: 'State tax credit for down payment fund donations',
    plain: 'California already gives a 50% state tax credit for gifts to the College Access Tax Credit Fund (Cal Grants). A similar credit for gifts to qualified down payment funds would make every $1,000 donated cost the donor about $500.',
    eli5: 'If you give $10 to the house jar, the state gives you $5 back. Then more people want to give.',
  },
  {
    name: 'Tax-free employer down payment help',
    plain: 'Federal law could treat employer housing help like tuition help: tax-free to the worker up to a set amount a year. Companies would then be able to help nurses, aides, and staff without a tax hit.',
    eli5: 'When your boss helps you buy a house, you wouldn\'t have to pay tax on that help.',
  },
  {
    name: 'Pre-tax payroll savings for a first home',
    plain: 'Like a 401(k) or health savings account, workers could set aside part of each paycheck before taxes into a first-home account, with optional employer match. This needs a federal law change.',
    eli5: 'A little money from every paycheck goes into your house jar before taxes take a bite.',
  },
  {
    name: 'Matched savings with refund splitting',
    plain: 'The state or county could match money that families send from their tax refunds into home savings, for example $1 for every $1 up to $2,000, building on the Individual Development Account model.',
    eli5: 'Put money from your tax refund in your house jar, and a helper adds the same amount.',
  },
  {
    name: 'Employer-assisted housing tax credit',
    plain: 'A state credit for employers who fund worker down payments, like the one some other states use, would get hospitals, school districts, and cities to build housing benefits.',
    eli5: 'If a company helps its workers buy homes, the state gives the company a thank-you on its taxes.',
  },
];

export const STATUS_TAGS = {
  exists: { label: 'Exists today', className: 'bg-[var(--accent)] text-paper' },
  verify: { label: 'Exists: rules changed, verify', className: 'bg-gold text-ink' },
  idea: { label: 'Policy idea', className: 'bg-[#3454B4] text-paper' },
};

/** Rough donor after-tax cost. Not tax advice. */
export function donorAfterTaxCost({ gift, type, itemizes, filing, federalRate, stateRate }) {
  if (type === 'company') {
    const fed = 0.21;
    const ca = 0.0884;
    const effective = ca + fed * (1 - ca); // state tax is deductible federally
    return { savings: gift * effective, rateLabel: `~${Math.round(effective * 100)}% (21% federal + 8.84% CA, before limits)` };
  }
  if (itemizes) {
    const r = federalRate / 100 + stateRate / 100;
    return { savings: gift * r, rateLabel: `~${federalRate + stateRate}% (your federal + CA rates)` };
  }
  const cap = filing === 'joint' ? 2000 : 1000;
  const fedSavings = Math.min(gift, cap) * (federalRate / 100);
  return { savings: fedSavings, rateLabel: `${federalRate}% federal on up to $${cap.toLocaleString()} (2026 non-itemizer deduction)` };
}
