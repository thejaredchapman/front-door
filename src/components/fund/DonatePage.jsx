import { useState } from 'react';
import { useT } from '../../i18n';
import PageHeader from '../shell/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import { calculateMonthlyPayment } from '../../utils/amortization';
import RATE_INFO from '../../data/rate.json';

const AMOUNTS = [25, 50, 100, 250, 500];

/**
 * Donation form. Checkout is connected in the next build step (payment provider in TEST mode,
 * via a serverless function), so nothing is charged from this page yet.
 */
export default function DonatePage() {
  const t = useT();
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [monthly, setMonthly] = useState(false);
  const [asCompany, setAsCompany] = useState(false);
  const value = custom ? Number(custom) : amount;
  const yearly = monthly ? value * 12 : value;
  const paymentDrop = calculateMonthlyPayment(yearly, RATE_INFO.value, 30);

  return (
    <div className="page-narrow">
      <PageHeader
        kicker="Give · Donate"
        title="Give toward a family's down payment"
        plain="Your gift goes into a pooled fund held by a nonprofit. Families qualify by fair, published rules; donors can't pick a family, which keeps gifts tax-deductible."
        eli5="You put money in the big jar. The jar helps families who follow the rules."
      />

      <p className="note mb-6"><strong>{t('Test mode')}:</strong> {t('Online checkout is being connected in test mode. No real money is collected yet.')}</p>

      <div className="card space-y-6">
        <div>
          <p className="field-label">{t('Amount')}</p>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((x) => (
              <button key={x} type="button" className={`chip ${!custom && amount === x ? 'chip-on' : ''}`} onClick={() => { setAmount(x); setCustom(''); }}>{formatCurrency(x)}</button>
            ))}
            <label className="relative">
              <span className="sr-only">{t('Other amount')}</span>
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
              <input type="number" min={1} inputMode="numeric" placeholder={t('Other')} value={custom} onChange={(e) => setCustom(e.target.value)} className="field !ps-7 w-32" />
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`chip ${!monthly ? 'chip-on' : ''}`} onClick={() => setMonthly(false)}>{t('One time')}</button>
          <button type="button" className={`chip ${monthly ? 'chip-on' : ''}`} onClick={() => setMonthly(true)}>{t('Monthly')}</button>
          <button type="button" className={`chip ${asCompany ? 'chip-on' : ''}`} onClick={() => setAsCompany(!asCompany)}>{t('Giving as a company')}</button>
        </div>
        <p className="text-sm">
          {t('{amount} a year lowers one family\'s mortgage by about {drop} a month (at {rate}%, 30 years).', { amount: formatCurrency(yearly), drop: formatCurrency(paymentDrop), rate: RATE_INFO.value })}
        </p>
        <button type="button" className="btn-primary btn-lg w-full" disabled aria-describedby="checkout-note">
          {t('Continue to secure checkout')} →
        </button>
        <p id="checkout-note" className="text-xs text-muted">
          {t('Checkout opens on a secure payment page. Front Door never sees or stores card numbers.')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <a href="#/give" className="card hover-lift"><span className="font-semibold">{t('How the fund works')}</span><span className="block text-sm text-muted">{t('Rules, simulator, and your after-tax cost')}</span></a>
        <a href="#/give/taxes" className="card hover-lift"><span className="font-semibold">{t('Tax benefits')}</span><span className="block text-sm text-muted">{t('For buyers, givers, and employers')}</span></a>
      </div>
    </div>
  );
}
