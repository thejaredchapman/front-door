/**
 * Free-text job title + employer → a guessed job category and employer-specific tips.
 * Tips say what to ASK; we only name a benefit where we found one (SchoolsFirst, UCI ICHA).
 */

const TITLE_RULES = [
  { cat: 'firefighter', re: /fire|emt|paramedic|ems\b|cal ?fire|ocfa/i },
  { cat: 'police', re: /police|sheriff|deputy|officer|correction|dispatcher|probation|peace/i },
  { cat: 'healthcare', re: /nurse|\brn\b|\blvn\b|cna|medical|hospital|caregiver|therap|pharm|dental|health|clinic|home health|tech(nician)? ?\(?(lab|x-?ray|surgical)/i },
  { cat: 'teacher', re: /teach|school|aide|para(educator|professional)?|custodian|bus driver|cafeteria|food service|principal|counselor|librar|professor|instructor|daycare|preschool|tutor/i },
  { cat: 'public', re: /city of|county of|state of|clerk|parks|transit|ocTA|public works|social worker|eligibility worker|postal|usps|caltrans/i },
  { cat: 'service', re: /cook|server|cashier|retail|clean|janitor|housekeep|warehouse|driver|delivery|landscap|construction|mechanic|barista|hotel|restaurant|security|stock|farm/i },
];

const EMPLOYER_RULES = [
  {
    re: /unified|school district|\busd\b|elementary|high school|community college|college district|cal state|csu/i,
    cat: 'teacher',
    tips: [
      'SchoolsFirst FCU serves school employees: ask about the $7,500 School Employee Mortgage Grant.',
      'Ask district HR about employee housing (California Teacher Housing Act) and partner lenders.',
      'Teacher Loan Forgiveness and PSLF can lower your student loan payment, which raises what you qualify for.',
    ],
  },
  {
    re: /uc irvine|\buci\b|uci health/i,
    cat: 'healthcare',
    tips: ['UC Irvine employees can join the ICHA University Hills waitlist for below-market for-sale homes (949-824-7345).', 'Ask UCI HR about any other housing benefits.'],
  },
  {
    re: /kaiser|providence|hoag|memorialcare|choc|mission hospital|st\.? joseph|cedars|sutter|dignity|hospital|medical center/i,
    cat: 'healthcare',
    tips: ['We found no public homebuyer benefit at Orange County hospital systems, so ask HR anyway, because benefits change.', 'GSFA Platinum "Select" gives extra down payment help to health care workers.', 'Ask whether your hospital\'s credit union or foundation has a homebuyer program.'],
  },
  {
    re: /fire authority|ocfa|fire department|cal ?fire/i,
    cat: 'firefighter',
    tips: ['Firefighters First Credit Union offers a 3%-down, no-PMI first-time buyer loan.', 'GSFA Platinum "Select" adds a gift for firefighters and EMTs.'],
  },
  {
    re: /police|sheriff|probation/i,
    cat: 'police',
    tips: ['GSFA Platinum "Select" adds a gift for law enforcement.', 'Ask your department or association about member credit unions and lender discounts.'],
  },
  {
    re: /city of|county of|state of california|caltrans|octa|water district|sanitation/i,
    cat: 'public',
    tips: ['Ask HR whether your city or county gives employees priority for its down payment or below-market home programs.', 'GSFA "Assist-to-Own" serves employees of member counties. Ask a GSFA lender if yours qualifies.'],
  },
  {
    re: /disney|amazon|walmart|target|costco|starbucks|in-n-out|hotel|marriott|hilton/i,
    cat: 'service',
    tips: ['Large employers sometimes partner with lenders or offer financial-wellness benefits. Ask HR or your benefits portal about home buying.'],
  },
];

export function matchJob(jobTitle = '', employer = '') {
  const tips = [];
  let cat = null;
  const e = EMPLOYER_RULES.find((r) => r.re.test(employer));
  if (e) { cat = e.cat; tips.push(...e.tips); }
  const t = TITLE_RULES.find((r) => r.re.test(jobTitle));
  if (t && !cat) cat = t.cat;
  if ((jobTitle || employer) && tips.length === 0) {
    tips.push('Ask your HR or benefits office: "Do we offer any home-buying benefit, loan, or partner lender?"');
  }
  return { guessedCategory: cat, tips };
}
