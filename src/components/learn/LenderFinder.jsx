import { useMemo } from 'react';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { DEFAULT_ANSWERS, evaluatePlans } from '../../data/plans';
import { HMDA_OC_2024, HMDA_SOURCE, lendersFor } from '../../data/lenders';
import { formatCurrency } from '../../utils/formatters';

function HmdaChart() {
  const t = useT();
  const max = Math.max(...HMDA_OC_2024.map((h) => h.costs));
  const rows = [...HMDA_OC_2024].sort((a, b) => a.costs - b.costs);
  return (
    <figure className="card">
      <figcaption className="field-label mb-3">{t('What Orange County buyers actually paid in 2024 (median closing costs)')}</figcaption>
      <ul className="space-y-2">
        {rows.map((h) => (
          <li key={h.lender} className="grid grid-cols-[minmax(8rem,14rem)_1fr_auto] items-center gap-3 text-sm">
            <span className="truncate">{h.lender}</span>
            <span className="h-4 bg-paper border border-rule relative"><span className="absolute inset-y-0 start-0 bg-[var(--accent)]" style={{ width: `${(h.costs / max) * 100}%` }} /></span>
            <span className="num">{formatCurrency(h.costs)} · <span className={h.spread < 0 ? 'mark-ok' : 'mark-no'}>{h.spread > 0 ? '+' : ''}{h.spread.toFixed(2)}%</span></span>
          </li>
        ))}
      </ul>
      <Explain
        className="text-xs text-muted mt-3"
        plain="The percentage is the median 'rate spread': how far each lender's rates were above (+) or below (−) the market average. Lower is cheaper. FHA loans cost more upfront (about $22,000–$25,000 at the biggest FHA lenders) because the upfront mortgage insurance counts as a cost."
        eli5="Shorter bars and minus numbers mean the lender was cheaper for people who borrowed there."
      />
      <a href={HMDA_SOURCE.url} target="_blank" rel="noreferrer" className="text-xs underline">{t('Source')}: {HMDA_SOURCE.label}</a>
    </figure>
  );
}

export function LenderList({ a, results, limit }) {
  const t = useT();
  const list = lendersFor(a, results);
  return (
    <div className="space-y-4">
      {(limit ? list.slice(0, limit) : list).map((l) => (
        <article key={l.id} className={`plan-card ${l.canJoin ? '' : 'is-dim'}`}>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`badge ${l.canJoin ? 'badge-good' : 'badge-no'}`}>{l.canJoin ? t('You can likely join or apply') : t('Membership may not fit you')}</span>
            <span className="badge badge-outline">{t(l.type)}</span>
          </div>
          <h3 className="display text-2xl font-semibold">{l.name}</h3>
          <p className="text-sm text-muted">{t(l.who)}</p>
          <p className="mt-2">{t(l.perks)}</p>
          {l.pairs.length > 0 && (
            <p className="mt-3 note text-sm"><strong>{t('Works with your plan')}:</strong> {l.pairs.map((x) => t(x)).join(' · ')}</p>
          )}
          {l.products.length > 0 && (
            <table className="w-full text-sm mt-3">
              <thead><tr className="text-start border-b border-ink"><th className="py-1 text-start">{t('Published example')}</th><th className="py-1 text-start">{t('Rate')}</th><th className="py-1 text-start">APR</th><th className="py-1 text-start">{t('Points')}</th></tr></thead>
              <tbody>
                {l.products.map((p) => (
                  <tr key={p.name} className="border-b border-rule"><td className="py-1">{t(p.name)}</td><td className="num">{p.rate}%</td><td className="num">{p.apr}%</td><td className="num">{p.points ?? '—'}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="text-xs text-muted mt-2">
            {t('Rates as of')}: {l.asOf}
            {l.hmda && <> · {t('2024 OC median closing costs')}: <span className="num">{formatCurrency(l.hmda.costs)}</span></>}
          </p>
          <a href={l.url} target="_blank" rel="noreferrer" className="btn-link inline-block mt-2">{t('See their rates')} →</a>
        </article>
      ))}
    </div>
  );
}

export default function LenderFinder() {
  const t = useT();
  const stored = useStore((s) => s.planAnswers);
  const submitted = useStore((s) => s.planSubmitted);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const { results } = useMemo(() => evaluatePlans(a), [a]);

  return (
    <div>
      <ol className="ledger-list mb-8">
        {[
          { title: 'Start with credit unions and nonprofit lenders', plain: 'In Orange County, credit unions like SchoolsFirst and Navy Federal had some of the lowest real costs in 2024. Nonprofit lenders like NeighborWorks OC pair loans with down payment help and coaching.', eli5: 'Small, member-owned banks often charge less.' },
          { title: 'Match the lender to your help', plain: 'Down payment programs only work with certain lenders: CalHFA programs need a CalHFA-approved lender, the SchoolsFirst grant needs a SchoolsFirst loan, and bank grants need that bank. Pick the lender that unlocks the most help, then compare its total cost.', eli5: 'Some helpers only work with certain banks. Pick a bank that works with your helpers.' },
          { title: 'Get 3 quotes in the same week', plain: 'Ask for official Loan Estimates from at least three lenders on the same day. Multiple mortgage credit checks in a short window count as one. Compare the APR, points, and cash to close, not just the rate.', eli5: 'Ask three banks for their price in the same week, and look at the whole receipt.' },
          { title: 'Published rates are for strong credit', plain: 'Advertised "as low as" rates assume high scores (740–780) and big down payments. Use them to rank lenders, then get your own quote.', eli5: 'The prices on websites are for people with great report cards. Ask for your own price.' },
        ].map((x, i) => (
          <li key={x.title}>
            <span className="num ledger-n">{String(i + 1).padStart(2, '0')}</span>
            <div><h2 className="font-semibold text-xl">{t(x.title)}</h2><Explain plain={x.plain} eli5={x.eli5} className="mt-1" /></div>
          </li>
        ))}
      </ol>

      <HmdaChart />

      <h2 className="display text-3xl font-extrabold mt-12 mb-2">{t('Lenders serving Orange County')}</h2>
      <p className="text-muted mb-5">
        {submitted ? t('Sorted for you: places you can join first, then the ones that work with your down payment help.') : t('Take the check-in to sort these for you and see which work with your down payment help.')}
      </p>
      <LenderList a={a} results={results} />
      <a href="#/learn/rates" className="btn-link inline-block mt-6">{t('Compare your quotes side by side')} →</a>
    </div>
  );
}
