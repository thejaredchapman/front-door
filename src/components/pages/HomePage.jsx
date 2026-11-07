import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { useUpdates } from '../../hooks/useUpdates';
import { NewsItem } from './NewsPage';
import Mascot from '../Mascot';

const DOORS = [
  { href: '#/plan', icon: '🧭', title: 'Find my plan', body: 'A quick, friendly check-in to see where you are today, plus the loans and help that fit your family, a timeline, and your own report.', cta: 'See where I\'m at', primary: true },
  { href: '#/learn', icon: '📚', title: 'Learn', body: 'Short pages in plain words.', cta: 'Browse' },
  { href: '#/calculator', icon: '🧮', title: 'Calculator', body: 'Your monthly payment, step by step.', cta: 'Open' },
  { href: '#/news', icon: '📰', title: 'News', body: 'Rates, programs, and new laws.', cta: 'Read' },
  { href: '#/give', icon: '💛', title: 'Give', body: 'Help a neighbor buy a home.', cta: 'See how' },
];

const STEPS = [
  { title: 'Answer', body: 'Tell us about your family, money, credit, and job.' },
  { title: 'See your options', body: 'Plans that fit, with good things and watch-outs.' },
  { title: 'Follow your plan', body: 'A calendar, emails to send, and a 12-month report.' },
];

const FACTS = [
  { v: '10 : 1', l: 'OC home prices vs. income (4 : 1 is affordable)' },
  { v: '$148,850', l: '"Low income" limit for a family of 4 in OC, 2026' },
  { v: '30+', l: 'programs, loans, and helpers in one place' },
];

export default function HomePage() {
  const t = useT();
  const submitted = useStore((s) => s.planSubmitted);
  const { news } = useUpdates();
  const latest = (news?.items || []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="home">
      <section className="home-hero rise">
        <div>
        <p className="kicker mb-4">{t('Free help for California homebuyers · Orange County first')}</p>
        <h1 className="display home-title">
          {t('Hi! Let\'s find')}<br />
          <em>{t('your way home.')}</em>
        </h1>
        <Explain
          className="lede mt-5 max-w-2xl"
          plain="Free help for working families, including nurses, teachers, firefighters, public workers, and anyone who doesn't earn a lot. No sign-up. Your answers stay on your device."
          eli5="We help families figure out how to buy a home, step by step, for free."
        />
        </div>
        <div className="hero-mascot flex flex-col items-center gap-2">
          <p className="mascot-bubble">{t('Hi! I\'m Doorie. Let\'s find your front door!')} 🏡</p>
          <Mascot mood="wave" size={190} label={t('Doorie, a smiling little house, waving hello')} />
        </div>
      </section>

      <section aria-label={t('Where to go')} className="doors">
        {DOORS.map((d, i) => (
          <a key={d.href} href={d.primary && submitted ? '#/results/plans' : d.href} className={`door ${d.primary ? 'door-primary' : ''} rise`} style={{ '--i': i + 1 }}>
            <span className="door-icon" aria-hidden="true">{d.icon}</span>
            <span className="display door-title">{t(d.primary && submitted ? 'See my plan' : d.title)}</span>
            <span className="door-body">{t(d.body)}</span>
            <span className="door-cta">{t(d.cta)} <span aria-hidden="true" className="flip-rtl">→</span></span>
          </a>
        ))}
      </section>

      <p className="mt-5 text-center">
        <a href="#/start" className="btn-ghost">{t('Not sure where to begin? Start here')} →</a>
      </p>

      <section className="home-how" aria-labelledby="how-title">
        <h2 id="how-title" className="kicker mb-5">{t('How it works')}</h2>
        <ol className="how-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="num how-n">{i + 1}</span>
              <span className="display how-title">{t(s.title)}</span>
              <span className="how-body">{t(s.body)}</span>
            </li>
          ))}
        </ol>
      </section>

      {latest.length > 0 && (
        <section className="home-news" aria-labelledby="news-title">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h2 id="news-title" className="kicker">{t('Latest news')}</h2>
            <a href="#/news" className="btn-link">{t('All news')} →</a>
          </div>
          <div className="news-strip">
            {latest.map((n) => <a key={n.id} href="#/news" className="news-card"><NewsItem item={n} compact /></a>)}
          </div>
        </section>
      )}

      <section className="facts" aria-label={t('Quick facts')}>
        {FACTS.map((f) => (
          <div key={f.l} className="fact">
            <span className="display fact-v">{f.v}</span>
            <span className="fact-l">{t(f.l)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
