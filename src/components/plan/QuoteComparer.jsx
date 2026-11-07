import { useState } from 'react';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { formatCurrency } from '../../utils/formatters';
import { pmt } from '../../utils/homeGoal';

const MAX = 12;
const EMPTY = { lender: '', rate: '', apr: '', points: '0', fees: '', credits: '0', mi: '0' };
const FIELDS = [
  ['lender', 'Lender', 'text'],
  ['rate', 'Interest rate %', 'number'],
  ['apr', 'APR % (from the Loan Estimate)', 'number'],
  ['points', 'Points (% of loan)', 'number'],
  ['fees', 'Lender fees $ (section A)', 'number'],
  ['credits', 'Lender credits $', 'number'],
  ['mi', 'Mortgage insurance $ / month', 'number'],
];

/** Interest paid in the first `months` payments. */
function interestPaid(principal, rate, years, months) {
  const r = rate / 1200;
  const pay = pmt(principal, rate, years);
  let bal = principal;
  let interest = 0;
  for (let i = 0; i < Math.min(months, years * 12) && bal > 0; i++) {
    const int = bal * r;
    interest += int;
    bal -= pay - int;
  }
  return interest;
}

function quoteCosts(q, { amount, years }) {
  const rate = Number(q.rate);
  const upfront = (amount * Number(q.points || 0)) / 100 + Number(q.fees || 0) - Number(q.credits || 0);
  const mi = Number(q.mi || 0);
  const monthly = pmt(amount, rate, years) + mi;
  const fiveYear = interestPaid(amount, rate, years, 60) + upfront + mi * Math.min(60, years * 12);
  return { upfront, monthly, fiveYear };
}

const complete = (q) => q.lender.trim() && ['rate', 'apr', 'points', 'fees', 'credits', 'mi'].every((k) => q[k] !== '' && Number.isFinite(Number(q[k]))) && Number(q.rate) > 0;

export default function QuoteComparer({ defaultAmount }) {
  const t = useT();
  const basis = useStore((s) => s.quoteBasis) || { amount: Math.max(50000, Math.round(defaultAmount / 1000) * 1000), years: 30 };
  const setBasis = useStore((s) => s.setQuoteBasis);
  const quotes = useStore((s) => s.quotes);
  const setQuotes = useStore((s) => s.setQuotes);
  const [draft, setDraft] = useState(EMPTY);

  const sameBasis = (q) => q.amount === basis.amount && q.years === basis.years;
  const changeBasis = (patch) => setBasis({ ...basis, ...patch });
  const add = (e) => {
    e.preventDefault();
    if (!complete(draft) || quotes.length >= MAX) return;
    setQuotes([...quotes, { ...draft, id: `${Date.now()}`, amount: basis.amount, years: basis.years }]);
    setDraft(EMPTY);
  };
  const rows = quotes.map((q) => ({ q, valid: sameBasis(q), c: sameBasis(q) ? quoteCosts(q, basis) : null }));
  const valid = rows.filter((r) => r.valid);
  const best = valid.length > 1 ? valid.reduce((m, r) => (r.c.fiveYear < m.c.fiveYear ? r : m)) : null;

  return (
    <section className="mt-12" aria-labelledby="quotes-title">
      <h2 id="quotes-title" className="display text-3xl font-bold mb-1">{t('Compare your Loan Estimates')}</h2>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="When lenders send you a Loan Estimate, type the numbers here. We line them up on the same loan amount and term so you can see the cash due up front, the monthly payment, and the cost over the first 5 years. APR comes straight from the lender's form; we don't calculate it. Taxes, home insurance, HOA, and third-party fees are left out unless you add them."
        eli5="Put each bank's price card here and we show which one costs you less."
      />
      <div className="card mb-4 grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="qb-amount" className="field-label">{t('Loan amount (same for every quote)')}</label>
          <input id="qb-amount" type="number" min={10000} step={1000} className="field" value={basis.amount} onChange={(e) => changeBasis({ amount: Math.max(0, Number(e.target.value)) })} />
        </div>
        <div>
          <label htmlFor="qb-years" className="field-label">{t('Loan term')}</label>
          <select id="qb-years" className="field" value={basis.years} onChange={(e) => changeBasis({ years: Number(e.target.value) })}>
            {[15, 20, 30].map((y) => <option key={y} value={y}>{t('{n} years', { n: y })}</option>)}
          </select>
        </div>
        <p className="text-sm text-muted">{t('Changing these sets aside quotes made for a different amount or term. Ask those lenders for an updated estimate.')}</p>
      </div>

      <form onSubmit={add} className="card grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FIELDS.map(([k, label, type]) => (
          <div key={k}>
            <label htmlFor={`q-${k}`} className="field-label">{t(label)}</label>
            <input id={`q-${k}`} type={type} step="any" inputMode={type === 'number' ? 'decimal' : undefined} className="field" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
          </div>
        ))}
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={!complete(draft) || quotes.length >= MAX}>
            {quotes.length >= MAX ? t('12 quotes is the limit') : t('Add this quote')}
          </button>
        </div>
      </form>

      {rows.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="data-table w-full text-sm">
            <thead>
              <tr>
                <th scope="col">{t('Lender')}</th><th scope="col">{t('Rate')}</th><th scope="col">{t('APR')}</th>
                <th scope="col">{t('Cash up front')}</th><th scope="col">{t('Monthly')}</th><th scope="col">{t('First 5 years')}</th><th scope="col"><span className="sr-only">{t('Remove')}</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ q, valid: ok, c }) => (
                <tr key={q.id} className={best?.q.id === q.id ? 'is-best' : ok ? '' : 'opacity-60'}>
                  <th scope="row">{q.lender} {best?.q.id === q.id && <span className="badge badge-good ms-1">{t('Lowest 5-year cost')}</span>}</th>
                  <td className="num">{q.rate}%</td>
                  <td className="num">{q.apr}%</td>
                  {ok ? (
                    <>
                      <td className="num">{formatCurrency(c.upfront)}</td>
                      <td className="num">{formatCurrency(c.monthly)}</td>
                      <td className="num font-bold">{formatCurrency(c.fiveYear)}</td>
                    </>
                  ) : (
                    <td colSpan={3}>{t('Made for {amount} over {years} years. Ask for an updated estimate.', { amount: formatCurrency(q.amount), years: q.years })}</td>
                  )}
                  <td><button type="button" className="btn-link" onClick={() => setQuotes(quotes.filter((x) => x.id !== q.id))}>{t('Remove')}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-2">{t('"First 5 years" = interest paid in 60 payments + points + lender fees − credits + mortgage insurance. Principal you pay back is not a cost, so it is left out.')}</p>
        </div>
      )}
    </section>
  );
}
