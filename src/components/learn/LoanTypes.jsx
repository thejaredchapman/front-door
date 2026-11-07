import { useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import { LOAN_TYPE_GROUPS, LOAN_TYPES } from '../../data/loanTypes';

function TypeCard({ x }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <article className="plan-card">
      <h3 className="display text-2xl font-semibold leading-tight">{t(x.name)}</h3>
      <p className="mt-1">{t(x.what)}</p>
      <p className="text-sm text-muted mt-1"><strong>{t('Who it\'s for')}:</strong> {t(x.who)}</p>
      <Explain plain={x.plain} eli5={x.eli5} className="mt-3" />
      <p className="note text-sm mt-3"><strong>{t('If money is tight')}:</strong> {t(x.lowIncome)}</p>
      <button type="button" className="btn-link mt-3" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? t('Show less') : t('Typical terms, good things & watch-outs')}
      </button>
      {open && (
        <div className="grid md:grid-cols-3 gap-5 mt-4 pt-4 border-t border-rule text-sm">
          <div><p className="field-label">{t('Typical terms')}</p><p>{t(x.typical)}</p></div>
          <div><p className="field-label">👍 {t('Good things')}</p><ul className="list-disc ps-4 space-y-1">{x.pros.map((p) => <li key={p}>{t(p)}</li>)}</ul></div>
          <div><p className="field-label">👎 {t('Watch out for')}</p><ul className="list-disc ps-4 space-y-1">{x.cons.map((p) => <li key={p}>{t(p)}</li>)}</ul></div>
          {x.url && <a href={x.url} target="_blank" rel="noreferrer" className="btn-link md:col-span-3">{t('Official info')} →</a>}
        </div>
      )}
    </article>
  );
}

export default function LoanTypes() {
  const t = useT();
  const [group, setGroup] = useState('buy');
  const g = LOAN_TYPE_GROUPS.find((x) => x.id === group);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t('What are you trying to do?')}>
        {LOAN_TYPE_GROUPS.map((x) => (
          <button key={x.id} type="button" aria-pressed={group === x.id} onClick={() => setGroup(x.id)} className={`chip ${group === x.id ? 'chip-on' : ''}`}>{t(x.title)}</button>
        ))}
      </div>
      <p className="lede mb-6">{t(g.note)}</p>
      <div className="space-y-4">
        {LOAN_TYPES.filter((x) => x.group === group).map((x) => <TypeCard key={x.id} x={x} />)}
      </div>
      {group === 'buy' && (
        <p className="mt-6 text-sm">
          {t('Looking for FHA, VA, USDA, conventional 3% down, CalHFA, or private loans?')}{' '}
          <a href="#/results/compare" className="btn-link">{t('See them side by side in the loan matrix')} →</a>
        </p>
      )}
      <p className="text-xs text-muted mt-8">{t('Typical terms are general 2026 ranges for education, not quotes. Ask lenders for a written Loan Estimate.')}</p>
    </div>
  );
}
