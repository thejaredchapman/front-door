import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import RATE_INFO from '../../data/rate.json';
import { BUYERS, OC_MEDIAN_PRICE, OC_LOAN_LIMIT } from '../../data/fiveBuyers';
import { getIncomeCategory } from '../../data/incomeLimits';
import { priceFromMonthlyBudget } from '../../utils/affordableCost';
import { calculateMonthlyPayment } from '../../utils/amortization';
import { formatCurrency } from '../../utils/formatters';
import { useStore } from '../../store/useStore';
import HousingRatioSlider from '../HousingRatioSlider';

const TAX = 1.1;
const INS = 1800;

/** Highest price a household can afford: `ratio`% of income for housing (30–35%), 36% for all debts, savings minus ~3% closing costs as the down payment. */
function affordable(b, ratio) {
  const monthly = b.income / 12;
  const budget = Math.max(0, Math.min(monthly * (ratio / 100), monthly * 0.36 - b.debts));
  let price = 300000;
  let downPct = 0;
  for (let i = 0; i < 40; i += 1) {
    const cash = Math.max(0, b.savings - price * 0.03);
    downPct = Math.min(100, (cash / price) * 100);
    const mi = downPct < 20 ? 0.55 : 0;
    const next = priceFromMonthlyBudget({ monthlyBudget: budget, annualRate: RATE_INFO.value, downPaymentPercent: downPct, propertyTaxRate: TAX, annualInsurance: INS, annualMiRate: mi }).price;
    if (Math.abs(next - price) < 50) { price = next; break; }
    price = next;
  }
  const cashPrice = Math.max(0, b.savings - 0); // could they pay cash?
  if (cashPrice > price) { price = Math.max(price, cashPrice * 0.97); downPct = 100; }
  const loan = price * (1 - downPct / 100);
  const loanType = downPct >= 100 ? 'Cash' : loan > OC_LOAN_LIMIT ? 'Jumbo' : downPct < 10 ? 'FHA or 3%-down + help' : 'Conventional';
  return { price, budget, downPct, loanType };
}

function incomeNeededForMedian(ratio) {
  const loan = OC_MEDIAN_PRICE * 0.8;
  const monthly = calculateMonthlyPayment(loan, RATE_INFO.value, 30) + (OC_MEDIAN_PRICE * TAX) / 100 / 12 + INS / 12;
  return { income: (monthly / (ratio / 100)) * 12, down: OC_MEDIAN_PRICE * 0.2, monthly };
}

