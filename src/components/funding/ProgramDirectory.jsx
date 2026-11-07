import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import ProgramCard from './ProgramCard';
import { PROGRAMS, PROGRAM_TYPES, STATUS_LABELS } from '../../data/programs';

export default function ProgramDirectory() {
  const [type, setType] = useState('all');
  const [showClosed, setShowClosed] = useState(false);

  const list = PROGRAMS
    .filter((p) => type === 'all' || p.type === type)
    .filter((p) => showClosed || p.status !== 'closed');
  const typesInUse = Object.entries(PROGRAM_TYPES).filter(([id]) => PROGRAMS.some((p) => p.type === id));

  return (
    <Section
      id="all-programs"
      kicker="Every option"
      title="All the ways to get funded"
      intro={
        <Explain
          plain="Most buyers combine several of these: a first mortgage, plus one or two down payment helpers, plus a tax credit. Filter by type to see how each kind works."
          eli5="Buying a home is like building with blocks. You usually use a few different blocks together. Here are all the blocks."
        />
      }
    >
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter by type">
        <button type="button" onClick={() => setType('all')} aria-pressed={type === 'all'} className={`px-3 py-1.5 text-sm border border-line rounded-2xl cursor-pointer ${type === 'all' ? 'bg-ink text-paper' : 'bg-card'}`}>All</button>
        {typesInUse.map(([id, t]) => (
          <button key={id} type="button" onClick={() => setType(id)} aria-pressed={type === id} title={t.eli5} className={`px-3 py-1.5 text-sm border border-line rounded-2xl cursor-pointer ${type === id ? 'bg-ink text-paper' : 'bg-card'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {type !== 'all' && <p className="text-sm mb-3 eli5-text">In simple words: {PROGRAM_TYPES[type].eli5}</p>}
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} />
          Show programs that are not open now
        </label>
        <span className="text-muted">Status key:</span>
        {Object.entries(STATUS_LABELS).map(([id, s]) => (
          <span key={id} className={`px-2 py-0.5 font-semibold uppercase tracking-wider text-[.65rem] ${s.className}`}>{s.label}</span>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((p) => <ProgramCard key={p.id} program={p} />)}
      </div>
      {list.length === 0 && <p className="text-sm text-muted italic">Nothing open in this category right now. Tick "Show programs that are not open now" to see past ones.</p>}
    </Section>
  );
}
