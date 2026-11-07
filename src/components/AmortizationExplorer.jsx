import { useMemo, useState } from 'react';
import { useT } from '../i18n';
import Explain from './funding/Explain';
import { formatCurrency, formatCurrencyDetailed } from '../utils/formatters';

const COLORS = { principal: '#2e6b4e', interest: '#e7735e', tax: '#f2a65a', insurance: '#7aa6c2', pmi: '#b9a58f' };

function addMonths(start, n) {
  const d = new Date(start);
  d.setMonth(d.getMonth() + n);
  return d;
}

/**
 * Interactive amortization: pick any payment to see its breakdown (principal, interest, tax,
 * insurance, mortgage insurance), running totals, a yearly principal-vs-interest chart, and a
 * year → month schedule. Mortgage insurance stops once the balance reaches 78% of the price.
 */
export default function AmortizationExplorer({ schedule, piti, propertyPrice, downPaymentPercent }) {
  const t = useT();
  const n = schedule.length;
  const [month, setMonth] = useState(1);
  const [startIso, setStartIso] = useState(() => new Date().toISOString().slice(0, 7));
  const [openYear, setOpenYear] = useState(null);
  const start = new Date(`${startIso}-01T12:00:00`);
  const m = Math.min(Math.max(month, 1), n);

  const pmiEnd = useMemo(() => {
    if (!piti.monthlyPMI || downPaymentPercent >= 20) return 0;
    const row = schedule.find((r) => r.remainingBalance <= propertyPrice * 0.78);
    return row ? row.month : n;
  }, [schedule, piti.monthlyPMI, downPaymentPercent, propertyPrice, n]);

  const crossover = useMemo(() => schedule.find((r) => r.principalPayment >= r.interestPayment)?.month ?? null, [schedule]);

  const years = useMemo(() => {
    const out = [];
    for (let y = 0; y < n / 12; y += 1) {
      const rows = schedule.slice(y * 12, y * 12 + 12);
      out.push({
        year: y + 1,
        principal: rows.reduce((s, r) => s + r.principalPayment, 0),
        interest: rows.reduce((s, r) => s + r.interestPayment, 0),
        endBalance: rows.at(-1)?.remainingBalance ?? 0,
        rows,
      });
    }
    return out;
  }, [schedule, n]);

  if (!n) return null;
  const row = schedule[m - 1];
  const pmi = pmiEnd && m <= pmiEnd ? piti.monthlyPMI : 0;
  const parts = [
    { id: 'principal', label: 'Principal (pays down the loan)', value: row.principalPayment },
    { id: 'interest', label: 'Interest (cost of borrowing)', value: row.interestPayment },
    { id: 'tax', label: 'Property tax', value: piti.monthlyTax },
    { id: 'insurance', label: 'Home insurance', value: piti.monthlyInsurance },
    { id: 'pmi', label: 'Mortgage insurance (PMI)', value: pmi },
  ].filter((p) => p.value > 0.005);
  const total = parts.reduce((s, p) => s + p.value, 0);
  const paidPrincipal = piti.loanAmount - row.remainingBalance;
  const equity = propertyPrice - row.remainingBalance;
  const maxYear = Math.max(...years.map((y) => y.principal + y.interest));
  const selYear = Math.ceil(m / 12);
  const fmtMonth = (k) => addMonths(start, k - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

  return (
    <section className="panel" aria-labelledby="amort-title">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <p className="kicker mb-1">{t('Your loan, payment by payment')}</p>
          <h3 id="amort-title" className="display text-3xl font-bold">{t('Amortization explorer')}</h3>
        </div>
        <div>
          <label htmlFor="amort-start" className="field-label">{t('First payment')}</label>
          <input id="amort-start" type="month" className="field !py-1.5" value={startIso} onChange={(e) => setStartIso(e.target.value || startIso)} />
        </div>
      </div>
      <Explain
        className="text-sm mb-5"
        plain="Each payment is split between interest (the lender's charge) and principal (what actually lowers your loan). Early on, most of the payment is interest; over time the balance shrinks, so more goes to principal. Taxes and insurance stay about the same."
        eli5="At first, most of your payment goes to the bank's fee. Later, more of it goes to paying off your house."
      />

      {/* Payment picker */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="chip" onClick={() => setMonth(Math.max(1, m - 1))} aria-label={t('Previous payment')}>←</button>
        <div className="flex-1 min-w-[12rem]">
          <label htmlFor="amort-month" className="field-label !mb-1">{t('Payment {k} of {n} · {date}', { k: m, n, date: fmtMonth(m) })}</label>
          <input
            id="amort-month"
            type="range"
            min={1}
            max={n}
            value={m}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="ratio-range !mt-1"
            style={{ '--fill': `${((m - 1) / Math.max(1, n - 1)) * 100}%` }}
            aria-valuetext={t('Payment {k} of {n}', { k: m, n })}
          />
        </div>
        <button type="button" className="chip" onClick={() => setMonth(Math.min(n, m + 1))} aria-label={t('Next payment')}>→</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3 text-sm">
        {[['First', 1], ['Year 5', 49], ['Year 10', 109], ...(crossover ? [['Tipping point', crossover]] : []), ...(pmiEnd ? [['PMI ends', pmiEnd]] : []), ['Last', n]]
          .filter(([, k]) => k <= n)
          .map(([label, k]) => (
            <button key={label} type="button" className={`chip !min-h-0 !py-1 ${m === k ? 'chip-on' : ''}`} onClick={() => setMonth(k)}>{t(label)}</button>
          ))}
      </div>

      {/* This payment */}
      <div className="grid lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <p className="field-label">{t('This payment')}</p>
          <p className="display text-4xl font-bold">{formatCurrencyDetailed(total)}</p>
          <div className="flex h-5 rounded-full overflow-hidden mt-3" role="img" aria-label={t('Payment breakdown')}>
            {parts.map((p) => <span key={p.id} style={{ width: `${(p.value / total) * 100}%`, background: COLORS[p.id] }} title={`${t(p.label)}: ${formatCurrencyDetailed(p.value)}`} />)}
          </div>
          <ul className="mt-3 space-y-1.5">
            {parts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[p.id] }} />{t(p.label)}</span>
                <span className="num font-semibold">{formatCurrencyDetailed(p.value)} <span className="text-muted font-normal">· {Math.round((p.value / total) * 100)}%</span></span>
              </li>
            ))}
          </ul>
          {pmiEnd > 0 && (
            <p className="text-xs text-muted mt-2">
              {m <= pmiEnd
                ? t('PMI can usually be removed at payment {k} ({date}), when you owe 78% of the original price. Extra payments get you there sooner.', { k: pmiEnd, date: fmtMonth(pmiEnd) })
                : t('PMI has been removed: you owe less than 78% of the original price.')}
            </p>
          )}
        </div>
        <dl className="lg:col-span-2 grid grid-cols-2 gap-3 content-start">
          {[
            ['Loan balance left', formatCurrency(row.remainingBalance)],
            ['Your equity', `${formatCurrency(equity)} (${Math.round((equity / propertyPrice) * 100)}%)`],
            ['Principal paid so far', formatCurrency(paidPrincipal)],
            ['Interest paid so far', formatCurrency(row.cumulativeInterest)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-paper p-3">
              <dt className="field-label !mb-0.5">{t(k)}</dt>
              <dd className="num font-bold">{v}</dd>
            </div>
          ))}
          <p className="col-span-2 text-xs text-muted">{t('Equity assumes the home keeps its purchase price.')}</p>
        </dl>
      </div>

      {/* Yearly chart */}
      <figure className="mt-8">
        <figcaption className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="field-label !mb-0">{t('Each year: principal vs. interest (tap a year)')}</span>
          <span className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: COLORS.principal }} />{t('Principal')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: COLORS.interest }} />{t('Interest')}</span>
          </span>
        </figcaption>
        <div className="flex items-end gap-[2px] h-40" role="group" aria-label={t('Yearly principal and interest')}>
          {years.map((y) => {
            const h = ((y.principal + y.interest) / maxYear) * 100;
            const active = y.year === selYear;
            return (
              <button
                key={y.year}
                type="button"
                onClick={() => setMonth((y.year - 1) * 12 + 1)}
                className={`flex-1 flex flex-col justify-end h-full rounded-t cursor-pointer ${active ? 'outline outline-2 outline-[var(--color-ink)] outline-offset-1' : 'opacity-85 hover:opacity-100'}`}
                title={`${t('Year {y}', { y: y.year })}: ${t('Principal')} ${formatCurrency(y.principal)} · ${t('Interest')} ${formatCurrency(y.interest)}`}
                aria-label={t('Year {y}', { y: y.year })}
                aria-pressed={active}
              >
                <span style={{ height: `${h}%` }} className="w-full flex flex-col rounded-t overflow-hidden">
                  <span style={{ flex: y.interest, background: COLORS.interest }} />
                  <span style={{ flex: y.principal, background: COLORS.principal }} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted mt-1"><span>{t('Year {y}', { y: 1 })}</span><span>{t('Year {y}', { y: years.length })}</span></div>
        {crossover && (
          <p className="text-sm mt-3">
            {t('From payment {k} ({date}), more of each payment goes to principal than to interest.', { k: crossover, date: fmtMonth(crossover) })}
          </p>
        )}
      </figure>

      {/* Year → month schedule */}
      <div className="mt-8">
        <p className="field-label">{t('Schedule (tap a year to see each month)')}</p>
        <div className="schedule-scroll border border-line rounded-2xl">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="text-start border-b border-line">
                <th className="p-2 text-start">{t('Year')}</th>
                <th className="p-2 text-end">{t('Principal')}</th>
                <th className="p-2 text-end">{t('Interest')}</th>
                <th className="p-2 text-end">{t('Balance left')}</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y) => (
                <FragmentRows key={y.year} y={y} open={openYear === y.year} selMonth={m} onToggle={() => setOpenYear(openYear === y.year ? null : y.year)} onPick={setMonth} fmtMonth={fmtMonth} t={t} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FragmentRows({ y, open, selMonth, onToggle, onPick, fmtMonth, t }) {
  return (
    <>
      <tr className={`border-b border-line cursor-pointer hover:bg-paper ${Math.ceil(selMonth / 12) === y.year ? 'bg-[var(--color-sage)]' : ''}`} onClick={onToggle}>
        <td className="p-2 font-semibold"><button type="button" aria-expanded={open} className="cursor-pointer">{open ? '▾' : '▸'} {t('Year {y}', { y: y.year })}</button></td>
        <td className="p-2 text-end num">{formatCurrency(y.principal)}</td>
        <td className="p-2 text-end num">{formatCurrency(y.interest)}</td>
        <td className="p-2 text-end num">{formatCurrency(y.endBalance)}</td>
      </tr>
      {open && y.rows.map((r) => (
        <tr key={r.month} className={`border-b border-line text-xs cursor-pointer hover:bg-paper ${r.month === selMonth ? 'bg-[#fff4e6] font-semibold' : ''}`} onClick={() => onPick(r.month)}>
          <td className="p-2 ps-7">#{r.month} · {fmtMonth(r.month)}</td>
          <td className="p-2 text-end num">{formatCurrencyDetailed(r.principalPayment)}</td>
          <td className="p-2 text-end num">{formatCurrencyDetailed(r.interestPayment)}</td>
          <td className="p-2 text-end num">{formatCurrency(r.remainingBalance)}</td>
        </tr>
      ))}
    </>
  );
}
