import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import { TEAM } from '../../data/team';

const PROBLEM = [
  { v: '$1.3M+', l: 'typical Orange County home price' },
  { v: '10 : 1', l: 'home prices vs. income (about 4 : 1 is affordable)' },
  { v: '30+', l: 'programs from dozens of agencies, each with its own rules, PDFs, and jargon' },
];

const STEPS = [
  {
    icon: '🧮', title: 'Start from what a family can truly afford',
    plain: 'Most tools show the most a bank will lend. We start from a safe payment (30–35% of income, all debts under 36%) and count every monthly cost: taxes, insurance, mortgage insurance, HOA, and upkeep.',
    eli5: 'We find a house payment that still leaves money for food and fun.',
    href: '#/learn/afford', cta: 'Affordability toolkit',
  },
  {
    icon: '📚', title: 'Put all the help in one place, and check it',
    plain: 'We gathered 30+ programs and a library of 60 official documents (CalHFA, County of Orange, cities, Habitat OC, HUD, VA, and more). Key numbers are checked against the source PDFs, and every program is labeled open, closed, or "call first."',
    eli5: 'We read the official papers so families don\'t have to, and we mark which helpers are open.',
    href: '#/learn/documents', cta: 'Search the official documents',
  },
  {
    icon: '🧭', title: 'Make it personal with a friendly check-in',
    plain: 'Five short steps about family, money, goals, credit, work, and where you want to live. Out comes a home goal, a "ready by" date, the plans that fit, and what VA or CalHFA MyHome would change.',
    eli5: 'Answer easy questions and get your own plan.',
    href: '#/plan', cta: 'Take the check-in',
  },
  {
    icon: '💬', title: 'Explain it in plain words, in your language',
    plain: 'Every page has an "Explain it to me" button and six languages. Doorie, our house mascot, answers home-loan questions and quotes the official documents with page numbers.',
    eli5: 'Simple words, your language, and a friendly helper named Doorie.',
    href: '#/learn/words', cta: 'Money words, simply',
  },
  {
    icon: '📅', title: 'Turn it into action',
    plain: 'A dated checklist with a calendar file, emails to send to providers, a Loan Estimate comparer, today\'s posted lender rates, and a readiness packet to bring to a counselor.',
    eli5: 'A to-do list with dates, so you know what to do next.',
    href: '#/results/timeline', cta: 'See the plan calendar',
  },
  {
    icon: '🔒', title: 'Keep it free, private, and current',
    plain: 'Everything runs in the browser for $0 per visitor, with no sign-up and nothing sent to lenders. AI is only used when someone taps "Summarize with AI" (about $0.0003 an answer). A daily check flags changed program pages for a person to review.',
    eli5: 'It\'s free, it keeps your secrets, and it stays up to date.',
    href: '#/learn/about', cta: 'How this was built',
  },
];

export default function HowWeSolved() {
  const t = useT();
  return (
    <div className="space-y-10">
      <section aria-labelledby="problem-title">
        <h2 id="problem-title" className="display text-3xl font-bold mb-2">{t('The problem')}</h2>
        <Explain
          className="lede max-w-3xl mb-4"
          plain="Working families in Orange County, like teachers, nurses, firefighters, and public workers, are priced out of buying a home. Help exists, but it's scattered across dozens of agencies, written in jargon, and it's hard to tell what's open or what you'd qualify for. Many websites just sell your information to lenders."
          eli5="Houses cost too much, and the helpers are hard to find and hard to understand."
        />
        <div className="facts !mt-0">
          {PROBLEM.map((f) => (
            <div key={f.l} className="fact"><span className="display fact-v">{f.v}</span><span className="fact-l">{t(f.l)}</span></div>
          ))}
        </div>
      </section>

      <section aria-labelledby="solve-title">
        <h2 id="solve-title" className="display text-3xl font-bold mb-4">{t('How we solved it')}</h2>
        <ol className="solve-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card">
              <p className="flex items-center gap-2"><span className="num tab-n">{i + 1}</span><span aria-hidden="true" className="text-2xl">{s.icon}</span></p>
              <h3 className="display text-xl font-bold mt-2">{t(s.title)}</h3>
              <Explain plain={s.plain} eli5={s.eli5} className="text-sm mt-1" />
              <a href={s.href} className="btn-link inline-block mt-2">{t(s.cta)} →</a>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="result-title" className="card">
        <h2 id="result-title" className="display text-2xl font-bold mb-2">{t('The result')}</h2>
        <p>{t('A family can go from "we can\'t afford anything here" to a realistic price, a date, the programs that fit, and a step-by-step plan, in about 10 minutes, for free, in their own language.')}</p>
      </section>

      <section aria-labelledby="team-title">
        <h2 id="team-title" className="display text-2xl font-bold mb-3">{t('Built by')}</h2>
        <ul className="flex flex-wrap gap-2">
          {TEAM.map((n) => <li key={n} className="chip !cursor-default">{n}</li>)}
        </ul>
        <p className="text-sm text-muted mt-3">{t('For the Habitat for Humanity of Orange County hackathon (Lane 3 · Fund it), with help from Claude Code.')}</p>
      </section>
    </div>
  );
}
