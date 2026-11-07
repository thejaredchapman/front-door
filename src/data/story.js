/**
 * "Ana and Luis find their way home": an illustrative story (not real people)
 * that walks through the whole process. Numbers are examples for a 4-person
 * household earning $102,000 in Orange County using 2026 income limits.
 */
export const STORY_FAMILY = {
  names: 'Ana and Luis',
  householdSize: 4,
  income: 102000,
  jobs: 'Ana is a certified nursing assistant at a hospital in Orange. Luis maintains parks for the city. They have two kids and rent a one-bedroom apartment in Santa Ana.',
};

/** Illustrative stack for the "Stacking the help" chapter. Silent-second amount is an example, not a real program term. */
export const STORY_STACK = {
  price: 375000,
  myHomePercent: 3.5, // CalHFA MyHome: up to 3.5% (FHA), per calhfa.ca.gov
  citySilentSecond: 60000, // EXAMPLE amount; city programs vary
  rate: 7.18,
  fhaAnnualMipPercent: 0.55, // typical FHA annual MIP for 30-yr, LTV > 95%
  propertyTaxRate: 1.1, // assumption: ~1% + local assessments
  annualInsurance: 1800, // assumption
};

export const STORY_CHAPTERS = [
  {
    id: 'dream',
    title: 'The dream, and the gap',
    plain: 'Ana and Luis earn $102,000 together, more than either of their parents ever did. But the median home in Orange County costs over $1.3 million. Their landlord just raised the rent again. Luis said what a lot of people think: "People like us don\'t buy houses here." He was half right. People like them rarely buy market-price houses here. They buy with help.',
    eli5: 'Ana and Luis work hard. But houses here cost so much that their paychecks look tiny next to them. Luis thought, "We can never buy a house." But there is a secret: lots of families get help from special helpers.',
    did: ['Wrote down the goal: a home where the kids each have a bed and a place to do homework.'],
  },
  {
    id: 'fit',
    title: 'Where do we fit?',
    plain: 'A housing counselor showed them the 2026 income limits for Orange County. For a family of four, "low income" goes up to $148,850. At $102,000 they are about 74% of the area median income (AMI). That one fact unlocked almost every program on this page, because most help is designed for households under 80% of AMI.',
    eli5: 'The helpers have a chart. You find your family size and your paycheck, and the chart tells you which helpers can help you. Ana and Luis landed right in the zone where the most helpers say "yes!"',
    did: ['Used the "Where do I fit?" checker on this page', 'Found a free HUD-approved housing counselor'],
  },
  {
    id: 'foundation',
    title: 'Fixing the foundation',
    plain: 'Their credit scores were 610 and 655. The counselor helped them dispute an old medical bill and pay a store card down below 30% of its limit. Six months later both scores were over 660. They took the 8-hour homebuyer class (most programs require it), opened a savings account just for the house, and set up an automatic $300 transfer on every payday.',
    eli5: 'Before you build a house, you pour a strong floor. For buying a house, the "floor" is paying bills on time, saving a little every payday, and taking a class that teaches the rules.',
    did: ['Pulled free credit reports at annualcreditreport.com', 'Finished homebuyer education and got the certificate', 'Saved $8,000 in 14 months'],
  },
  {
    id: 'math',
    title: 'Doing the real math',
    plain: 'At 30% of their income, they can spend about $2,550 a month on housing. At a 7.18% rate, after property tax and insurance, that supports a loan of only about $300,000. Even with down payment help, a $650,000 condo would cost far more per month than they can safely pay. So the counselor gave them two realistic paths: (1) a below-market-rate home priced for their income, or (2) Habitat for Humanity.',
    eli5: 'They did the math like a grocery list. Their paycheck could pay for a house that costs about the price of one wing of a castle, not the whole castle. So they looked for houses with special, lower prices made for families like theirs.',
    did: ['Ran their numbers in the Front Door calculator', 'Learned that "price" and "monthly payment" both matter'],
  },
  {
    id: 'doors',
    title: 'Knocking on the right doors',
    plain: 'They joined the interest lists for below-market-rate (inclusionary) homes in several cities and attended a Habitat for Humanity of Orange County orientation. They also asked Ana\'s hospital HR and Luis\'s city HR about employee housing benefits, and checked their credit union for first-time-buyer programs for public employees.',
    eli5: 'They did not wait for one door to open. They knocked on lots of doors at once: special-price houses, Habitat, their jobs, and their bank.',
    did: ['Signed up for city BMR lottery lists', 'Attended Habitat OC orientation', 'Asked both employers about housing benefits'],
  },
  {
    id: 'stack',
    title: 'Stacking the help',
    plain: 'A year later they won a lottery for a deed-restricted 3-bedroom townhome priced at $375,000. Their lender layered the help: an FHA first mortgage, a CalHFA MyHome deferred junior loan covering the 3.5% down payment, and a city silent second (deferred, no monthly payment) that paid down part of the price. The box below shows how the numbers stack. Their own $8,000 covered part of the closing costs. A Mortgage Credit Certificate, if available, could return part of their mortgage interest at tax time each year.',
    eli5: 'Think of the price as a big wall. One helper builds most of it (the bank). Another helper adds the first bricks (the down payment). Another helper holds the wall steady and you only pay them back later. Together the wall gets built.',
    did: ['Got pre-approved with a lender that is approved for CalHFA and city programs', 'Read every deed restriction before signing'],
  },
  {
    id: 'keep',
    title: 'Keeping the home',
    plain: 'Their monthly payment is a little more than their old rent, but it is fixed for 30 years, and every payment builds equity. The deed restriction means that if they sell, the price is capped so the next family can afford it too. They keep an emergency fund, never refinance with a lender who calls them out of the blue, and know that help such as Habitat\'s Home Preservation Program exists if a big repair comes up.',
    eli5: 'Now the house is theirs. They pay a bit more than rent, but each payment makes the house a little more theirs. They save for surprises, like a broken water heater, so their home stays safe.',
    did: ['Built a 3-month emergency fund', 'Kept the counselor\'s number for any money trouble'],
  },
];
