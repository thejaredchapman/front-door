/**
 * "Start here": a suggested route through Front Door for each kind of visitor.
 * Each step links to a page; the default route works for everyone.
 */
export const START_DEFAULT = [
  { title: 'Take the check-in: see what you can afford', why: 'A few friendly questions show your price range and the help that makes a home more affordable.', href: '#/plan' },
  { title: 'Open the affordability toolkit', why: 'Every way to lower the price, the cash you need, and the monthly payment.', href: '#/learn/afford' },
  { title: 'Read your top plans', why: 'See the good things, the watch-outs, and the first step for each.', href: '#/results/plans' },
  { title: 'Pick where to borrow', why: 'Lenders that cost the least and work with your down payment help.', href: '#/results/lenders' },
  { title: 'Book a free homebuyer class', why: 'Almost every program requires it, and it\'s free.', href: '#/learn/steps' },
  { title: 'Print your readiness packet', why: 'Bring it to a counselor or lender, so you can get help in one meeting.', href: '#/results/report' },
  { title: 'Follow your timeline', why: 'Add the steps to your calendar and send the ready-made emails.', href: '#/results/timeline' },
];

export const START_PERSONAS = [
  {
    id: 'new', label: 'I\'m just starting',
    note: 'Start with the big picture, then do your check-in.',
    steps: [
      { title: 'Five buyers, one market', why: 'See why it\'s hard for almost everyone, not just you.', href: '#/learn/five-buyers' },
      { title: 'Words lenders use', why: 'AMI, DTI, PMI in plain words.', href: '#/learn/words' },
      { title: 'New California laws', why: 'What changes on Jan 1, 2027, and what it means for you.', href: '#/learn/laws' },
      { title: 'Take the check-in', why: 'See what fits your family.', href: '#/plan' },
      { title: 'Follow Ana and Luis', why: 'A story that walks through every step.', href: '#/learn/story' },
    ],
  },
  {
    id: 'credit', label: 'My credit needs work',
    note: 'Fix the foundation first. It lowers your rate for 30 years.',
    steps: [
      { title: 'Take the check-in', why: 'Your report shows exactly what to fix, with dates.', href: '#/plan' },
      { title: 'Read your 12-month plan', why: 'Credit, debt, and savings targets.', href: '#/results/report' },
      { title: 'Book a free counselor', why: 'They review your credit report with you.', href: '#/learn/steps' },
      { title: 'Learn how rates work', why: 'See what a better score saves you.', href: '#/learn/rates' },
    ],
  },
  {
    id: 'teacher', label: 'I work at a school',
    note: 'School staff have some of the best help in Orange County.',
    steps: [
      { title: 'Help for school staff', why: 'SchoolsFirst $7,500 grant, GSFA Select, and student loan relief.', href: '#/learn/jobs' },
      { title: 'Take the check-in (enter your district)', why: 'Your employer unlocks specific tips.', href: '#/plan' },
      { title: 'Email district HR', why: 'A ready-made email about employee housing is in your timeline.', href: '#/results/timeline' },
    ],
  },
  {
    id: 'health', label: 'I work in health care',
    note: 'Nurses, CNAs, techs, and caregivers.',
    steps: [
      { title: 'Help for health care workers', why: 'GSFA Select gives extra help; CNAs often qualify for city loans.', href: '#/learn/jobs' },
      { title: 'Take the check-in (enter your employer)', why: 'Hospital and UCI Health tips appear.', href: '#/plan' },
      { title: 'Compare loans', why: 'See which loans fit your pay.', href: '#/results/compare' },
    ],
  },
  {
    id: 'safety', label: 'I\'m a firefighter, EMT, or officer',
    note: 'Honest picture: no California-only hero grant, but strong options to stack.',
    steps: [
      { title: 'Help for public safety', why: 'Firefighters First CU, GSFA Select, and Good Neighbor Next Door.', href: '#/learn/jobs' },
      { title: 'Take the check-in', why: 'See your $0-down and job-based options.', href: '#/plan' },
      { title: 'Find a lower rate', why: 'Compare 3 lenders in one week.', href: '#/learn/rates' },
    ],
  },
  {
    id: 'self', label: 'I\'m self-employed or file with an ITIN',
    note: 'You have options, often through mission lenders.',
    steps: [
      { title: 'Private lending, explained', why: 'Bank-statement and ITIN loans, plus red flags to avoid.', href: '#/learn/private' },
      { title: 'Take the check-in', why: 'Answer the "how you\'re paid" question.', href: '#/plan' },
      { title: 'Print your packet', why: 'It lists exactly which documents you need.', href: '#/results/report' },
    ],
  },
  {
    id: 'vet', label: 'I\'m a veteran',
    note: 'VA loans need no down payment.',
    steps: [
      { title: 'Take the check-in (tick "veteran")', why: 'VA and CalVet appear with your fit.', href: '#/plan' },
      { title: 'Compare loans', why: 'See VA side by side with others.', href: '#/results/compare' },
      { title: 'Disability benefits & housing grants', why: 'If you have a service-connected disability.', href: '#/learn/disability' },
    ],
  },
  {
    id: 'disability', label: 'Someone in my home has a disability',
    note: 'Benefits can count as income, and there\'s help to make a home accessible.',
    steps: [
      { title: 'Buyers with a disability', why: 'CalABLE, FHA 203(k), vouchers, and your rights.', href: '#/learn/disability' },
      { title: 'Take the check-in', why: 'Answer "yes" to the disability question.', href: '#/plan' },
    ],
  },
  {
    id: 'owner', label: 'I already have a loan',
    note: 'Save money on the loan you have.',
    steps: [
      { title: 'Pay less interest', why: 'Extra payments, biweekly, and recasting.', href: '#/learn/interest' },
      { title: 'HELOC, home equity, or reverse mortgage?', why: 'Ways to use your equity, and the risks.', href: '#/learn/loan-types' },
      { title: 'Use the calculator', why: 'See your schedule and what extra payments save.', href: '#/calculator' },
    ],
  },
  {
    id: 'give', label: 'I want to help others',
    note: 'Companies and neighbors can fund down payments.',
    steps: [
      { title: 'How the community fund works', why: 'Rules, a simulator, and your after-tax cost.', href: '#/give' },
      { title: 'Tax benefits for givers', why: 'Deductions, employer matching, and policy ideas.', href: '#/give/taxes' },
      { title: 'Donate', why: 'Test mode for now.', href: '#/give/donate' },
    ],
  },
];
