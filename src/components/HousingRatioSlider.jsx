import { useStore } from '../store/useStore';
import { useT } from '../i18n';
import Explain from './funding/Explain';
import { formatCurrency } from '../utils/formatters';

const LABELS = { 30: 'Comfortable', 31: 'Comfortable', 32: 'Moderate', 33: 'Moderate', 34: 'Stretch', 35: 'Stretch' };

/**
 * One shared setting for the share of gross income that goes to the house payment (30–35%).
 * Shows the dollar amount when an annual income is given.
 */
export default function HousingRatioSlider({ income, id = 'housing-ratio', compact = false }) {
  const t = useT();
  const ratio = useStore((s) => s.housingRatio ?? 30);
  const setRatio = useStore((s) => s.setHousingRatio);
  const monthly = income ? (income / 12) * (ratio / 100) : null;
  const level = LABELS[ratio];

  return (
    <div className={`ratio-slider ${compact ? 'is-compact' : ''}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="field-label !mb-0">{t('House payment as a share of income (DTI)')}</label>
        <span className="ratio-value">
          <span className="num">{ratio}%</span>
          <span className={`ratio-badge ratio-${level.toLowerCase()}`}>{t(level)}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={30}
        max={35}
        step={1}
        value={ratio}
        onChange={(e) => setRatio(Number(e.target.value))}
        aria-valuetext={`${ratio}% ${t(level)}`}
        className="ratio-range"
        style={{ '--fill': `${((ratio - 30) / 5) * 100}%` }}
      />
      <div className="ratio-scale" aria-hidden="true">
        {[30, 31, 32, 33, 34, 35].map((n) => <span key={n} className={n === ratio ? 'is-on' : ''}>{n}%</span>)}
      </div>
      {monthly != null && (
        <p className="mt-2">
          {t('That\'s about {amount} a month for your mortgage, taxes, and insurance.', { amount: formatCurrency(monthly) })}
        </p>
      )}
      {!compact && (
        <Explain
          className="text-sm text-muted mt-2"
          plain="Counselors suggest keeping your house payment (loan, taxes, insurance) at 30–35% of your income before taxes. 30% leaves more room for food, childcare, and emergencies; 35% is a stretch. Lenders also check that all your debts together, including the house, stay under about 43%."
          eli5="Out of every $100 you earn, try to spend $30 to $35 on your home. Less is safer."
        />
      )}
    </div>
  );
}
