import Section, { SourceTag } from './Section';
import Explain from './Explain';
import { PROP1, ENERGY_CODE, DOC_SOURCES } from '../../data/ocFacts';

export default function WhatsChanging() {
  return (
    <Section
      id="changing"
      kicker="New in 2026"
      title="What's changing that could help you"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <article className="panel !mb-0">
          <p className="kicker mb-2">On the ballot</p>
          <h3 className="display text-2xl font-semibold mb-3">Proposition 1: {PROP1.total} for housing</h3>
          <p className="text-xs mb-3 px-2 py-1 inline-block bg-gold/30 font-semibold">{PROP1.status}</p>
          <Explain plain={PROP1.plain} eli5={PROP1.eli5} className="text-sm leading-relaxed mb-4" />
          <h4 className="field-label">Money aimed at buyers</h4>
          <ul className="border-t border-ink mb-4">
            {PROP1.homebuyerLines.map((l) => (
              <li key={l.what} className="py-2 border-b border-rule text-sm flex gap-3">
                <span className="num font-medium shrink-0 w-28">{l.amount}</span>
                <span>{l.what}</span>
              </li>
            ))}
          </ul>
          <details className="text-sm">
            <summary className="cursor-pointer font-semibold">The rest of the $10B</summary>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted">
              {PROP1.otherLines.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </details>
          <div className="mt-3"><SourceTag source="prop1" sources={DOC_SOURCES} /></div>
        </article>

        <article className="panel !mb-0">
          <p className="kicker mb-2">Lower bills in new homes</p>
          <h3 className="display text-2xl font-semibold mb-3">California&rsquo;s 2025 Energy Code</h3>
          <Explain plain={ENERGY_CODE.plain} eli5={ENERGY_CODE.eli5} className="text-sm leading-relaxed mb-4" />
          <ul className="border-t border-ink">
            {ENERGY_CODE.points.map((p) => (
              <li key={p} className="py-2 border-b border-rule text-sm">{p}</li>
            ))}
          </ul>
          <p className="text-sm mt-4">
            <strong>Tip:</strong> when comparing an older home with a newer, efficient one at a similar price, ask for
            the last 12 months of utility bills. A $150/month difference is $54,000 over 30 years.
          </p>
          <div className="mt-3"><SourceTag source="energy" sources={DOC_SOURCES} /></div>
        </article>
      </div>

      <article className="panel mt-6 !mb-0">
        <p className="kicker mb-2">Also projected to pass</p>
        <h3 className="display text-2xl font-semibold mb-3">Proposition 37: loans for brand-new homes</h3>
        <Explain
          className="text-sm leading-relaxed"
          plain="Lets CalHFA issue up to $25 billion in revenue bonds for loans covering up to 17% of the price of newly built homes, for buyers earning up to twice the area median (price limits to be set by CalHFA). It is repaid monthly, not deferred, and it isn't available yet: CalHFA must design it first. In Orange County, few new homes are affordable, so watch for it but don't build your plan around it."
          eli5="Voters said yes to a new helper for brand-new houses. It is like a new store that was just approved but has not opened its doors yet."
        />
        <a href="https://lao.ca.gov/BallotAnalysis/Proposition?number=37&year=2026" target="_blank" rel="noreferrer" className="text-[.7rem] text-muted underline">Source: Legislative Analyst's Office</a>
      </article>
    </Section>
  );
}
