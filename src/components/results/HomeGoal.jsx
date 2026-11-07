import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { formatCurrency } from '../../utils/formatters';
import { buildGoal } from '../../utils/homeGoal';
import { GOAL, MYHOME, CHECKED_ON } from '../../data/goalRules';

const fmtDate = (d) => d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

const STATUS = {
  ready: { icon: '✅', label: 'On track' },
  'no-goal': { icon: '🌱', label: 'Start with the basics' },
  'over-budget': { icon: '⚠️', label: 'Over your monthly budget' },
  'no-saving': { icon: '🐷', label: 'Add a monthly savings amount' },
  'beyond-horizon': { icon: '⏳', label: 'More than 10 years away' },
  'program-limit': { icon: '🚧', label: 'Above the program limit' },
};

const PROGRAM_STATUS = {
  potential: { label: 'Potential match', className: 'badge-good' },
  review: { label: 'More details needed', className: 'badge-maybe' },
  'not-matched': { label: 'Not matched by these answers', className: 'badge-no' },
};

function ReadyLine({ tl }) {
  const t = useT();
  if (tl.status === 'ready') {
    return tl.months === 0
      ? <p>{t('Your savings already cover the cash for this price. Ready to talk to a lender (not a promise to close).')}</p>
      : <p>{t('Savings ready around {date} ({n} months).', { date: fmtDate(tl.date), n: tl.months })}</p>;
  }
  const why = {
    'no-goal': 'With these numbers, the next step is building savings, paying down debt, or meeting a free counselor. This is not a "no" from any lender.',
    'over-budget': 'The monthly cost is above your budget at this price.',
    'no-saving': 'You need {gap} more cash, and no monthly savings amount is set yet.',
    'beyond-horizon': 'At this savings pace it would take more than 10 years. A program or a bigger savings amount can shorten it.',
    'program-limit': 'This price is above the loan limit for this program.',
  }[tl.status];
  return <p>{t(why, { gap: formatCurrency(tl.gap) })}</p>;
}

function CostBreakdown({ cost }) {
  const t = useT();
  const rows = [
    ['Loan payment (principal + interest)', cost.pi],
    ['Property tax', cost.tax],
    ['Home insurance', cost.insurance],
    ['HOA dues', cost.hoa],
    ['Mortgage insurance', cost.mi],
    ['Upkeep and repairs (set aside)', cost.maint],
  ].filter(([, v]) => v > 0.5);
  return (
    <ul className="text-sm space-y-1">
      {rows.map(([l, v]) => <li key={l} className="flex justify-between gap-3"><span>{t(l)}</span><span className="num">{formatCurrency(v)}</span></li>)}
      <li className="flex justify-between gap-3 font-bold border-t border-rule pt-1"><span>{t('Total per month')}</span><span className="num">{formatCurrency(cost.total)}</span></li>
    </ul>
  );
}

function ProgramCard({ p, base }) {
  const t = useT();
  const st = PROGRAM_STATUS[p.status];
  const name = p.id === 'va' ? 'VA home loan' : 'CalHFA MyHome';
  return (
    <article className="card">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <span className={`badge ${st.className}`}>{t(st.label)}</span>
      </div>
      <h4 className="display text-xl font-bold">{t(name)}</h4>
      {!p.modelable ? (
        <p className="text-sm mt-1">
          {p.id === 'va'
            ? t('Tell us your military connection in the check-in, and ask a VA lender for your Certificate of Eligibility. We only show numbers once it looks like a match.')
            : t('We show numbers for MyHome only for first-time buyers in Orange County with a known credit score of 680+, a house or condo, and at least 3% down. A CalHFA-approved lender makes the final call.')}
        </p>
      ) : (
        <>
          <dl className="plan-facts">
            <div>
              <dt>{t('Home goal by your date')}</dt>
              <dd className="num">{formatCurrency(p.goal.price)} {p.priceChange !== 0 && <span className={p.priceChange > 0 ? 'text-[var(--good,#3aa047)]' : ''}>({p.priceChange > 0 ? '+' : '−'}{formatCurrency(Math.abs(p.priceChange))})</span>}</dd>
            </div>
            <div>
              <dt>{t('At your current goal price')}</dt>
              <dd>
                {p.timeline.status === 'ready'
                  ? (p.monthsSooner > 0 ? t('Ready {n} months sooner', { n: p.monthsSooner }) : t('Ready around {date}', { date: fmtDate(p.timeline.date) }))
                  : t(STATUS[p.timeline.status].label)}
              </dd>
            </div>
          </dl>
          <p className="text-sm mt-2 text-muted">
            {p.id === 'va'
              ? t('Modeled with $0 down, no monthly mortgage insurance, and a {fee}% funding fee added to the loan.', { fee: p.timeline.feePct })
              : t('Modeled with {pct}% help toward down payment and closing costs, {limit} OC income limit. MyHome is a loan you repay when you sell or refinance, not a grant.', { pct: MYHOME.pct, limit: formatCurrency(MYHOME.ocIncomeLimit) })}
          </p>
        </>
      )}
      <p className="text-xs text-muted mt-2">{t('Base goal for comparison: {price}. One program at a time; programs are not combined.', { price: formatCurrency(base) })}</p>
    </article>
  );
}

