import { useMemo, useState } from 'react';
import Explain from '../funding/Explain';
import { useStore } from '../../store/useStore';
import { MATRIX_COLUMNS, LOANS, loanFit, loanCost } from '../../data/loanMatrix';
import { DEFAULT_ANSWERS } from '../../data/plans';
import { formatCurrency } from '../../utils/formatters';

const BADGE = {
  yes: { t: 'You may qualify', c: 'bg-[var(--accent)] text-paper' },
  maybe: { t: 'Check', c: 'bg-gold text-ink' },
  no: { t: 'Not now', c: 'bg-rule text-ink' },
};

export default function LoanMatrix() {
  const stored = useStore((s) => s.planAnswers);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const [price, setPrice] = useState(500000);
  const [sortBy, setSortBy] = useState('fit');
  const [onlyMine, setOnlyMine] = useState(false);
  const [sel, setSel] = useState({ loan: 'fha', col: 'down' });

  const rows = useMemo(() => {
    const order = { yes: 0, maybe: 1, no: 2 };
    let list = LOANS.map((l) => ({ ...l, fit: loanFit(l, a), cost: loanCost(l, price, a) }));
    if (onlyMine) list = list.filter((l) => l.fit.level !== 'no');
    return list.sort((x, y) => {
      if (sortBy === 'monthly') return x.cost.monthly - y.cost.monthly;
      if (sortBy === 'cash') return x.cost.cash - y.cost.cash;
      return order[x.fit.level] - order[y.fit.level];
    });
  }, [a, price, sortBy, onlyMine]);

  const selLoan = LOANS.find((l) => l.id === sel.loan);
  const selCol = MATRIX_COLUMNS.find((c) => c.id === sel.col);
  const cell = selLoan?.cells[sel.col];

  return (
    <section id="matrix" className="mt-12 scroll-mt-6" aria-labelledby="matrix-title">
      <p className="kicker mb-2">Compare every loan</p>
      <h3 id="matrix-title" className="display text-3xl font-extrabold mb-2">The loan matrix</h3>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="Every major loan type side by side. Rows are checked against your check-in answers. Tap any box to see what it means in detail. Payments are estimates at this week's average 30-year rate, with 1.1% property tax, $1,800/yr insurance, and closing costs of about 3%."
        eli5="This is a big chart of all the kinds of house loans. Tap any box and it will explain itself."
      />

      <div className="flex flex-wrap items-end gap-4 mb-4 print:hidden">
        <div>
          <label htmlFor="m-price" className="field-label">Home price to test</label>
          <input id="m-price" type="number" min={0} step={10000} className="field !py-1.5 w-40" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label htmlFor="m-sort" className="field-label">Sort by</label>
          <select id="m-sort" className="field !py-1.5" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="fit">Best fit for me</option>
            <option value="monthly">Lowest monthly payment</option>
            <option value="cash">Least cash up front</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} /> Only loans I might qualify for
        </label>
      </div>

      <div className="overflow-x-auto border border-line rounded-2xl bg-card">
        <table className="text-sm min-w-[1100px] w-full">
          <thead>
            <tr className="border-b-2 border-ink text-left align-bottom">
              <th className="p-2 sticky left-0 bg-card z-10 w-56 field-label !mb-0">Loan</th>
              <th className="p-2 field-label !mb-0">Cash up front*</th>
              <th className="p-2 field-label !mb-0">Monthly*</th>
              {MATRIX_COLUMNS.map((c) => (
                <th key={c.id} className="p-2">
                  <button type="button" onClick={() => setSel({ ...sel, col: c.id })} className={`field-label !mb-0 text-left cursor-pointer underline decoration-dotted underline-offset-2 ${sel.col === c.id ? '!text-ink' : ''}`}>
                    {c.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => {
              const b = BADGE[l.fit.level];
              return (
                <tr key={l.id} className={`border-b border-rule align-top ${l.fit.level === 'no' ? 'opacity-60' : ''}`}>
                  <th scope="row" className="p-2 sticky left-0 bg-card z-10 text-left font-normal">
                    <span className={`text-[.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 ${b.c}`}>{b.t}</span>
                    <div className="font-semibold mt-1 leading-tight">{l.name}</div>
                    <div className="text-xs text-muted">{l.tagline}</div>
                    {l.fit.notes.length > 0 && <div className="text-[.7rem] text-muted mt-1">{l.fit.notes.join(' ')}</div>}
                  </th>
                  <td className="p-2 num">{formatCurrency(l.cost.cash)}{l.cost.help > 0 && <div className="text-[.7rem] text-muted">+ {formatCurrency(l.cost.help)} deferred help</div>}</td>
                  <td className="p-2 num font-semibold">{formatCurrency(l.cost.monthly)}{l.calc.habitat && <div className="text-[.7rem] text-muted font-normal">≈30% of income</div>}</td>
                  {MATRIX_COLUMNS.map((c) => {
                    const active = sel.loan === l.id && sel.col === c.id;
                    return (
                      <td key={c.id} className="p-1">
                        <button
                          type="button"
                          onClick={() => setSel({ loan: l.id, col: c.id })}
                          aria-pressed={active}
                          className={`w-full text-left p-1.5 cursor-pointer border ${active ? 'border-ink bg-gold/30' : 'border-transparent hover:border-rule hover:bg-paper'}`}
                        >
                          {l.cells[c.id].v}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted mt-2">* Estimates. Cash up front = your down payment + ~3% closing costs (help like ZIP or seller credits can lower it). Monthly includes mortgage insurance, tax, and insurance. Private loans use an example rate premium (+0.5 to +4.5 points over the average rate); real quotes vary.</p>

      {selLoan && selCol && (
        <div className="panel mt-4" aria-live="polite">
          <p className="kicker mb-1">{selLoan.name} · {selCol.label}</p>
          <p className="display text-2xl font-semibold mb-2">{cell.v}</p>
          {cell.d && <p className="text-sm leading-relaxed mb-3">{cell.d}</p>}
          <div className="border-t border-rule pt-3">
            <p className="field-label">What &ldquo;{selCol.label}&rdquo; means</p>
            <Explain plain={selCol.plain} eli5={selCol.eli5} className="text-sm leading-relaxed" />
          </div>
        </div>
      )}
    </section>
  );
}