export default function FiveBuyers() {
  const t = useT();
  const [open, setOpen] = useState('low');
  const ratio = useStore((s) => s.housingRatio ?? 30);
  const rows = useMemo(() => BUYERS.map((b) => ({ ...b, ...affordable(b, ratio), category: getIncomeCategory(b.income, b.size, 'Orange') })), [ratio]);
  const need = incomeNeededForMedian(ratio);
  const maxBar = Math.max(OC_MEDIAN_PRICE * 1.4, ...rows.filter((r) => r.id !== 'ultra').map((r) => r.price));

  return (
    <div>
      <div className="stat-row mb-8">
        <div><p className="field-label">{t('Typical OC home')}</p><p className="display stat-v">{formatCurrency(OC_MEDIAN_PRICE)}+</p></div>
        <div><p className="field-label">{t('Income needed to afford it')}</p><p className="display stat-v text-[var(--accent)]">{formatCurrency(need.income)}</p></div>
        <div><p className="field-label">{t('Plus a down payment of')}</p><p className="display stat-v">{formatCurrency(need.down)}</p></div>
      </div>
      <Explain
        className="lede mb-10"
        plain={`At today's average rate, buying a typical Orange County home with 20% down costs about ${formatCurrency(need.monthly)} a month. To keep that under ${ratio}% of income, a household needs to earn about ${formatCurrency(need.income)} a year, plus about ${formatCurrency(need.down)} saved. Here is how five very different households fare.`}
        eli5="A typical house here costs so much that you'd need a huge paycheck to buy it. Let's meet five families and see how each one does."
      />

      <div className="card mb-6"><HousingRatioSlider id="ratio-five" compact /></div>

      <figure className="card mb-10">
        <figcaption className="field-label mb-4">{t('What each household can afford vs. the typical home')}</figcaption>
        <ul className="space-y-3">
          {rows.map((r) => {
            const capped = Math.min(r.price, maxBar);
            return (
              <li key={r.id} className="grid grid-cols-[minmax(7rem,10rem)_1fr_auto] items-center gap-3 text-sm">
                <span><strong>{t(r.name)}</strong><span className="block text-xs text-muted">{t(r.tier)} · {formatCurrency(r.income)}</span></span>
                <span className="h-6 bg-paper border border-rule relative">
                  <span className="absolute inset-y-0 start-0" style={{ width: `${(capped / maxBar) * 100}%`, background: r.price >= OC_MEDIAN_PRICE ? 'var(--accent)' : 'var(--color-gold)' }} />
                  <span className="absolute inset-y-[-4px] w-0.5 bg-ink" style={{ insetInlineStart: `${(OC_MEDIAN_PRICE / maxBar) * 100}%` }} aria-hidden="true" />
                </span>
                <span className="num">{r.price > maxBar ? `${formatCurrency(maxBar)}+` : formatCurrency(r.price)}</span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted mt-3">
          {t('Black line = typical home ({price}). Estimates at {rate}% for 30 years, 1.1% property tax, $1,800/yr insurance, savings minus ~3% closing costs as the down payment.', { price: formatCurrency(OC_MEDIAN_PRICE), rate: RATE_INFO.value })}
        </p>
      </figure>

      <div className="space-y-4">
        {rows.map((r, i) => {
          const isOpen = open === r.id;
          const gap = OC_MEDIAN_PRICE - r.price;
          return (
            <article key={r.id} className="plan-card">
              <button type="button" className="w-full text-start cursor-pointer" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)}>
                <span className="kicker">{String(i + 1).padStart(2, '0')} · {t(r.tier)}</span>
                <span className="display block text-2xl font-semibold mt-1">{t(r.name)} <span className="text-muted text-lg">· {t(r.job)}</span></span>
                <span className="block mt-1">
                  {gap > 0
                    ? t('Can afford about {price}: {gap} short of the typical home.', { price: formatCurrency(r.price), gap: formatCurrency(gap) })
                    : t('Can afford about {price}, enough for the typical home.', { price: formatCurrency(r.price) })}
                </span>
              </button>
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-rule">
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                    <div><dt className="field-label">{t('Household income')}</dt><dd className="num">{formatCurrency(r.income)}</dd></div>
                    <div><dt className="field-label">{t('OC income group')}</dt><dd>{t(r.category.label)}</dd></div>
                    <div><dt className="field-label">{t('Savings')}</dt><dd className="num">{formatCurrency(r.savings)}</dd></div>
                    <div><dt className="field-label">{t('Safe monthly payment')}</dt><dd className="num">{formatCurrency(r.budget)}</dd></div>
                    <div><dt className="field-label">{t('Price-to-income')}</dt><dd className="num">{(OC_MEDIAN_PRICE / r.income).toFixed(1)} : 1</dd></div>
                    <div><dt className="field-label">{t('Likely loan')}</dt><dd>{t(r.loanType)}</dd></div>
                  </dl>
                  <Explain plain={r.story} eli5={r.eli5} />
                  <p className="note mt-3"><strong>{t('Their best path')}:</strong> {t(r.path)}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <section className="cta-band mt-10 !block">
        <p className="display text-2xl font-bold">{t('It\'s not just you.')}</p>
        <Explain
          className="mt-2"
          plain="Three of these five households can't afford the typical home, including a teacher and a nurse earning $210,000 together. High prices come from too few homes, lots of competition, and high rates, not from anything working families did wrong. That's why down payment help, below-market homes, and Habitat exist, and why using them is smart, not shameful."
          eli5="Almost everyone has trouble buying a house here, even people with big paychecks. Using helpers is smart."
        />
        <a href="#/plan" className="btn-ghost mt-4 inline-flex text-ink">{t('Find the help that fits you')} →</a>
      </section>
    </div>
  );
}
