import { useState } from 'react';
import Explain from '../funding/Explain';
import { useT } from '../../i18n';
import PageHeader from '../shell/PageHeader';
import {
  FUND_STEPS, FUND_RULES, BUYER_BENEFITS, DONOR_BENEFITS, POLICY_IDEAS, STATUS_TAGS, donorAfterTaxCost,
} from '../../data/taxBenefits';
import { calculateMonthlyPayment } from '../../utils/amortization';
import { formatCurrency } from '../../utils/formatters';
import RATE_INFO from '../../data/rate.json';

function Num({ id, label, value, onChange, step = 1, prefix, suffix, hint }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted num">{prefix}</span>}
        <input id={id} type="number" min={0} step={step} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className={`field ${prefix ? '!pl-7' : ''}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted num">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

function BenefitList({ items, defaultStatus }) {
  return (
    <ul className="grid md:grid-cols-2 gap-4">
      {items.map((b) => {
        const tag = STATUS_TAGS[b.status || defaultStatus];
        return (
          <li key={b.name} className="bg-card border border-line rounded-2xl p-4">
            <span className={`text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 ${tag.className}`}>{tag.label}</span>
            <h4 className="display text-lg font-semibold mt-2">{b.name}</h4>
            <Explain plain={b.plain} eli5={b.eli5} className="text-sm leading-relaxed mt-1" />
            {b.url && <a href={b.url} target="_blank" rel="noreferrer" className="btn-link inline-block mt-2">Official info →</a>}
          </li>
        );
      })}
    </ul>
  );
}

export default function CommunityFund({ part = 'overview' }) {
  const t = useT();
  // Fund simulator
  const [residents, setResidents] = useState(2000);
  const [avgGift, setAvgGift] = useState(50);
  const [companies, setCompanies] = useState(20);
  const [avgCorp, setAvgCorp] = useState(25000);
  const [matchPct, setMatchPct] = useState(50);
  const [adminPct, setAdminPct] = useState(5);
  const [grant, setGrant] = useState(25000);

  // Donor calculator
  const [gift, setGift] = useState(100);
  const [donorType, setDonorType] = useState('person');
  const [itemizes, setItemizes] = useState(false);
  const [filing, setFiling] = useState('single');
  const [fedRate, setFedRate] = useState(12);
  const [caRate, setCaRate] = useState(4);

  const residentTotal = residents * avgGift;
  const matched = residentTotal * (matchPct / 100);
  const corporate = companies * avgCorp;
  const pool = residentTotal + matched + corporate;
  const net = pool * (1 - adminPct / 100);
  const families = grant > 0 ? Math.floor(net / grant) : 0;
  const paymentDrop = calculateMonthlyPayment(grant, RATE_INFO.value, 30);

  const donor = donorAfterTaxCost({ gift, type: donorType, itemizes, filing, federalRate: fedRate, stateRate: caRate });

  return (
    <div className="page">
      {part === 'overview' ? (
        <PageHeader
          kicker="Give · Community Down Payment Fund"
          title="Help a neighbor with a down payment"
          plain="The hardest part for working families is the down payment. A community fund pools gifts from residents, companies, and employers in a nonprofit, gives donors a tax deduction, and turns it into down payment grants for local buyers."
          eli5="Lots of neighbors and companies each put a little into one big jar, and the jar helps families buy homes."
        >
          <p className="note mt-5 max-w-3xl">
            <strong>{t('About "pre-tax"')}:</strong> {t('Under current law you can\'t send pre-tax money to someone else\'s down payment. You can give to a 501(c)(3) fund and deduct the gift, which works out to a similar benefit.')}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="#/give/donate" className="btn-primary">{t('Donate')} →</a>
            <a href="#/give/taxes" className="btn-ghost">{t('Tax benefits & policy ideas')}</a>
          </div>
        </PageHeader>
      ) : (
        <PageHeader
          kicker="Give · Taxes"
          title="Tax benefits for buyers, givers & employers"
          plain="Ways the tax system can help families save for a home, and help donors and employers give more."
          eli5="Some tax rules can help you buy a home, or help people who give money to help others."
        />
      )}

      {part === 'overview' && (<>
      {/* How it works */}
      <section className="mb-14" aria-labelledby="how-title">
        <p className="kicker mb-2">How it works</p>
        <h3 id="how-title" className="display text-3xl font-extrabold mb-5">Five steps from your gift to someone&rsquo;s keys</h3>
        <ol className="grid md:grid-cols-5 gap-4">
          {FUND_STEPS.map((s, i) => (
            <li key={s.title} className="panel !mb-0 !p-4">
              <div className="num text-xs text-muted">{String(i + 1).padStart(2, '0')}</div>
              <h4 className="display text-lg font-semibold mt-1 mb-2 leading-tight">{s.title}</h4>
              <Explain plain={s.plain} eli5={s.eli5} className="text-sm leading-relaxed" />
            </li>
          ))}
        </ol>
        <details className="mt-5 panel !mb-0">
          <summary className="cursor-pointer font-semibold">Rules to keep it legal and fair</summary>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">{FUND_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
        </details>
      </section>

      {/* Simulator */}
      <section className="mb-14" aria-labelledby="sim-title">
        <p className="kicker mb-2">Model it</p>
        <h3 id="sim-title" className="display text-3xl font-extrabold mb-5">How many families could a fund help?</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="panel !mb-0 grid sm:grid-cols-2 gap-4 content-start">
            <Num id="s-res" label="Residents who give" value={residents} onChange={setResidents} step={100} />
            <Num id="s-avg" label="Average gift / year" value={avgGift} onChange={setAvgGift} step={5} prefix="$" hint="$50 ≈ $4 a month" />
            <Num id="s-co" label="Companies that give" value={companies} onChange={setCompanies} />
            <Num id="s-corp" label="Average company gift" value={avgCorp} onChange={setAvgCorp} step={1000} prefix="$" />
            <Num id="s-match" label="Employer match on resident gifts" value={matchPct} onChange={setMatchPct} step={10} suffix="%" />
            <Num id="s-admin" label="Running costs" value={adminPct} onChange={setAdminPct} suffix="%" />
            <Num id="s-grant" label="Grant per family" value={grant} onChange={setGrant} step={1000} prefix="$" />
          </div>
          <div className="panel !mb-0">
            <p className="field-label">Money raised per year</p>
            <p className="display text-5xl font-extrabold text-[var(--accent)]">{formatCurrency(pool)}</p>
            <dl className="mt-4 text-sm border-t border-ink">
              {[
                ['From residents', residentTotal],
                ['Employer matches', matched],
                ['From companies', corporate],
                [`Minus running costs (${adminPct}%)`, -(pool - net)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-rule"><dt>{k}</dt><dd className="num">{v < 0 ? `−${formatCurrency(-v)}` : formatCurrency(v)}</dd></div>
              ))}
            </dl>
            <p className="display text-4xl font-extrabold mt-5">{families} families</p>
            <p className="text-sm">get a {formatCurrency(grant)} down payment grant each year.</p>
            <Explain
              className="text-sm mt-4 leading-relaxed"
              plain={`For each family, a ${formatCurrency(grant)} grant also means borrowing ${formatCurrency(grant)} less, which lowers their payment by about ${formatCurrency(paymentDrop)} a month at ${RATE_INFO.value}% (30 years). If grants are forgivable loans repaid when a home sells early, some money flows back and helps the next family.`}
              eli5={`Each family gets ${formatCurrency(grant)} for their first slice, and their monthly house bill gets about ${formatCurrency(paymentDrop)} smaller too.`}
            />
          </div>
        </div>
      </section>

      {/* Donor calculator */}
      <section className="mb-14" aria-labelledby="donor-title">
        <p className="kicker mb-2">For givers</p>
        <h3 id="donor-title" className="display text-3xl font-extrabold mb-5">What does a gift really cost after taxes?</h3>
        <div className="panel grid lg:grid-cols-2 gap-6">
          <div className="grid sm:grid-cols-2 gap-4 content-start">
            <div className="sm:col-span-2">
              <span className="field-label">I am giving as</span>
              <div className="flex gap-2">
                {[['person', 'A person'], ['company', 'A company']].map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={donorType === id} onClick={() => setDonorType(id)} className={`px-3 py-1.5 text-sm border border-line rounded-2xl cursor-pointer ${donorType === id ? 'bg-ink text-paper' : 'bg-paper'}`}>{label}</button>
                ))}
              </div>
            </div>
            <Num id="d-gift" label="Gift amount" value={gift} onChange={setGift} step={25} prefix="$" />
            {donorType === 'person' && (
              <>
                <div>
                  <span className="field-label">Tax filing</span>
                  <select className="field" value={filing} onChange={(e) => setFiling(e.target.value)} aria-label="Tax filing status">
                    <option value="single">Single / head of household</option>
                    <option value="joint">Married filing jointly</option>
                  </select>
                </div>
                <Num id="d-fed" label="Your federal tax bracket" value={fedRate} onChange={setFedRate} suffix="%" hint="Common: 10, 12, 22, 24" />
                <Num id="d-ca" label="Your California rate" value={caRate} onChange={setCaRate} suffix="%" hint="Common: 1–9.3" />
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" checked={itemizes} onChange={(e) => setItemizes(e.target.checked)} /> I itemize deductions
                </label>
              </>
            )}
          </div>
          <div>
            <p className="field-label">Estimated tax savings</p>
            <p className="display text-5xl font-extrabold text-[var(--accent)]">{formatCurrency(donor.savings)}</p>
            <p className="text-sm text-muted">{donor.rateLabel}</p>
            <p className="display text-2xl font-semibold mt-4">Real cost of your gift: {formatCurrency(Math.max(0, gift - donor.savings))}</p>
            <p className="text-xs text-muted mt-3">
              Rough estimate, not tax advice. 2026 rules changed (non-itemizer deduction, itemizer and corporate floors, limits).
              California does not follow every federal rule. Confirm with a tax professional.
            </p>
          </div>
        </div>
      </section>

      </>)}

      {part === 'taxes' && (<>
      {/* Tax benefits */}
      <section className="mb-14" aria-labelledby="tax-title">
        <p className="kicker mb-2">Tax benefits</p>
        <h3 id="tax-title" className="display text-3xl font-extrabold mb-2">Tax help for buyers</h3>
        <p className="text-sm text-muted mb-5">Ways the tax system can help you save for, or pay for, a home.</p>
        <BenefitList items={BUYER_BENEFITS} />

        <h3 className="display text-3xl font-extrabold mt-10 mb-2">Tax help for givers and employers</h3>
        <p className="text-sm text-muted mb-5">Why companies and neighbors might fund down payments.</p>
        <BenefitList items={DONOR_BENEFITS} />

        <h3 className="display text-3xl font-extrabold mt-10 mb-2">Ideas that could be done</h3>
        <Explain
          className="text-sm mb-5 max-w-3xl"
          plain="None of these exist in California today. They are policy ideas a city, the state, or Congress could adopt, and a hackathon team could pitch them."
          eli5="These are wishes, not rules yet. Grown-ups who make laws would have to say yes first."
        />
        <BenefitList items={POLICY_IDEAS} defaultStatus="idea" />
      </section>

      </>)}

      <p className="text-xs text-muted">
        General education only, not tax, legal, or financial advice. Check current IRS and California Franchise Tax Board rules,
        and have a lawyer and CPA review any fund before it accepts money.
      </p>
    </div>
  );
}
