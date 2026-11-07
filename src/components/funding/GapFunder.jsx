import { useMemo, useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import { STATUTE_TIERS, affordableMonthlyHousingCost, amiForHousehold, priceFromMonthlyBudget } from '../../utils/affordableCost';
import { formatCurrency } from '../../utils/formatters';
import CountySelect from '../CountySelect';
import RATE_INFO from '../../data/rate.json';

// SYNTHETIC worked example from the Lane 3 brief (synthetic-example-deal.json).
// Every number is an invented, rounded ASSUMPTION used only to test the math.
const SYNTHETIC_COSTS = [
  { id: 'land', label: 'Land and building purchase', value: 360000 },
  { id: 'wait', label: 'Time costs while waiting (interest, taxes, insurance, management)', value: 85000 },
  { id: 'build', label: 'Construction and repairs', value: 40000 },
  { id: 'fees', label: 'Fees: design, legal, sales', value: 50000 },
];
const SYNTHETIC_SOURCES = { subsidies: 100000, earned: 55000 };

function MoneyInput({ id, label, value, onChange, step = 1000, hint }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
        <input id={id} type="number" min={0} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="field !pl-7" />
      </div>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

export default function GapFunder() {
  // Family side
  const [county, setCounty] = useState('Orange');
  const [householdSize, setHouseholdSize] = useState(4);
  const [tier, setTier] = useState('low');
  const [rate, setRate] = useState(RATE_INFO.value);
  const [taxRate, setTaxRate] = useState(1.1);
  const [insurance, setInsurance] = useState(1800);
  const [hoa, setHoa] = useState(0);
  const [utilities, setUtilities] = useState(200);
  const [maintenance, setMaintenance] = useState(100);
  const [useDerivedPrice, setUseDerivedPrice] = useState(true);
  const [manualPrice, setManualPrice] = useState(285000);

  // Project side
  const [costs, setCosts] = useState(SYNTHETIC_COSTS);
  const [subsidies, setSubsidies] = useState(SYNTHETIC_SOURCES.subsidies);
  const [earned, setEarned] = useState(SYNTHETIC_SOURCES.earned);
  const [delayMonths, setDelayMonths] = useState(0);
  const [carryPerMonth, setCarryPerMonth] = useState(7000);

  const monthlyBudget = affordableMonthlyHousingCost(tier, householdSize, county);
  const derived = useMemo(() => priceFromMonthlyBudget({
    monthlyBudget, annualRate: rate, termYears: 30, downPaymentPercent: 0,
    propertyTaxRate: taxRate, annualInsurance: insurance, monthlyHoa: hoa,
    monthlyUtilities: utilities, monthlyMaintenance: maintenance,
  }), [monthlyBudget, rate, taxRate, insurance, hoa, utilities, maintenance]);

  const derivedHigherRate = useMemo(() => priceFromMonthlyBudget({
    monthlyBudget, annualRate: rate + 0.22, termYears: 30, downPaymentPercent: 0,
    propertyTaxRate: taxRate, annualInsurance: insurance, monthlyHoa: hoa,
    monthlyUtilities: utilities, monthlyMaintenance: maintenance,
  }), [monthlyBudget, rate, taxRate, insurance, hoa, utilities, maintenance]);

  const familyPrice = useDerivedPrice ? Math.round(derived.price / 1000) * 1000 : manualPrice;
  const delayCost = delayMonths * carryPerMonth;
  const costToCreate = costs.reduce((s, c) => s + c.value, 0) + delayCost;
  const knownSources = familyPrice + subsidies + earned;
  const fundraising = Math.max(0, costToCreate - knownSources);
  const surplus = Math.max(0, knownSources - costToCreate);
  const rateSensitivity = derived.price - derivedHigherRate.price;

  const bars = [
    { label: 'Family pays (price)', value: familyPrice, color: 'var(--accent)' },
    { label: 'Public subsidies', value: subsidies, color: '#3454B4' },
    { label: 'Earned income', value: earned, color: '#8E4B7C' },
    { label: 'Fundraising gap', value: fundraising, color: 'var(--color-gold)' },
  ];
  const barTotal = Math.max(costToCreate, knownSources) || 1;

  return (
    <Section
      id="gap"
      kicker="Lane 3 · Fund it"
      title="Fund the gap: will this home balance to $0?"
      intro={
        <Explain
          plain="Every affordable home has to balance: what the family can pay + public subsidies + earned income + fundraising − the cost to create the home = $0. The family's price is not set by the market. It is set by their income, using California's 'affordable housing cost' rule (Health & Safety Code §50052.5), today's rate, taxes, and insurance. Whatever is left over is the gap donors must fill."
          eli5="Building a home costs a big pile of money. The family pays the part that fits their paycheck. Government helpers pay some. Rent from the building while it waits pays a little. Whatever is still missing is the gap, and kind donors fill it so the pile adds up exactly."
        />
      }
    >
      <p className="mb-6 px-3 py-2 border-l-4 border-gold bg-gold/10 text-sm">
        <strong>SYNTHETIC example.</strong> The starting numbers are the made-up one-home deal from the challenge brief.
        They are rounded assumptions for testing, not a real project, program, city, or buyer. Change any of them.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Step 1: family price */}
        <div className="panel !mb-0">
          <p className="kicker mb-2">Step 1</p>
          <h3 className="display text-2xl font-semibold mb-1">What can the family pay?</h3>
          <p className="text-sm text-muted mb-4">Derived from the 2026 {county} County income limits and §50052.5</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><CountySelect id="g-county" value={county} onChange={setCounty} /></div>
            <div>
              <label htmlFor="g-size" className="field-label">Household size</label>
              <select id="g-size" className="field" value={householdSize} onChange={(e) => setHouseholdSize(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="g-tier" className="field-label">Income group</label>
              <select id="g-tier" className="field" value={tier} onChange={(e) => setTier(e.target.value)}>
                {Object.entries(STATUTE_TIERS).map(([id, t]) => (
                  <option key={id} value={id}>{t.label} ({Math.round(t.costShare * 100)}% × {Math.round(t.amiShare * 100)}% AMI)</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="g-rate" className="field-label">Mortgage rate (%)</label>
              <input id="g-rate" type="number" step={0.01} min={0} max={15} className="field" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
              <p className="text-xs text-muted mt-1">Freddie Mac 30-yr: {RATE_INFO.value}% ({RATE_INFO.asOf})</p>
            </div>
            <div>
              <label htmlFor="g-tax" className="field-label">Property tax rate (%)</label>
              <input id="g-tax" type="number" step={0.05} min={0} max={3} className="field" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
              <p className="text-xs text-muted mt-1">Assumption: ~1% + local assessments</p>
            </div>
            <MoneyInput id="g-ins" label="Insurance / year" value={insurance} onChange={setInsurance} step={100} hint="Assumption" />
            <MoneyInput id="g-hoa" label="HOA / month" value={hoa} onChange={setHoa} step={25} />
            <MoneyInput id="g-util" label="Utilities / month" value={utilities} onChange={setUtilities} step={25} hint="Counts toward housing cost" />
            <MoneyInput id="g-maint" label="Maintenance / month" value={maintenance} onChange={setMaintenance} step={25} />
          </div>

          <dl className="mt-5 border-t border-ink text-sm">
            <div className="flex justify-between py-2 border-b border-rule">
              <dt>{county} County AMI for {householdSize} {householdSize === 1 ? 'person' : 'people'} (2026)</dt>
              <dd className="num">{formatCurrency(amiForHousehold(householdSize, county))}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-rule">
              <dt>Affordable housing cost / month</dt>
              <dd className="num">{formatCurrency(monthlyBudget)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-rule">
              <dt>Minus insurance, HOA, utilities, upkeep</dt>
              <dd className="num">−{formatCurrency(derived.fixed)}</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-rule">
              <dt>Left for loan payment + property tax</dt>
              <dd className="num">{formatCurrency(Math.max(0, monthlyBudget - derived.fixed))}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="display text-5xl font-extrabold text-[var(--accent)]">{formatCurrency(derived.price)}</span>
            <span className="text-sm text-muted">affordable price (30-yr, 0% down)</span>
          </div>
          <p className="text-sm mt-2">
            If rates rise 0.22 points (the Oct→Nov 2026 move), this family can afford{' '}
            <strong className="num">{formatCurrency(rateSensitivity)}</strong> less, and the gap grows by the same amount.
          </p>
          <label className="flex items-center gap-2 mt-4 text-sm">
            <input type="checkbox" checked={!useDerivedPrice} onChange={(e) => setUseDerivedPrice(!e.target.checked)} />
            Use my own family price instead
          </label>
          {!useDerivedPrice && (
            <div className="mt-2 max-w-xs"><MoneyInput id="g-manual" label="Family price" value={manualPrice} onChange={setManualPrice} /></div>
          )}
        </div>

        {/* Step 2: the bill */}
        <div className="panel !mb-0">
          <p className="kicker mb-2">Step 2</p>
          <h3 className="display text-2xl font-semibold mb-4">The bill and who pays it</h3>
          <h4 className="field-label">Cost to create the home</h4>
          <div className="grid gap-3 mb-4">
            {costs.map((c) => (
              <MoneyInput
                key={c.id}
                id={`g-c-${c.id}`}
                label={c.label}
                value={c.value}
                onChange={(v) => setCosts(costs.map((x) => (x.id === c.id ? { ...x, value: v } : x)))}
              />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="g-delay" className="field-label">Schedule delay: {delayMonths} months</label>
              <input id="g-delay" type="range" min={0} max={24} value={delayMonths} onChange={(e) => setDelayMonths(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </div>
            <MoneyInput id="g-carry" label="Carrying cost / month of delay" value={carryPerMonth} onChange={setCarryPerMonth} step={500} hint="Assumption" />
          </div>
          <h4 className="field-label">Paid by</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            <MoneyInput id="g-sub" label="Public subsidies" value={subsidies} onChange={setSubsidies} hint="City, county, state (e.g. CalHome, HOME)" />
            <MoneyInput id="g-earn" label="Earned income while waiting" value={earned} onChange={setEarned} hint="e.g. rent from an existing building" />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="panel mt-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <p className="kicker mb-1">The result</p>
            <p className="display text-4xl font-extrabold">
              {fundraising > 0 ? <>Raise {formatCurrency(fundraising)}</> : <>Balanced, {formatCurrency(surplus)} to spare</>}
            </p>
          </div>
          <p className="num text-sm text-muted">Cost to create: {formatCurrency(costToCreate)}{delayCost > 0 && ` (incl. ${formatCurrency(delayCost)} delay)`}</p>
        </div>
        <div className="flex h-10 border border-line rounded-2xl" role="img" aria-label="How the cost is paid">
          {bars.filter((b) => b.value > 0).map((b) => (
            <div key={b.label} style={{ width: `${(b.value / barTotal) * 100}%`, background: b.color }} title={`${b.label}: ${formatCurrency(b.value)}`} />
          ))}
        </div>
        <ul className="grid sm:grid-cols-4 gap-3 mt-3 text-sm">
          {bars.map((b) => (
            <li key={b.label} className="flex items-center gap-2">
              <span className="w-3 h-3 shrink-0" style={{ background: b.color }} />
              <span>{b.label}: <span className="num">{formatCurrency(b.value)}</span></span>
            </li>
          ))}
        </ul>
        <Explain
          className="mt-5 text-sm leading-relaxed"
          plain="Try the delay slider. Each month a project waits, interest, taxes, and insurance keep running, but the family's price does not go up, so every extra dollar lands on the fundraising gap. In the typical project behind this example, a 10-month slip made the fundraising needed grow about seven times."
          eli5="Waiting is expensive. Every month the house is not finished, bills keep coming. The family cannot pay more, so donors have to cover those extra bills."
        />
      </div>
    </Section>
  );
}
