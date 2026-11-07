import Section, { SourceTag } from './Section';
import Explain from './Explain';
import { OC_REALITY, DOC_SOURCES, HOUSING_ELEMENT } from '../../data/ocFacts';
import { formatCurrency } from '../../utils/formatters';

export default function RealityCheck() {
  return (
    <Section
      id="reality"
      kicker="Why it feels impossible"
      title="It's not you. The math is hard here."
      intro={
        <Explain
          plain="In Orange County, a home costs about ten times what a typical household earns. A home is usually called affordable at about four times income. That gap is why almost nobody on a modest paycheck buys here without help, and why the help described below exists."
          eli5="Imagine a toy costs 10 weeks of allowance, but most kids can only save 4 weeks' worth. That is how houses feel here. It is not because you did something wrong. It is why grown-ups made helper programs."
        />
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-5 border border-line rounded-2xl bg-card">
        {OC_REALITY.map((f, i) => (
          <div key={f.label} className={`p-4 ${i > 0 ? 'md:border-l-[1.5px] border-ink' : ''} ${i % 2 === 1 ? 'border-l-[1.5px]' : ''} ${i > 1 ? 'border-t-[1.5px] md:border-t-0' : ''}`}>
            <div className="display text-3xl font-extrabold text-[var(--accent)]">{f.value}</div>
            <div className="text-sm mt-1 leading-snug">{f.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-2"><SourceTag source="impact" sources={DOC_SOURCES} /></div>

      <div className="panel mt-8">
        <h3 className="kicker mb-3">What the County's own numbers say</h3>
        <Explain plain={HOUSING_ELEMENT.plain} eli5={HOUSING_ELEMENT.eli5} className="mb-4 leading-relaxed" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="text-left text-xs text-muted mb-2">
              Estimated affordable purchase price, family of 4 (Housing Element Table 2-25, 2023 limits, 10% down, 4.5% rate)
            </caption>
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-4 field-label !mb-0">Income group</th>
                <th className="py-2 pr-4 field-label !mb-0">Income limit</th>
                <th className="py-2 field-label !mb-0">Affordable price</th>
              </tr>
            </thead>
            <tbody>
              {HOUSING_ELEMENT.affordability2023.map((r) => (
                <tr key={r.category} className="border-b border-rule">
                  <td className="py-2 pr-4">{r.category}</td>
                  <td className="py-2 pr-4 num">{formatCurrency(r.income)}</td>
                  <td className="py-2 num">{formatCurrency(r.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-3">
          At today&rsquo;s higher interest rates these prices would be lower still. That is the &ldquo;gap&rdquo; the
          programs on this page are designed to fill. <SourceTag source="housingElement" sources={DOC_SOURCES} />
        </p>
      </div>
      <a href="#/learn/five-buyers" className="cta-band mt-8">
        <span className="display text-2xl font-bold">Is it just me? Meet five buyers, from low to ultra-high income</span>
        <span className="flip-rtl" aria-hidden="true">→</span>
      </a>
    </Section>
  );
}
