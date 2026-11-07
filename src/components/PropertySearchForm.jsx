import { useStore } from '../store/useStore';
import { MORTGAGE } from '../data/loanProducts';
import CitySelector from './CitySelector';
import HousingRatioSlider from './HousingRatioSlider';

export default function PropertySearchForm() {
  const {
    propertyPrice, downPaymentPercent, interestRate, loanTerm,
    setPropertyPrice, setDownPaymentPercent, setInterestRate, setLoanTerm,
  } = useStore();

  const product = MORTGAGE;

  return (
    <section className="panel relative z-20 rise" style={{ '--i': 2 }}>
      <h3 className="kicker mb-5">Property details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label htmlFor="price" className="field-label">Property price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
            <input id="price" type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="field !pl-7" min={0} step={1000} />
          </div>
        </div>
        <div>
          <label htmlFor="down" className="field-label">Down payment (%)</label>
          <input id="down" type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="field" min={product.minDownPaymentPercent} max={100} step={1} />
        </div>
        <div>
          <label htmlFor="rate" className="field-label">Interest rate (%)</label>
          <input id="rate" type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="field" min={0} max={30} step={0.125} />
        </div>
        <div>
          <label htmlFor="term" className="field-label">Loan term</label>
          <select id="term" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="field">
            {product.terms.map((t) => (
              <option key={t} value={t}>{t} {t === 1 ? 'year' : 'years'}</option>
            ))}
          </select>
        </div>
        {product.id === 'home' && <CitySelector />}
      </div>

      <div className="mt-6"><HousingRatioSlider id="ratio-property" compact /></div>

      {product.id === 'home' && downPaymentPercent < 20 && (
        <p className="mt-5 px-3 py-2 border-l-4 border-gold bg-gold/10 text-sm">
          Down payment below 20% — PMI will be included in your payment estimate.
        </p>
      )}
    </section>
  );
}
