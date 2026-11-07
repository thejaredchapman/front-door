import Section, { SourceTag } from './Section';
import Explain from './Explain';
import { HABITAT_OC_FACTS, HABITAT_MODEL, HABITAT_CITIES, DOC_SOURCES } from '../../data/ocFacts';

export default function HabitatSection() {
  return (
    <Section
      id="habitat"
      kicker="A different door"
      title="Habitat for Humanity of Orange County"
      intro={
        <Explain
          plain="Habitat is not a handout. Families are chosen based on need, ability to pay an affordable mortgage, and willingness to partner, which means putting in sweat-equity hours and taking homebuyer classes. In return they buy a home at cost, with a mortgage sized to what they can actually afford."
          eli5="Habitat is like a team building a treehouse together. You help build, you take some classes, and then you get to buy the house at a fair price that fits your family's money."
        />
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-5 border border-line rounded-2xl bg-card mb-2">
        {HABITAT_OC_FACTS.map((f, i) => (
          <div key={f.label} className={`p-4 ${i > 0 ? 'md:border-l-[1.5px] border-ink' : ''} ${i % 2 === 1 ? 'border-l-[1.5px]' : ''} ${i > 1 ? 'border-t-[1.5px] md:border-t-0' : ''}`}>
            <div className="display text-3xl font-extrabold text-[var(--accent)]">{f.value}</div>
            <div className="text-sm mt-1 leading-snug">{f.label}</div>
          </div>
        ))}
      </div>
      <SourceTag source="impact" sources={DOC_SOURCES} />

      <h3 className="display text-2xl font-semibold mt-8 mb-4">How a Habitat home is paid for</h3>
      <ol className="grid md:grid-cols-2 gap-5">
        {HABITAT_MODEL.map((m, i) => (
          <li key={m.title} className="panel !mb-0">
            <div className="num text-xs text-muted mb-1">{String(i + 1).padStart(2, '0')}</div>
            <h4 className="display text-xl font-semibold mb-2">{m.title}</h4>
            <Explain plain={m.plain} eli5={m.eli5} className="text-sm leading-relaxed" />
          </li>
        ))}
      </ol>
      <div className="mt-2"><SourceTag source="audit" sources={DOC_SOURCES} /></div>

      <blockquote className="mt-8 p-5 border-l-4 border-[var(--accent)] bg-card">
        <p className="display text-lg italic leading-relaxed">
          &ldquo;Today, we are proud to say that I am the first immigrant in my family to own a home. Words can&rsquo;t
          describe what this means: it is safety, security, and a foundation for our children&rsquo;s future.&rdquo;
        </p>
        <footer className="text-sm text-muted mt-2">The Hassan family, Habitat OC homeowners (2025 Impact Report)</footer>
      </blockquote>

      <div className="mt-8 grid md:grid-cols-3 gap-5">
        <div className="panel !mb-0 md:col-span-2">
          <h4 className="kicker mb-3">How to start with Habitat OC</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm leading-relaxed">
            <li>Attend a free online homeownership orientation (907 people attended one last year).</li>
            <li>Check the income range and household-size requirements for the current build. These change with each project.</li>
            <li>Gather 2 years of tax returns, recent pay stubs, and bank statements.</li>
            <li>Apply during an open application window. Selection looks at <strong>need</strong>, <strong>ability to pay</strong>, and <strong>willingness to partner</strong>.</li>
            <li>If selected: complete sweat-equity hours and homebuyer education, then close on your home.</li>
          </ol>
          <a href="https://www.habitatoc.org/" target="_blank" rel="noreferrer" className="btn-link inline-block mt-4">HabitatOC.org →</a>
        </div>
        <div className="panel !mb-0">
          <h4 className="kicker mb-3">Already own? Need repairs?</h4>
          <Explain
            plain="Habitat OC's Home Preservation Program helps seniors and very low- and low-income owners with critical repairs and accessibility changes, so they can stay safely in their homes. 50 projects were completed last year."
            eli5="If your house is broken in a way that makes it unsafe, Habitat can help fix it so you can keep living there."
            className="text-sm leading-relaxed"
          />
        </div>
      </div>

      <p className="text-xs text-muted mt-6">
        Habitat OC has built homes in: {HABITAT_CITIES.join(', ')}.
      </p>
    </Section>
  );
}
