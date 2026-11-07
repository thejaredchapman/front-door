import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import { GLOSSARY } from '../../data/glossary';

export default function GlossarySection() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const items = q
    ? GLOSSARY.filter((g) => g.term.toLowerCase().includes(q) || g.plain.toLowerCase().includes(q))
    : GLOSSARY;

  return (
    <Section
      id="glossary"
      kicker="Words lenders use"
      title="The homebuying dictionary"
      intro={
        <Explain
          plain="Lenders and programs use a lot of jargon. Here is what each word actually means. Flip on 'Explain it like I'm 5' at the top for the simplest version."
          eli5="Grown-ups use big words for money stuff. Here they are in small words."
        />
      }
    >
      <label htmlFor="glossary-search" className="field-label">Search a word</label>
      <input
        id="glossary-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. AMI, silent second, DTI"
        className="field max-w-md mb-6 !font-sans"
      />
      <dl className="grid md:grid-cols-2 gap-x-8 border-t-2 border-ink">
        {items.map((g) => (
          <div key={g.term} className="py-4 border-b border-rule">
            <dt className="display text-lg font-semibold">{g.term}</dt>
            <dd><Explain plain={g.plain} eli5={g.eli5} className="text-sm leading-relaxed mt-1" /></dd>
          </div>
        ))}
        {items.length === 0 && <p className="py-4 text-sm text-muted italic">No matching words.</p>}
      </dl>
    </Section>
  );
}
