import { useMemo } from 'react';
import Section from './Section';
import Explain from './Explain';
import ProgramCard from './ProgramCard';
import { useStore } from '../../store/useStore';
import { getIncomeCategory, getPercentOfAmi, getLimitsForSize } from '../../data/incomeLimits';
import { OCCUPATIONS, matchPrograms } from '../../data/programs';
import { formatCurrency } from '../../utils/formatters';
import CountySelect from '../CountySelect';

const BANDS = [
  { id: 'extremelyLow', label: 'Extremely low' },
  { id: 'veryLow', label: 'Very low' },
  { id: 'low', label: 'Low' },
  { id: 'moderate', label: 'Moderate' },
];

export default function IncomeFit() {
  const {
    county, setCounty,
    householdSize, householdIncome, occupation, isFirstTimeBuyer, isVeteran,
    setHouseholdSize, setHouseholdIncome, setOccupation, setIsFirstTimeBuyer, setIsVeteran,
  } = useStore();

  const category = getIncomeCategory(householdIncome, householdSize, county);
  const pct = getPercentOfAmi(householdIncome, householdSize, county);
  const limits = getLimitsForSize(householdSize, county);
  const isOC = county === 'Orange';
  const matches = useMemo(
    () => matchPrograms({ categoryId: category.id, occupation, isFirstTimeBuyer, isVeteran }),
    [category.id, occupation, isFirstTimeBuyer, isVeteran],
  );
  const maxBar = limits.moderate * 1.15;

  return (
    <Section
      id="fit"
      kicker="Step 1 · Start here"
      title="Where do I fit?"
      intro={
        <Explain
          plain="Answer four questions. We compare your household to the official 2026 Orange County income limits and show the programs you could use, best matches first."
          eli5="Tell us how many people live with you and how much money your family makes in a year. We will show you which helpers can help you."
        />
      }
    >
      <div className="panel">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <CountySelect id="f-county" value={county} onChange={setCounty} />
          <div>
            <label htmlFor="f-size" className="field-label">People in your household</label>
            <select id="f-size" className="field" value={householdSize} onChange={(e) => setHouseholdSize(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="f-income" className="field-label">Total yearly income (before taxes)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
              <input id="f-income" type="number" min={0} step={1000} className="field !pl-7" value={householdIncome} onChange={(e) => setHouseholdIncome(Number(e.target.value))} />
            </div>
            <p className="text-xs text-muted mt-1">Add up everyone who will be on the loan or living there.</p>
          </div>
          <div>
            <label htmlFor="f-job" className="field-label">Your job</label>
            <select id="f-job" className="field" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
              {OCCUPATIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          <fieldset className="space-y-2">
            <legend className="field-label">About you</legend>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isFirstTimeBuyer} onChange={(e) => setIsFirstTimeBuyer(e.target.checked)} />
              No home owned in the last 3 years
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isVeteran} onChange={(e) => setIsVeteran(e.target.checked)} />
              Veteran or service member
            </label>
          </fieldset>
        </div>

        <div className="mt-8 grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2">
            <p className="kicker mb-1">Your income group</p>
            <p className="display text-4xl font-extrabold text-[var(--accent)] leading-tight">{category.label}</p>
            <p className="num text-sm text-muted mt-1">
              {formatCurrency(householdIncome)} ≈ {pct.toFixed(0)}% of the area median for {householdSize} {householdSize === 1 ? 'person' : 'people'}
            </p>
            <Explain plain={category.plain} eli5={category.eli5} className="text-sm leading-relaxed mt-3" />
          </div>

          <div className="lg:col-span-3" aria-label="Income limits chart">
            <p className="field-label">2026 {county} County income limits for {householdSize} {householdSize === 1 ? 'person' : 'people'}</p>
            <ul className="space-y-1.5">
              {BANDS.map((b) => {
                const isYou = category.id === b.id;
                return (
                  <li key={b.id} className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-2 text-sm">
                    <span className={isYou ? 'font-semibold' : ''}>{b.label}</span>
                    <span className="h-5 bg-paper border border-rule relative">
                      <span className="absolute inset-y-0 left-0" style={{ width: `${(limits[b.id] / maxBar) * 100}%`, background: isYou ? 'var(--accent)' : 'var(--color-rule)' }} />
                    </span>
                    <span className="num text-right">{formatCurrency(limits[b.id])}</span>
                  </li>
                );
              })}
              <li className="grid grid-cols-[6.5rem_1fr_5.5rem] items-center gap-2 text-sm">
                <span className="font-semibold">You</span>
                <span className="h-5 relative">
                  <span className="absolute inset-y-0 left-0 bg-gold border border-ink" style={{ width: `${Math.min(100, (householdIncome / maxBar) * 100)}%` }} />
                </span>
                <span className="num text-right font-semibold">{formatCurrency(householdIncome)}</span>
              </li>
            </ul>
            <p className="text-xs text-muted mt-2">
              Source: California HCD 2026 State Income Limits (June 23, 2026). {county} County area median income:{' '}
              {formatCurrency(limits.median)} for {householdSize} {householdSize === 1 ? 'person' : 'people'}.
              CalHFA and some lenders use their own, higher limits.
            </p>
          </div>
        </div>
      </div>

      {!isOC && (
        <p className="mb-4 p-3 border-l-4 border-gold bg-gold/10 text-sm">
          The programs below were researched for <strong>Orange County</strong>. Statewide and federal ones (CalHFA, FHA, VA,
          HomeReady, GSFA) work in {county} County too. For city, county, and Habitat programs, look for your local version.
          A free HUD counselor (hud.gov/findacounselor) can tell you what is open near you.
        </p>
      )}
      <h3 className="display text-2xl font-semibold mb-1">Programs you could use ({matches.length})</h3>
      <p className="text-sm text-muted mb-4">
        Best matches first. &ldquo;Unverified&rdquo; means we could not confirm current terms at the source, so call before you count on it.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matches.map((p) => <ProgramCard key={p.id} program={p} highlight={p.forYourJob} />)}
      </div>
    </Section>
  );
}
