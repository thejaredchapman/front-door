import { useStore } from '../store/useStore';
import { MORTGAGE } from '../data/loanProducts';
import CitySelector from './CitySelector';
import HousingRatioSlider from './HousingRatioSlider';

export default function SalarySearchForm() {
  const {
    annualSalary,
    setAnnualSalary, interestRate, loanTerm, downPaymentPercent,
    setInterestRate, setLoanTerm, setDownPaymentPercent,
  } = useStore();

  const product = MORTGAGE;

  return (
    <section className="panel relative z-20 rise" style={{ '--i': 2 }}>
      <h3 className="kicker mb-5">Salary &amp; budget</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label htmlFor="salary" className="field-label">Annual gross salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
            <input id="salary" type="number" value={annualSalary} onChange={(e) => setAnnualSalary(Number(e.target.value))} className="field !pl-7" min={0} step={5000} />
          </div>
        </div>
        <div>
          <label htmlFor="srate" className="field-label">Interest rate (%)</label>
          <input id="srate" type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="field" min={0} max={30} step={0.125} />
        </div>
        <div>
          <label htmlFor="sterm" className="field-label">Loan term</label>
          <select id="sterm" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="field">
            {product.terms.map((t) => (
              <option key={t} value={t}>{t} {t === 1 ? 'year' : 'years'}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sdown" className="field-label">Down payment (%)</label>
          <input id="sdown" type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="field" min={product.minDownPaymentPercent} max={100} step={1} />
        </div>
        {product.id === 'home' && <CitySelector />}
      </div>
      <div className="mt-6"><HousingRatioSlider income={annualSalary} id="ratio-salary" /></div>
    </section>
  );
}
