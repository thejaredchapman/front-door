import { useState } from 'react';
import Explain from './Explain';
import { PROGRAM_TYPES, STATUS_LABELS } from '../../data/programs';

export default function ProgramCard({ program: p, highlight = false }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_LABELS[p.status];
  const type = PROGRAM_TYPES[p.type];

  return (
    <article className={`bg-card border border-line rounded-2xl p-4 flex flex-col ${highlight ? 'shadow-soft ring-2 ring-[var(--accent)]' : 'shadow-soft'}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 ${status.className}`}>{status.label}</span>
        <span className="text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 border border-ink">{type.label}</span>
        {p.forYourJob && <span className="text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 bg-ink text-gold">For your job</span>}
      </div>
      <h4 className="display text-xl font-semibold leading-tight">{p.name}</h4>
      <p className="text-xs text-muted mb-3">{p.org}</p>

      <p className="text-sm mb-1"><strong>What you get:</strong> {p.gives}</p>
      <Explain plain={p.plain} eli5={p.eli5} className="text-sm text-muted mb-2" />

      {open && (
        <div className="text-sm space-y-2 mt-2 pt-3 border-t border-rule">
          <p><strong>Who qualifies:</strong> {p.who}</p>
          <p><strong>The catch:</strong> {p.catch}</p>
          {p.contact && <p><strong>Contact:</strong> {p.contact}</p>}
          {p.links?.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-link block">{l.label} →</a>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1 items-center">
        <button type="button" className="btn-link" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Less' : 'Who qualifies & the catch'}
        </button>
        <a href={p.url} target="_blank" rel="noreferrer" className="btn-link">Official page →</a>
      </div>
    </article>
  );
}
