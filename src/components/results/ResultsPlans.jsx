import { useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import { START_FILTERS } from '../../data/plans';
import { formatCurrency } from '../../utils/formatters';
import HousingRatioSlider from '../HousingRatioSlider';

const FIT = {
  good: { label: 'Good fit', className: 'badge-good' },
  maybe: { label: 'Maybe: check a few things', className: 'badge-maybe' },
  notYet: { label: 'Not a fit right now', className: 'badge-no' },
};
const MARK = { ok: '✓', maybe: '?', no: '✗' };

const FILTER_NOTES = {
  zeroDown: {
    plain: '"Zero down" means you don\'t pay the down payment yourself. You still need some cash: a deposit when your offer is accepted, inspection fees, and closing costs (2–5%). Programs like ZIP, seller credits, and grants can cover much of it.',
    eli5: 'A helper pays your first slice, but you still need a little money for the small fees at the end.',
  },
  job: {
    plain: 'Help based on what you do: public service, the military, or your employer. Also ask HR: "Do we offer any home-buying benefit?"',
    eli5: 'Some helpers say thank you for your job. Ask your boss\'s office about home help too.',
  },
  org: {
    plain: 'Credit unions often have low- or zero-down loans for members, and joining is usually easy. Habitat, tribes, the military, and the Housing Authority have their own paths.',
    eli5: 'A credit union is like a bank club. Members can get special home loans.',
  },
  private: {
    plain: 'Private and mission lenders help self-employed workers, ITIN filers, and families borrowing from relatives. Check every lender\'s license, and ask about balloon payments and prepayment penalties.',
    eli5: 'Some loans come from private lenders or family. Some are great, some are tricky. Check before you sign.',
  },
};

function PlanCard({ p }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const fit = FIT[p.fit];
  return (
    <article className={`plan-card ${p.fit === 'notYet' ? 'is-dim' : ''}`}>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className={`badge ${fit.className}`}>{t(fit.label)}</span>
        <span className="badge badge-outline">{t(p.kind)}</span>
      </div>
      <h3 className="display text-2xl font-semibold leading-tight">{t(p.name)}</h3>
      <p className="mt-1">{t(p.simple)}</p>
      <dl className="plan-facts">
        <div><dt>{t('Cash up front')}</dt><dd>{t(p.down)}</dd></div>
        {p.fit !== 'notYet' && <div><dt>{t('First step')}</dt><dd>{t(p.firstStep)}</dd></div>}
      </dl>
      <button type="button" className="btn-link mt-3" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? t('Show less') : t('Why, good things & watch-outs')}
      </button>
      {open && (
        <div className="grid md:grid-cols-3 gap-5 mt-4 pt-4 border-t border-rule text-sm">
          <div>
            <p className="field-label">{t('Why (based on your answers)')}</p>
            <ul className="space-y-1">
              {p.reasons.map((r) => (
                <li key={r.text} className="flex gap-2">
                  <span aria-hidden="true" className={`mark-${r.level} font-bold`}>{MARK[r.level]}</span>
                  <span>{t(r.text)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="field-label">👍 {t('Good things')}</p>
            <ul className="list-disc ps-4 space-y-1">{p.pros.map((x) => <li key={x}>{t(x)}</li>)}</ul>
          </div>
          <div>
            <p className="field-label">👎 {t('Watch out for')}</p>
            <ul className="list-disc ps-4 space-y-1">{p.cons.map((x) => <li key={x}>{t(x)}</li>)}</ul>
          </div>
          <a href={p.url} target="_blank" rel="noreferrer" className="btn-link md:col-span-3">{t('Official info')} →</a>
        </div>
      )}
    </article>
  );
}

export default function ResultsPlans({ r }) {
  const t = useT();
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const open = (tag) => r.results.filter((p) => p.fit !== 'notYet' && (tag === 'all' || p.tags?.includes(tag)));
  const list = r.results.filter((p) => filter === 'all' || p.tags?.includes(filter));
  const visible = showAll ? list : list.filter((p) => p.fit !== 'notYet');
  const hidden = list.length - visible.length;
  const goodCount = r.results.filter((p) => p.fit === 'good' && p.id !== 'credit-first').length;

  return (
    <div>
      <div className="stat-row">
        <div><p className="field-label">{t('Your income group')}</p><p className="display stat-v text-[var(--accent)]">{t(r.ctx.category.label)}</p></div>
        <div><p className="field-label">{t('Affordable monthly payment')}</p><p className="display stat-v">{formatCurrency(r.now.budget)}</p></div>
        <div><p className="field-label">{t('Price you can afford')}</p><p className="display stat-v">{formatCurrency(r.now.price)}</p></div>
      </div>
      <div className="card mt-4"><HousingRatioSlider income={r.ctx.monthlyIncome * 12} id="ratio-results" compact /></div>
      <p className="lede my-6">
        {goodCount > 0
          ? t('{n} plans fit you right now. Most people combine 2–3.', { n: goodCount })
          : t('No plan fits perfectly yet, and that\'s okay. Start with the "maybe" plans and your report.')}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t('Ways to get started')}>
        {START_FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={`chip ${filter === f.id ? 'chip-on' : ''}`}>
            {t(f.label)} <span className="num text-xs opacity-70">{open(f.id).length}</span>
          </button>
        ))}
      </div>
      {FILTER_NOTES[filter] && <Explain {...FILTER_NOTES[filter]} className="note mt-4" />}

      <div className="space-y-4 mt-6">
        {visible.map((p) => <PlanCard key={p.id} p={p} />)}
        {visible.length === 0 && <p className="note">{t('None of these fit you right now. Try "$0 down" plans, which work for any job, or join a credit union.')}</p>}
      </div>
      {hidden > 0 && (
        <button type="button" className="btn-link mt-4" onClick={() => setShowAll(!showAll)}>
          {showAll ? t('Hide plans that don\'t fit') : t('Show {n} plans that don\'t fit yet', { n: hidden })}
        </button>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        <div className="card">
          <h2 className="kicker mb-3">{t('Other helpers to call')}</h2>
          <ul className="space-y-3">
            {r.helpers.map((h) => (
              <li key={h.name}>
                <p className="font-semibold">{h.url ? <a href={h.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{t(h.name)}</a> : t(h.name)}</p>
                <p className="text-sm text-muted">{t(h.what)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="kicker mb-3">{t('Next')}</h2>
          <ul className="space-y-3">
            <li><a className="btn-link" href="#/results/compare">{t('Compare every loan side by side')} →</a></li>
            <li><a className="btn-link" href="#/results/timeline">{t('See your calendar and emails to send')} →</a></li>
            <li><a className="btn-link" href="#/results/report">{t('Read your personal report and packet')} →</a></li>
            <li><a className="btn-link" href="#/learn/rates">{t('Find a lender with a lower rate')} →</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
