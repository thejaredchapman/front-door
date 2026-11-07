import { useState } from 'react';
import { useT } from '../../i18n';
import { OCCUPATIONS } from '../../data/programs';
import { PAY_TYPES } from '../../data/plans';
import { formatCurrency } from '../../utils/formatters';

/** Personalized document checklist from the quiz answers. */
function documents(a, plans) {
  const has = (id) => plans.some((p) => p.id === id);
  const docs = [
    'Photo ID for every adult on the loan',
    'Last 2 months of statements for every bank account',
    'Homebuyer education certificate (8-hour class)',
  ];
  if (a.payType !== 'self') docs.push('Last 30 days of pay stubs', 'W-2s for the last 2 years');
  if (a.payType !== 'w2') docs.push('12–24 months of business and personal bank statements', '2 years of tax returns with all schedules (1099s, Schedule C)', 'Year-to-date profit and loss statement');
  docs.push(a.idType === 'itin' ? '2 years of tax returns filed with your ITIN, and your ITIN letter' : '2 years of federal tax returns');
  if (a.groups.includes('veteran')) docs.push('DD-214 and VA Certificate of Eligibility (COE)');
  if (a.disability) docs.push('Benefit award letters (SSDI, SSI, VA) showing ongoing income');
  if (a.occupation === 'teacher') docs.push('Teaching or school-employment contract showing annual salary');
  if (a.familyHelp) docs.push('Signed gift letter (or promissory note) and proof of the giver\'s funds');
  if (a.groups.includes('voucher')) docs.push('Housing Choice Voucher paperwork');
  if (a.monthlyDebts > 0) docs.push('Statements for every monthly debt (car, cards, student loans)');
  if (a.bankruptcy !== 'none') docs.push('Bankruptcy discharge papers');
  if (a.foreclosure !== 'none') docs.push('Foreclosure or short-sale settlement papers');
  if (a.collections) docs.push('Letters or payment plans for any collections');
  if (has('habitat')) docs.push('Proof of housing need (lease, rent receipts, or a letter describing your living situation)');
  return docs;
}

const QUESTIONS = [
  'Which down payment programs are open right now, and which can I combine?',
  'What credit score and debt-to-income do I need for each?',
  'How much cash do I need at closing, including deposits and reserves?',
  'Which lenders work with these programs?',
  'What should I fix first to qualify faster?',
];

export default function ReadinessPacket({ a, r }) {
  const t = useT();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const job = OCCUPATIONS.find((o) => o.id === a.occupation);
  const pay = PAY_TYPES.find((p) => p.id === a.payType);
  const docs = documents(a, r.plans);
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <section className="packet" aria-labelledby="packet-title">
      <div className="packet-head">
        <div>
          <p className="kicker">{t('Homebuyer readiness packet')}</p>
          <h2 id="packet-title" className="display text-3xl font-extrabold">{t('Bring this to your counselor or lender')}</h2>
        </div>
        <p className="num text-sm text-muted">{today}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 my-5 print:hidden">
        <div>
          <label htmlFor="pk-name" className="field-label">{t('Name(s) for the packet (optional)')}</label>
          <input id="pk-name" className="field !font-sans" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="pk-phone" className="field-label">{t('Phone (optional)')}</label>
          <input id="pk-phone" className="field !font-sans" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-xs text-muted sm:col-span-2">{t('These stay on this device. Only share what you\'re comfortable with.')}</p>
      </div>

      <h3 className="packet-h">{t('1. About me')}</h3>
      <dl className="packet-grid">
        <div><dt>{t('Name')}</dt><dd>{name || '________________'}</dd></div>
        <div><dt>{t('Phone')}</dt><dd>{phone || '________________'}</dd></div>
        <div><dt>{t('Household size')}</dt><dd>{a.householdSize}</dd></div>
        <div><dt>{t('County / city')}</dt><dd>{a.county}{a.county === 'Orange' && a.city !== 'any' ? ` / ${a.city}` : ''}</dd></div>
        <div><dt>{t('Yearly income')}</dt><dd>{formatCurrency(a.income)}</dd></div>
        <div><dt>{t('Income group')}</dt><dd>{t(r.ctx.category.label)} ({r.pctAmi.toFixed(0)}% AMI)</dd></div>
        <div><dt>{t('Job title / employer')}</dt><dd>{[a.jobTitle, a.employer].filter(Boolean).join(', ') || t(job?.label)}</dd></div>
        <div><dt>{t('Paid by')}</dt><dd>{t(pay?.label)}</dd></div>
        <div><dt>{t('Monthly debts')}</dt><dd>{formatCurrency(a.monthlyDebts)} ({Math.round(r.dti * 100)}%)</dd></div>
        <div><dt>{t('Savings')}</dt><dd>{formatCurrency(a.savings)}</dd></div>
        <div><dt>{t('Credit')}</dt><dd>{t(r.band.label)}</dd></div>
        <div><dt>{t('First-time buyer')}</dt><dd>{a.ownedRecently ? t('No') : t('Yes')}</dd></div>
      </dl>

      <h3 className="packet-h">{t('2. Programs I want to discuss')}</h3>
      <ul className="packet-checks">
        {r.plans.filter((p) => p.id !== 'credit-first').map((p) => <li key={p.id}>☐ {t(p.name)} <span className="text-muted">({t(p.fit === 'good' ? 'Good fit' : 'Maybe')})</span></li>)}
      </ul>

      <h3 className="packet-h">{t('3. Documents to gather')}</h3>
      <ul className="packet-checks sm:columns-2">
        {docs.map((d) => <li key={d}>☐ {t(d)}</li>)}
      </ul>

      <h3 className="packet-h">{t('4. Questions to ask')}</h3>
      <ol className="list-decimal ps-6 space-y-1">
        {QUESTIONS.map((q) => <li key={q}>{t(q)}</li>)}
        <li>________________________________________</li>
      </ol>

      <p className="text-xs text-muted mt-6">{t('Prepared with Front Door. An educational summary, not a loan application or credit decision.')}</p>
    </section>
  );
}
