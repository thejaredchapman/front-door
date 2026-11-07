import { findOcCity } from './ocCities';

const MAP_OK = (id) => id === 'any' || Boolean(findOcCity(id)?.mapEligible);

/**
 * Personal home-buying timeline, calendar export, and provider email drafts.
 * Durations are typical ESTIMATES (in weeks), not guarantees. Lotteries and
 * credit waiting periods can't be sped up; most other steps can run in parallel.
 */

const BK_WEEKS = { lt2: 52, '2to4': 0, gt4: 0, none: 0 };   // rough time left until a 2-yr FHA wait ends
const FC_WEEKS = { lt3: 78, '3to7': 0, gt7: 0, none: 0 };   // rough time left until a 3-yr FHA wait ends

/**
 * Each step: std/fast duration in weeks, and what it waits for in each mode.
 * Standard = one thing at a time. Fast track = run steps side by side.
 */
export function buildSteps(a, results) {
  const fits = (id) => results.some((r) => r.id === id && r.fit !== 'notYet');
  const needsCredit = fits('credit-first');
  const waitWeeks = Math.max(BK_WEEKS[a.bankruptcy] || 0, FC_WEEKS[a.foreclosure] || 0);
  const creditStd = needsCredit ? Math.max(26, waitWeeks) : 0;
  const creditFast = needsCredit ? Math.max(10, waitWeeks) : 0;
  const lottery = fits('habitat') || fits('city-loan') || fits('uci');

  const steps = [
    {
      id: 'class', title: 'Take the free homebuyer class', std: 4, fast: 1,
      depStd: [], depFast: [],
      plain: 'Book a HUD-approved counselor (NeighborWorks OC) and earn the homebuyer certificate most programs require.',
      eli5: 'Go to the free class that teaches the rules.',
      fastTip: 'Take the 8-hour class online this week instead of waiting for an in-person date.',
    },
    {
      id: 'docs', title: 'Gather your papers', std: 2, fast: 1,
      depStd: ['class'], depFast: [],
      plain: '2 years of tax returns and W-2s, 30 days of pay stubs, 2 months of bank statements, and ID, in one folder.',
      eli5: 'Put all your money papers in one folder.',
      fastTip: 'Gather papers the same week you take the class. Download statements as PDFs.',
    },
    {
      id: 'groups', title: 'Get on lists and join groups', std: 4, fast: 1,
      depStd: ['docs'], depFast: [],
      plain: 'Attend a Habitat orientation, join city interest and lottery lists, and join a credit union if you plan to use one.',
      eli5: 'Put your name on every list and join the bank club.',
      fastTip: 'Sign up for every list on day one. Waitlists run while you do everything else.',
    },
  ];

  if (needsCredit) {
    steps.push({
      id: 'credit', title: waitWeeks ? 'Rebuild credit (and finish the waiting period)' : 'Raise your credit score', std: creditStd, fast: creditFast,
      depStd: ['groups'], depFast: [],
      plain: waitWeeks
        ? 'Pay every bill on time and keep cards low while the waiting period after bankruptcy or foreclosure runs out.'
        : 'Pay on time, lower card balances under 30%, and fix report errors.',
      eli5: 'Pay bills on time so your money report card gets better.',
      fastTip: waitWeeks
        ? 'Waiting periods can\'t be skipped, but FHA can shorten them for documented hardship (job loss, illness). Ask a lender.'
        : 'Pay cards down before the statement date, dispute errors now, and ask your lender about a "rapid rescore" (days, not months).',
    });
  }

  steps.push(
    {
      id: 'preapproval', title: 'Get pre-approved', std: 3, fast: 1,
      depStd: [needsCredit ? 'credit' : 'groups'], depFast: [needsCredit ? 'credit' : 'docs', 'class'],
      plain: 'Choose a lender approved for CalHFA and your city\'s program, and get a written pre-approval with the help layered in.',
      eli5: 'Get a permission slip from the bank that says how much it can lend.',
      fastTip: 'Use one lender that handles CalHFA, city loans, and the MCC so you aren\'t switching mid-way. Send every document the same day they ask.',
    },
    {
      id: 'programs', title: 'Apply for down payment help', std: 6, fast: 3,
      depStd: ['preapproval'], depFast: ['preapproval'],
      plain: 'Your lender reserves CalHFA funds; you apply to city or county programs and confirm they have money.',
      eli5: 'Ask the helpers for their part of the money.',
      fastTip: 'Apply to city programs while you house-hunt, not after. Call first to confirm funds are open.',
    },
    {
      id: 'search', title: lottery ? 'Find a home (or win a lottery)' : 'Find a home', std: 16, fast: 8,
      depStd: ['programs'], depFast: ['preapproval'],
      plain: lottery
        ? 'Shop the market and wait on Habitat and below-market-rate lotteries at the same time. Lotteries can take many months.'
        : 'Look at homes in your price range and make offers.',
      eli5: 'Look for a house that fits your family and your money.',
      fastTip: 'Set listing alerts, look at condos and townhomes too, and have your agent ready to write offers the same day.',
    },
    {
      id: 'escrow', title: 'Escrow and closing', std: 6, fast: 4,
      depStd: ['search'], depFast: ['search'],
      plain: 'Inspection, appraisal, final loan approval, and signing. Down payment help usually adds time, so 45 days is common.',
      eli5: 'The last steps: check the house, sign the papers, get the keys.',
      fastTip: 'Schedule the inspection on day 1, answer the lender within 24 hours, and don\'t open new credit.',
    },
  );
  return steps;
}