export default function HomeGoal({ a }) {
  const t = useT();
  const ratio = useStore((s) => s.housingRatio ?? 30);
  const setPlanAnswer = useStore((s) => s.setPlanAnswer);
  const saveOn = useStore((s) => s.saveOnDevice);
  const [saving, setSaving] = useState(a.monthlySaving);
  const what = useMemo(() => ({ ...a, monthlySaving: saving }), [a, saving]);
  const g = useMemo(() => buildGoal(what, ratio), [what, ratio]);
  const tl = g.baseTimeline;
  const st = STATUS[tl.status];
  const shown = g.programs.filter((p) => p.status !== 'not-matched');
  const none = g.base.price <= 0;

  return (
    <section className="mt-8" aria-labelledby="goal-title">
      <h2 id="goal-title" className="display text-3xl font-bold mb-1">{t('Your home goal')}</h2>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="This price fits both your monthly budget and the cash you'll have by your target date: down payment, about 3% closing costs, and the cushion you want to keep. It includes taxes, insurance, mortgage insurance, and 1% a year for upkeep. It's a planning guide, not a loan approval."
        eli5="This is the home price that fits your money: what you can pay each month, and what you'll have saved by then."
      />
      <div className="stat-row">
        <div>
          <p className="field-label">{t('Home goal by {date}', { date: fmtDate(g.base.targetDate) })}</p>
          <p className="display stat-v text-[var(--accent)]">{formatCurrency(g.base.price)}</p>
        </div>
        <div>
          <p className="field-label">{t('Monthly cost to own')}</p>
          <p className="display stat-v">{none ? '—' : formatCurrency(tl.cost.total)}</p>
          <p className="text-xs text-muted">{t('Your budget: up to {cap}', { cap: formatCurrency(g.cap) })}</p>
        </div>
        <div>
          <p className="field-label">{t('Cash needed at closing')}</p>
          <p className="display stat-v">{none ? '—' : formatCurrency(tl.cash)}</p>
          <p className="text-xs text-muted">{t('Includes your {r} cushion', { r: formatCurrency(a.reserve) })}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card">
          <p className="font-bold text-lg"><span aria-hidden="true">{st.icon}</span> {t(st.label)}</p>
          <ReadyLine tl={tl} />
          <label htmlFor="goal-saving" className="field-label mt-4 block">{t('Try a different monthly savings amount')}: <span className="num">{formatCurrency(saving)}</span></label>
          <input id="goal-saving" type="range" min={0} max={Math.max(3000, a.monthlySaving * 2)} step={25} value={saving} onChange={(e) => setSaving(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
          {saving !== a.monthlySaving && (
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              {saveOn && <button type="button" className="btn-link" onClick={() => setPlanAnswer('monthlySaving', saving)}>{t('Keep this amount')}</button>}
              <button type="button" className="btn-link" onClick={() => setSaving(a.monthlySaving)}>{t('Back to my answer')}</button>
            </div>
          )}
        </div>
        <div className="card">
          <p className="field-label">{t('Where the monthly cost goes')}</p>
          {none ? <p className="text-sm">{t('Once your savings and budget support a price, the monthly costs show up here.')}</p> : <CostBreakdown cost={tl.cost} />}
          <p className="text-xs text-muted mt-2">{t('{down}% down at {rate}% for 30 years. Change these in the check-in.', { down: a.downPct, rate: a.rate })}</p>
        </div>
      </div>

      {shown.length > 0 && (
        <div className="mt-6">
          <h3 className="display text-2xl font-bold mb-1">{t('What if you used a program?')}</h3>
          <p className="text-sm text-muted mb-3">{t('Checked {date}. A match here is a reason to call, not a promise of funding. The program and your lender decide.', { date: CHECKED_ON })}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {shown.map((p) => <ProgramCard key={p.id} p={p} base={g.base.price} />)}
          </div>
        </div>
      )}
      <p className="text-xs text-muted mt-3">{t('Assumes {tax}% property tax, {close}% closing costs, {mi}% mortgage insurance under 20% down, and no change in prices, rates, or income. Savings earn no interest in this estimate.', { tax: GOAL.taxPct, close: GOAL.closingPct, mi: GOAL.miPct })}</p>
    </section>
  );
}
