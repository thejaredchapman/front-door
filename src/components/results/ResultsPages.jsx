import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';
import { DEFAULT_ANSWERS } from '../../data/plans';
import { buildReport } from '../../utils/report';
import PageHeader from '../shell/PageHeader';
import ResultsPlans from './ResultsPlans';
import ReadinessPacket from './ReadinessPacket';
import LoanMatrix from '../plan/LoanMatrix';
import TimelinePlanner from '../plan/TimelinePlanner';
import PersonalReport from '../plan/PersonalReport';
import { LenderList } from '../learn/LenderFinder';
import Mascot from '../Mascot';

const TABS = [
  { id: 'plans', label: 'My plans' },
  { id: 'lenders', label: 'Where to borrow' },
  { id: 'compare', label: 'Compare loans' },
  { id: 'timeline', label: 'Timeline & emails' },
  { id: 'report', label: 'Report & packet' },
];

function printOnly(cls) {
  document.body.classList.add(cls);
  const done = () => { document.body.classList.remove(cls); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
}

export default function ResultsPages({ tab = 'plans' }) {
  const t = useT();
  const submitted = useStore((s) => s.planSubmitted);
  const stored = useStore((s) => s.planAnswers);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const ratio = useStore((s) => s.housingRatio ?? 30);
  const r = useMemo(() => buildReport(a, ratio), [a, ratio]);
  const active = TABS.some((x) => x.id === tab) ? tab : 'plans';

  if (!submitted) {
    return (
      <div className="page-narrow">
        <div className="flex justify-center mb-2"><Mascot mood="think" size={130} /></div>
        <PageHeader kicker="Your plan" title="Let's do your check-in first" plain="Answer a few friendly questions so we can see where you are today. Then your plans, timeline, and report show up right here." eli5="Answer a few easy questions first, then your plan shows up here." />
        <a href="#/plan" className="btn-primary btn-lg">{t('Start my check-in')} →</a>
      </div>
    );
  }

  return (
    <div className="page">
      {active === 'plans' && (
        <div className="flex items-center gap-3 mb-2 print:hidden">
          <Mascot mood="cheer" size={92} />
          <p className="mascot-bubble">{t('Yay! Your plan is ready. Let\'s look together!')} 🎉</p>
        </div>
      )}
      <PageHeader kicker="Your plan" title={TABS.find((x) => x.id === active).label}>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <a href="#/plan/1" className="btn-link">{t('Edit my answers')}</a>
          <span className="text-muted">{t('Readiness score')}: <strong className="num">{r.total}/100</strong> · {t(r.stage)}</span>
        </div>
      </PageHeader>

      <nav className="tabs print:hidden" aria-label={t('Your plan sections')}>
        {TABS.map((x, i) => (
          <a key={x.id} href={`#/results/${x.id}`} aria-current={active === x.id ? 'page' : undefined} className={`tab ${active === x.id ? 'is-active' : ''}`}>
            <span className="num tab-n">{i + 1}</span>{t(x.label)}
          </a>
        ))}
      </nav>

      <div className="rise">
        {active === 'plans' && <ResultsPlans r={r} />}
        {active === 'lenders' && (
          <>
            <p className="lede mb-6">{t('Lenders sorted for you: ones you can join first, then the ones that work with the down payment help in your plan.')}</p>
            <LenderList a={a} results={r.results} />
            <a href="#/learn/lenders" className="btn-link inline-block mt-6">{t('What OC buyers actually paid, and how to shop')} →</a>
          </>
        )}
        {active === 'compare' && <LoanMatrix />}
        {active === 'timeline' && <TimelinePlanner answers={a} results={r.results} categoryLabel={r.ctx.category.label} />}
        {active === 'report' && (
          <>
            <div className="flex flex-wrap gap-3 mb-6 print:hidden">
              <button type="button" className="btn-primary" onClick={() => printOnly('print-report-only')}>🖨️ {t('Print my report')}</button>
              <button type="button" className="btn-ghost" onClick={() => printOnly('print-packet-only')}>📋 {t('Print my readiness packet')}</button>
            </div>
            <div className="report-section"><PersonalReport embedded /></div>
            <div className="packet-section mt-14"><ReadinessPacket a={a} r={r} /></div>
          </>
        )}
      </div>

      {active !== 'report' && (
        <a href={`#/results/${TABS[TABS.findIndex((x) => x.id === active) + 1].id}`} className="cta-band mt-12">
          <span className="display text-2xl font-bold">{t('Next')}: {t(TABS[TABS.findIndex((x) => x.id === active) + 1].label)}</span>
          <span className="flip-rtl" aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}
