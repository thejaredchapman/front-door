import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { DEFAULT_ANSWERS, CREDIT_BANDS } from '../../data/plans';
import { formatCurrency } from '../../utils/formatters';

const POINTS = [['all', 'Any points'], ['none', 'No points'], ['one', 'Up to 1 point']];
const KINDS = [['all', 'All loans'], ['conventional_fixed', 'Conventional'], ['fha_fixed', 'FHA'], ['va', 'VA']];
const SORTS = [['fit', 'Closest to my situation'], ['rate', 'Lowest rate'], ['apr', 'Lowest APR'], ['points', 'Fewest points']];

/** Which of the lender's stated assumptions don't match this person. */
function differences(r, me) {
  const out = [];
  if (r.credit && (me.score === null || me.score < r.credit)) out.push(`assumes credit ${r.credit}+`);
  if (r.ltv && me.ltv > r.ltv + 0.01) out.push(`assumes ${Math.round((100 - r.ltv) * 10) / 10}%+ down`);
  if (r.amount && Math.abs(r.amount - me.amount) / r.amount > 0.25) out.push(`priced for a ${formatCurrency(r.amount)} loan`);
  if ((r.minLoan && me.amount < r.minLoan) || (r.maxLoan && me.amount > r.maxLoan)) out.push('your loan is outside this product\'s range');
  if (me.propertyType === 'condo') out.push('condos may cost a little more');
  return out;
}

/** Each lender's 30-year conventional option closest to zero points, then the middle of those. */
function benchmarkRate(rates) {
  const bySource = {};
  rates.filter((r) => r.kind === 'conventional_fixed' && r.years === 30 && !/School employee|First-time/.test(r.product)).forEach((r) => {
    const cur = bySource[r.source];
    if (!cur || Math.abs(r.points) < Math.abs(cur.points)) bySource[r.source] = r;
  });
  const list = Object.values(bySource).map((r) => r.rate).sort((x, y) => x - y);
  return list.length ? list[Math.floor((list.length - 1) / 2)] : null;
}

export default function LiveRates({ loanAmount = 400000 }) {
  const t = useT();
  const stored = useStore((s) => s.planAnswers);
  const setPlanAnswer = useStore((s) => s.setPlanAnswer);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [points, setPoints] = useState('all');
  const [kind, setKind] = useState('all');
  const [sort, setSort] = useState('fit');
  const [used, setUsed] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/rates')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((d) => { if (alive) setData(d); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);

  const me = useMemo(() => ({
    score: CREDIT_BANDS.find((b) => b.id === a.credit)?.score ?? null,
    ltv: 100 - a.downPct,
    amount: Math.max(50000, loanAmount),
    propertyType: a.propertyType,
  }), [a.credit, a.downPct, a.propertyType, loanAmount]);
  const rows = useMemo(() => {
    if (!data) return [];
    const list = data.rates
      .filter((r) => kind === 'all' || r.kind === kind)
      .filter((r) => points === 'all' || (points === 'none' ? r.points <= 0 : r.points <= 1))
      .map((r) => ({ ...r, diffs: differences(r, me) }));
    const key = { fit: (r) => r.diffs.length * 100 + r.apr, rate: (r) => r.rate, apr: (r) => r.apr, points: (r) => r.points }[sort];
    return list.sort((x, y) => key(x) - key(y));
  }, [data, kind, points, sort, me]);
  const bench = data ? benchmarkRate(data.rates) : null;
  const name = (id) => data?.sources.find((s) => s.id === id)?.name || id;

  return (
    <section aria-labelledby="live-title">
      <h2 id="live-title" className="display text-3xl font-bold mb-1">{t('Rates lenders are posting today')}</h2>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="These are example rates that lenders publish on their own websites, each with its own assumptions (credit score, down payment, loan size). They are not offers for you, and your rate can be higher or lower. We never send your answers to any lender. Use them to know what's normal, then ask for a written Loan Estimate."
        eli5="These are the prices banks put on their websites today. Your price may be different, so ask them."
      />
      {!data && !error && <p className="note">{t('Checking lender websites…')}</p>}
      {error && <p className="note">{t('Live rates are not available right now. Try again later, or check the lender websites directly.')}</p>}
      {data && (
        <>
          <div className="flex flex-wrap gap-2 mb-2 text-sm">
            {data.sources.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`badge ${s.status === 'ok' ? 'badge-good' : 'badge-maybe'}`}>
                {s.name}: {s.status === 'ok' ? t('updated {date}', { date: s.asOf }) : s.status === 'stale' ? t('out of date, hidden') : t('not available')}
              </a>
            ))}
          </div>
          {bench !== null && (
            <div className="card my-4 flex flex-wrap items-center justify-between gap-3">
              <p>{t('Typical posted 30-year conventional rate today')}: <strong className="num text-xl">{bench}%</strong> <span className="text-sm text-muted">({t('your plan uses {rate}%', { rate: a.rate })})</span></p>
              <button type="button" className="btn-ghost" onClick={() => { setPlanAnswer('rate', bench); setUsed(bench); }}>{t('Use {rate}% in my plan', { rate: bench })}</button>
            </div>
          )}
          {used !== null && <p className="note mb-3">{t('Your plan now uses {rate}%. This doesn\'t lock a rate with any lender. Your home goal updated on the "My plans" tab.', { rate: used })}</p>}
          <div className="flex flex-wrap gap-4 mb-3">
            {[[KINDS, kind, setKind, 'Loan type'], [POINTS, points, setPoints, 'Points'], [SORTS, sort, setSort, 'Sort']].map(([opts, val, set, label]) => (
              <div key={label} className="flex flex-wrap gap-1.5 items-center" role="group" aria-label={t(label)}>
                <span className="field-label !mb-0 me-1">{t(label)}</span>
                {opts.map(([id, l]) => <button key={id} type="button" aria-pressed={val === id} onClick={() => set(id)} className={`chip !py-1 !text-sm ${val === id ? 'chip-on' : ''}`}>{t(l)}</button>)}
              </div>
            ))}
          </div>
          {kind === 'va' ? (
            <p className="note">{t('None of these lenders posts a VA rate we could verify today. Ask a VA-approved lender for a Loan Estimate.')}</p>
          ) : rows.length === 0 ? (
            <p className="note">{t('No posted rates match these filters.')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full text-sm">
                <thead><tr><th scope="col">{t('Lender')}</th><th scope="col">{t('Loan')}</th><th scope="col">{t('Rate')}</th><th scope="col">{t('APR')}</th><th scope="col">{t('Points')}</th><th scope="col">{t('How it differs from you')}</th></tr></thead>
                <tbody>
                  {rows.slice(0, 20).map((r, i) => (
                    <tr key={`${r.source}-${r.product}-${r.rate}-${r.points}-${i}`}>
                      <th scope="row"><a href={data.sources.find((s) => s.id === r.source)?.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{name(r.source)}</a></th>
                      <td>{t(r.product)}{r.membership && <span className="block text-xs text-muted">{t(r.membership)}</span>}</td>
                      <td className="num">{r.rate}%</td>
                      <td className="num">{r.apr}%</td>
                      <td className="num">{r.points}</td>
                      <td className="text-xs">{r.diffs.length ? r.diffs.map((d) => t(d)).join('; ') : t('Close to your answers')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted mt-2">{t('Negative points are a lender credit toward closing costs. We don\'t guess how your credit score would change these rates.')}</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
