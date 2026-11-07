import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import { simulate, compareTerm } from '../../utils/interestSaver';
import { formatCurrency } from '../../utils/formatters';
import RATE_INFO from '../../data/rate.json';

const TIPS = [
  { title: 'Add a little to every payment', plain: 'Even $50–$100 extra a month goes straight to principal, so every later month charges interest on a smaller balance. It adds up over 30 years.', eli5: 'Pay a little extra each month, and the loan shrinks faster, so you pay less "rent on the money".' },
  { title: 'Pay every two weeks', plain: 'Half a payment every two weeks = 26 half-payments = 13 full payments a year instead of 12. Ask your servicer to set it up for free, and avoid companies that charge fees for this.', eli5: 'Paying half every two weeks sneaks in one extra payment a year.' },
  { title: 'Use windfalls', plain: 'Tax refunds, bonuses, or gifts can go to principal once a year. Write "apply to principal" on the payment or choose that option online.', eli5: 'When surprise money comes, give some to your loan.' },
  { title: 'Pick a shorter term if you can', plain: 'A 15- or 20-year loan has a lower rate and far less total interest, but a higher monthly payment. A 30-year loan with extra payments gives you flexibility in tight months.', eli5: 'A shorter loan costs less overall but more each month.' },
  { title: 'Refinance when rates drop enough', plain: 'If rates fall about 0.75–1 point below yours and you\'ll stay long enough to cover closing costs, refinancing can cut interest. Don\'t restart a new 30-year clock unless you need the lower payment.', eli5: 'If borrowing gets much cheaper later, you can swap to a cheaper loan.' },
  { title: 'Recast after a big payment', plain: 'Some lenders will "recast": after a large lump-sum payment, they re-figure your monthly payment lower for a small fee, without a new loan.', eli5: 'After a big extra payment, some banks make your monthly bill smaller.' },
  { title: 'Drop mortgage insurance early', plain: 'On conventional loans, ask to remove PMI once you owe 80% of the original value (it drops automatically at 78%). Extra payments get you there sooner.', eli5: 'Once you own enough of the house, you can stop paying the seatbelt fee.' },
  { title: 'Before you pay extra', plain: 'First: keep an emergency fund, pay off high-interest debt like credit cards, and confirm there\'s no prepayment penalty. Then send extra to the mortgage.', eli5: 'Save a rainy-day jar and pay off expensive cards first. Then pay the house loan extra.' },
];