/** Turn steps into dated start/end weeks for the chosen mode. */
export function schedule(steps, mode) {
  const out = {};
  for (const s of steps) {
    const deps = (mode === 'fast' ? s.depFast : s.depStd).filter((d) => out[d]);
    const start = deps.length ? Math.max(...deps.map((d) => out[d].end)) : 0;
    const dur = mode === 'fast' ? s.fast : s.std;
    out[s.id] = { ...s, start, end: start + dur, dur };
  }
  const list = Object.values(out);
  return { list, totalWeeks: Math.max(...list.map((s) => s.end)) };
}

export function addWeeks(date, weeks) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d;
}

const ymd = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
const esc = (t) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Build an .ics calendar file: one all-day event per step, with a reminder the day before. */
export function buildIcs(list, startDate, mode) {
  const stamp = `${ymd(new Date())}T000000Z`;
  const events = list.map((s, i) => {
    const start = addWeeks(startDate, s.start);
    const end = addWeeks(startDate, Math.max(s.end, s.start + 1 / 7));
    const desc = `${s.plain}\n\nTip to go faster: ${s.fastTip}\n\nFrom Front Door "Find my plan" (${mode === 'fast' ? 'fast track' : 'standard'}). Estimates only.`;
    return [
      'BEGIN:VEVENT',
      `UID:loanlens-${s.id}-${ymd(start)}-${i}@loanlens`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(start)}`,
      `DTEND;VALUE=DATE:${ymd(end)}`,
      `SUMMARY:${esc(`🏠 ${s.title}`)}`,
      `DESCRIPTION:${esc(desc)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(s.title)}`, 'TRIGGER:-P1D', 'END:VALARM',
      'END:VEVENT',
    ].join('\r\n');
  });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Front Door//Find my plan//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
}

/** Email drafts for providers that match the person's plans. Nothing is sent automatically. */
export function buildEmails(a, results, categoryLabel) {
  const fits = (id) => results.some((r) => r.id === id && r.fit !== 'notYet');
  const county = a.county || 'Orange';
  const isOC = county === 'Orange';
  const who = `I'm a ${a.ownedRecently ? '' : 'first-time '}homebuyer with a household of ${a.householdSize} in ${county} County (income group: ${categoryLabel}).`;
  const sign = '\n\nThank you,\n[Your name]\n[Your phone]';
  const emails = [
    {
      id: 'counselor', to: '', ...(isOC
        ? { org: 'NeighborWorks Orange County (HUD-approved counselor)', link: 'https://www.ehomeamerica.org/nwoc', phone: '714-490-1250' }
        : { org: 'A HUD-approved housing counselor near you', link: 'https://www.hud.gov/findacounselor', phone: '' }),
      subject: 'Request: homebuyer class and counseling appointment',
      body: `Hello,\n\n${who} I'd like to sign up for your next homebuyer education class and book a one-on-one counseling session.\n\nCould you tell me:\n1. The next class dates (online or in person) and how to register?\n2. What I should bring to my first counseling meeting?\n3. Which down payment programs are open right now in my area?${sign}`,
    },
    {
      id: 'lender', to: '', org: 'A CalHFA-approved lender', link: 'https://www.calhfa.ca.gov/homebuyer/programs/index.htm', phone: '',
      subject: 'Pre-approval request: first-time buyer with down payment assistance',
      body: `Hello,\n\n${who} I'm looking for a pre-approval and want to use down payment assistance.\n\nCould you tell me:\n1. Are you approved for CalHFA MyHome and ZIP${fits('gsfa') ? ', GSFA Platinum' : ''}${fits('city-loan') ? ', and city or county down payment loans' : ''}?\n2. Can these be stacked with ${fits('homeready') ? 'a HomeReady/Home Possible or ' : ''}an FHA loan?\n3. Do you offer the Mortgage Credit Certificate?\n4. What documents do you need, and how long does pre-approval take?\n5. Your current rate and estimated closing costs?${sign}`,
    },
  ];
  if (fits('habitat')) emails.push({
    id: 'habitat', ...(isOC
      ? { to: 'familyservices@HabitatOC.org', org: 'Habitat for Humanity of Orange County', link: 'https://habitatoc.org/review-qualifications', phone: '714-434-6200 x227' }
      : { to: '', org: 'Your local Habitat for Humanity affiliate', link: 'https://www.habitat.org/local/affiliate', phone: '' }),
    subject: 'Interest in the homeownership program',
    body: `Hello,\n\n${who} I'm interested in Habitat OC's homeownership program.\n\nCould you tell me:\n1. When is the next orientation, and how do I register?\n2. Are any homes or applications open now, and what income range applies?\n3. How many sweat-equity hours are required, and can family members help?${sign}`,
  });
  if (fits('city-loan')) {
    const city = !isOC ? { org: `${county} County housing department (and your city's housing office)`, link: '', phone: '' } : ({
      'garden-grove': { org: 'City of Garden Grove, First-Time Home Buyer Program', link: 'https://ggcity.org/FTHB', phone: '714-741-5131' },
      'santa-ana': { org: 'City of Santa Ana, My First Home', link: 'https://santa-ana.org/my-first-home', phone: '714-667-2250' },
      anaheim: { org: 'City of Anaheim Housing', link: 'https://housingportal.anaheim.net', phone: '' },
      irvine: { org: 'City of Irvine, Affordable Housing', link: 'https://cityofirvine.gov/affordable-housing', phone: '' },
    }[a.city] || (MAP_OK(a.city)
      ? { org: 'Affordable Housing Clearinghouse (County Mortgage Assistance Program)', link: 'https://housing.oc.gov/housing-development', phone: '949-859-9255' }
      : { org: 'Your city\'s housing office', link: '', phone: '' }));
    emails.push({
      id: 'city', to: '', ...city,
      subject: 'Question: is your homebuyer assistance program open?',
      body: `Hello,\n\n${who}\n\nCould you tell me:\n1. Is your down payment or homebuyer assistance program accepting applications now, and how much funding is left?\n2. The current income limits and maximum assistance?\n3. How to join the interest list for below-market-rate homes?\n4. Which lenders you work with?${sign}`,
    });
  }
  const cu = [['schoolsfirst', 'SchoolsFirst Federal Credit Union', 'https://www.schoolsfirstfcu.org/', 'School Employee Mortgage and $7,500 grant'],
    ['ffcu', 'Firefighters First Credit Union', 'https://www.firefightersfirstcu.org/Personal/Home-Loans', 'first-time homebuyer loan'],
    ['ocscu-zero', "Orange County's Credit Union", 'https://orangecountyscu.org/products/home-loans/zero-down-home-loan', 'Zero Down home loan']]
    .find(([id]) => fits(id));
  if (cu) emails.push({
    id: 'cu', to: '', org: cu[1], link: cu[2], phone: '',
    subject: `Question about your ${cu[3]}`,
    body: `Hello,\n\n${who} I'm interested in your ${cu[3]}.\n\nCould you tell me:\n1. Am I eligible, and how do I join if I'm not a member yet?\n2. Minimum credit score, down payment, and income limits?\n3. Can it be combined with CalHFA or city down payment help?${sign}`,
  });
  if (a.occupation === 'teacher') emails.push({
    id: 'district', to: '', org: 'Your school district HR / benefits office', link: '', phone: '',
    subject: 'Question: housing benefits for school employees',
    body: `Hello,\n\nI work for the district and I'm planning to buy my first home. Could you tell me:\n1. Does the district offer employee housing (including under the California Teacher Housing Act), down payment help, or partner lenders?\n2. Is there an employee-assistance or financial-wellness program that covers home buying?\n3. Can HR provide a letter confirming my contract and annual salary for my lender?\n\nIf none exist, would the district consider partnering with a community down payment fund?${sign}`,
  });
  if (a.occupation !== 'any' && a.occupation !== 'service' && a.occupation !== 'teacher') emails.push({
    id: 'hr', to: '', org: 'Your employer\'s HR / benefits office', link: '', phone: '',
    subject: 'Question: home-buying benefits for employees',
    body: `Hello,\n\nI'm planning to buy my first home and wanted to ask whether we offer any housing benefits, such as down payment grants, forgivable loans, partner lender discounts, or employee housing.\n\nIf not, would HR consider partnering with a community down payment fund or an employer-assisted housing program?${sign}`,
  });
  return emails;
}
