import { formatCurrency } from '../utils/formatters';
import { calculateRequiredSalary } from '../utils/affordability';

export default function SalaryRequirement({ totalMonthly, maxDTI }) {
  if (!totalMonthly || totalMonthly <= 0) return null;

  const requiredSalary = calculateRequiredSalary(totalMonthly, maxDTI);

  return (
    <section className="panel !bg-[var(--accent)] !text-paper !border-0 rise" style={{ '--i': 5 }}>
      <h3 className="kicker !text-paper/60 mb-3">Salary requirement</h3>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="display text-5xl font-extrabold text-paper">{formatCurrency(requiredSalary)}</span>
        <span className="text-paper/70 text-sm">minimum annual gross salary</span>
      </div>
      <p className="text-xs text-paper/50 mt-3">
        So this payment is {maxDTI}% of your gross income, the share you chose with the slider (30–35%).
      </p>
    </section>
  );
}