function Num({ id, label, value, onChange, step = 1, prefix, suffix }) {
  const t = useT();
  return (
    <div>
      <label htmlFor={id} className="field-label">{t(label)}</label>
      <div className="relative">
        {prefix && <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted num">{prefix}</span>}
        <input id={id} type="number" inputMode="decimal" min={0} step={step} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className={`field ${prefix ? '!ps-7' : ''}`} />
        {suffix && <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted num">{suffix}</span>}
      </div>
    </div>
  );
}

function BalanceChart({ base, faster, t }) {
  const years = Math.max(base.length, faster.length) - 1;
  const max = base[0] || 1;
  const pts = (arr) => arr.map((b, i) => `${(i / years) * 100},${100 - (b / max) * 100}`).join(' ');
  return (
    <figure className="mt-4">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-40 border-b border-s border-ink" role="img" aria-label={t('Loan balance over time')}>
        <polyline points={pts(base)} fill="none" stroke="var(--color-muted)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeDasharray="4 3" />
        <polyline points={pts(faster)} fill="none" stroke="var(--accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <figcaption className="flex flex-wrap gap-4 text-xs text-muted mt-2">
        <span><span className="inline-block w-4 border-t-2 border-dashed border-muted align-middle me-1" />{t('Regular payments')}</span>
        <span><span className="inline-block w-4 border-t-[3px] border-[var(--accent)] align-middle me-1" />{t('With your extra payments')}</span>
        <span>0 → {t('{n} years', { n: years })}</span>
      </figcaption>
    </figure>
  );
}

export default function InterestSaver({ defaultLoan = 400000, defaultRate = RATE_INFO.value, defaultTerm = 30, compact = false }) {
  const t = useT();
  const [loan, setLoan] = useState(defaultLoan);
  const [rate, setRate] = useState(defaultRate);
  const [term, setTerm] = useState(defaultTerm);
  const [extraMonthly, setExtraMonthly] = useState(100);
  const [extraYearly, setExtraYearly] = useState(1000);
  const [lumpSum, setLumpSum] = useState(0);
  const [biweekly, setBiweekly] = useState(false);

  const base = useMemo(() => simulate({ principal: loan, annualRate: rate, termYears: term }), [loan, rate, term]);
  const fast = useMemo(() => simulate({ principal: loan, annualRate: rate, termYears: term, extraMonthly, extraYearly, lumpSum, biweekly }), [loan, rate, term, extraMonthly, extraYearly, lumpSum, biweekly]);
  const saved = base.interest - fast.interest;
  const monthsSaved = base.months - fast.months;
  const terms = [15, 20, 30].map((y) => compareTerm(loan, y === 30 ? rate : Math.max(0, rate - (y === 15 ? 0.6 : 0.3)), y));

  return (
    <div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card grid sm:grid-cols-2 gap-4 content-start">
          <Num id="is-loan" label="Loan amount" value={loan} onChange={setLoan} step={5000} prefix="$" />
          <Num id="is-rate" label="Interest rate" value={rate} onChange={setRate} step={0.125} suffix="%" />
          <div>
            <label htmlFor="is-term" className="field-label">{t('Loan term')}</label>
            <select id="is-term" className="field" value={term} onChange={(e) => setTerm(Number(e.target.value))}>
              {[15, 20, 30].map((y) => <option key={y} value={y}>{t('{n} years', { n: y })}</option>)}
            </select>
          </div>
          <Num id="is-monthly" label="Extra each month" value={extraMonthly} onChange={setExtraMonthly} step={25} prefix="$" />
          <Num id="is-yearly" label="Extra once a year (e.g. tax refund)" value={extraYearly} onChange={setExtraYearly} step={100} prefix="$" />
          <Num id="is-lump" label="One-time lump sum (year 1)" value={lumpSum} onChange={setLumpSum} step={500} prefix="$" />
          <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={biweekly} onChange={(e) => setBiweekly(e.target.checked)} />
            {t('Pay half every two weeks (biweekly)')}
          </label>
        </div>

        <div className="lg:col-span-3 card">
          <p className="field-label">{t('Interest you save')}</p>
          <p className="display text-5xl font-extrabold text-[var(--accent)]">{formatCurrency(Math.max(0, saved))}</p>
          <p className="text-lg mt-1">
            {t('Paid off {y} years and {m} months sooner.', { y: Math.floor(monthsSaved / 12), m: monthsSaved % 12 })}
          </p>
          <dl className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div><dt className="field-label">{t('Total interest, regular')}</dt><dd className="num">{formatCurrency(base.interest)}</dd></div>
            <div><dt className="field-label">{t('Total interest, with extras')}</dt><dd className="num">{formatCurrency(fast.interest)}</dd></div>
            <div><dt className="field-label">{t('Regular monthly payment')}</dt><dd className="num">{formatCurrency(base.payment)}</dd></div>
            <div><dt className="field-label">{t('Extra per month, on average')}</dt><dd className="num">{formatCurrency(extraMonthly + extraYearly / 12 + (biweekly ? base.payment / 12 : 0))}</dd></div>
          </dl>
          <BalanceChart base={base.yearly} faster={fast.yearly} t={t} />
        </div>
      </div>

      <div className="card mt-6">
        <p className="field-label">{t('Shorter terms compared (example rates: 15-yr about 0.6 lower, 20-yr about 0.3 lower)')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b-2 border-ink text-start">
              <th className="py-2 text-start">{t('Term')}</th><th className="py-2 text-start">{t('Monthly')}</th><th className="py-2 text-start">{t('Total interest')}</th>
            </tr></thead>
            <tbody>
              {terms.map((x) => (
                <tr key={x.termYears} className="border-b border-rule">
                  <td className="py-2">{t('{n} years', { n: x.termYears })}</td>
                  <td className="py-2 num">{formatCurrency(x.payment)}</td>
                  <td className="py-2 num">{formatCurrency(x.interest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!compact && (
        <>
          <h2 className="display text-2xl font-bold mt-10 mb-4">{t('8 ways to pay less interest')}</h2>
          <ol className="ledger-list">
            {TIPS.map((tip, i) => (
              <li key={tip.title}>
                <span className="num ledger-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-semibold text-lg">{t(tip.title)}</h3>
                  <Explain plain={tip.plain} eli5={tip.eli5} className="mt-1" />
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
