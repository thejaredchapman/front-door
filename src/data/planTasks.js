/**
 * The homebuying checklist: 4 stages, tasks placed by "days before your target date".
 * Dates are suggestions. Real contract deadlines from a purchase agreement always win.
 */
export const STAGES = ['Build your foundation', 'Line up your loan', 'Find a home and make an offer', 'Close and move in'];
/** One Habitat color per stage, used everywhere a stage appears (checklist, calendar, legend). */
export const STAGE_COLORS = [
  { color: '#0099cc', soft: '#e3f4fb', icon: '🧱' },
  { color: '#3aa047', soft: '#e6f4e8', icon: '🏦' },
  { color: '#e55d25', soft: '#fdebe3', icon: '🔑' },
  { color: '#002f6c', soft: '#e3e9f3', icon: '🏡' },
];

export const BASE_TASKS = [
  { id: 'budget', stage: 0, offset: -180, title: 'Pick a monthly home budget you\'re comfortable with', detail: 'Use your home goal as a starting point, decide how much cushion to keep, and choose a payment that still leaves room for life.' },
  { id: 'credit', stage: 0, offset: -170, title: 'Check your credit and start a savings habit', detail: 'Get your free credit reports, dispute any mistakes, and set up an automatic transfer to a "home" savings account. Don\'t open new credit until you close.', link: 'https://www.annualcreditreport.com/' },
  { id: 'counselor', stage: 0, offset: -160, title: 'Meet a free homebuyer counselor', detail: 'A HUD-approved counselor can review your readiness, help with the homebuyer class, and point you to the right programs.', link: 'https://www.hud.gov/counseling' },
  { id: 'path', stage: 1, offset: -110, title: 'Choose the loans and programs to explore', detail: 'Compare conventional, FHA, VA, and down payment help. Ask a lender to confirm you qualify and what the current limits are.' },
  { id: 'quotes', stage: 1, offset: -95, title: 'Get Loan Estimates from at least 3 lenders', detail: 'Ask each one for the same loan amount, type, term, points, and lock period, then type them into the Loan Estimate comparer.', link: 'https://www.consumerfinance.gov/owning-a-home/compare/request-and-review-multiple-loan-estimates/' },
  { id: 'approval', stage: 1, offset: -80, title: 'Get pre-approved and confirm your down payment help', detail: 'Your lender checks income, credit, savings, and program funding. Pre-approval is a strong step, but it isn\'t a final loan promise.' },
  { id: 'search', stage: 2, offset: -60, title: 'Make a short list of homes', detail: 'Compare neighborhoods, HOA dues, insurance quotes, the home\'s condition, and the full monthly cost with your agent.' },
  { id: 'offer', stage: 2, offset: -35, title: 'Make an offer and review the contract', detail: 'Your agent sets the real contract dates. Replace these suggested dates with your contingency and closing deadlines.' },
  { id: 'inspect', stage: 2, offset: -25, title: 'Finish inspections and the appraisal', detail: 'Work with your agent and lender on inspections, the appraisal, and any decisions the contract gives you time for.' },
  { id: 'insurance', stage: 3, offset: -10, title: 'Lock in insurance and review your final loan costs', detail: 'Read your Closing Disclosure carefully and confirm the cash you need to bring. You get at least 3 business days to review it.' },
  { id: 'walkthrough', stage: 3, offset: -2, title: 'Do the final walk-through', detail: 'Check repairs and the home\'s condition. Before you send money, call your escrow officer on a phone number you looked up yourself.' },
  { id: 'close', stage: 3, offset: 0, title: 'Close, get your keys, and set up payments', detail: 'Confirm with escrow that the deed is recorded. Set up your mortgage payment, utilities, and a home repair savings account.' },
];

/** Tasks for each matched plan (fit good/maybe), placed early in the foundation stage. */
export function programTasks(results) {
  return results
    .filter((r) => r.fit !== 'notYet' && r.id !== 'credit-first')
    .map((r, i) => ({
      id: `benefit-${r.id}`,
      stage: 0,
      offset: -150 + Math.min(i, 6) * 3,
      title: `Look into: ${r.name}`,
      detail: r.firstStep || r.simple,
      link: r.url,
      program: true,
    }));
}

const DAY = 86400000;
const startOfDay = (d) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
export const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromIso = (iso) => new Date(`${iso}T12:00:00`);

/**
 * Due date for a task:
 * 1. a date the person set themselves;
 * 2. target 0–179 days away: squeeze the 180-day plan into the time available;
 * 3. target 180+ days away: foundation tasks start right away, the rest count back from the target;
 * 4. otherwise (target already passed): count back from the target.
 */
export function dueDate(task, { start, target, overrides = {} }) {
  if (overrides[task.id]) return fromIso(overrides[task.id]);
  const s = startOfDay(start);
  const tg = startOfDay(target);
  const span = Math.round((tg - s) / DAY);
  if (span >= 0 && span < 180) return new Date(s.getTime() + Math.round(((task.offset + 180) / 180) * span) * DAY);
  if (span >= 180) return task.stage === 0 ? new Date(s.getTime() + (180 + task.offset) * DAY) : new Date(tg.getTime() + task.offset * DAY);
  return new Date(tg.getTime() + task.offset * DAY);
}

export function buildTasks(results, ctx) {
  return [...BASE_TASKS, ...programTasks(results)]
    .map((tk) => ({ ...tk, due: dueDate(tk, ctx) }))
    .sort((x, y) => x.stage - y.stage || x.offset - y.offset);
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const ymd = (d) => isoDay(d).replace(/-/g, '');

/** All-day events (end = next day) for unfinished tasks only. */
export function tasksIcs(tasks, done) {
  const stamp = `${ymd(new Date())}T000000Z`;
  const events = tasks.filter((tk) => !done[tk.id]).map((tk) => [
    'BEGIN:VEVENT',
    `UID:frontdoor-${tk.id}-${ymd(tk.due)}@frontdoor`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(tk.due)}`,
    `DTEND;VALUE=DATE:${ymd(new Date(tk.due.getTime() + DAY))}`,
    `SUMMARY:${esc(`🏠 ${tk.title}`)}`,
    `DESCRIPTION:${esc(`${tk.detail}${tk.link ? `\n${tk.link}` : ''}\n\nSuggested date from Front Door. Your purchase contract deadlines come first.`)}`,
    'END:VEVENT',
  ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Front Door//Plan calendar//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n');
}
