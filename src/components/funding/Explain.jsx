import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';

/**
 * Shows the plain-English version of a passage, with an "Explain it to me"
 * button that reveals the simple (explain-like-I'm-5) version right below it.
 * When the page-wide switch is ON, the simple version shows first instead.
 * The simple versions are pre-written, so a click costs nothing and works offline.
 */
export default function Explain({ plain, eli5, as = 'p', className = '' }) {
  const Tag = as;
  const t = useT();
  const simpleMode = useStore((s) => s.eli5);
  const [open, setOpen] = useState(false);

  if (!eli5) return <Tag className={className}>{t(plain)}</Tag>;

  const primary = t(simpleMode ? eli5 : plain);
  const secondary = t(simpleMode ? plain : eli5);
  const buttonLabel = t(simpleMode
    ? (open ? 'Hide the details' : 'Show me the details')
    : (open ? 'Got it, hide this' : 'Explain it to me'));

  return (
    <div className={className}>
      <Tag className={simpleMode ? 'eli5-text' : ''}>{primary}</Tag>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="explain-btn mt-2"
      >
        <span aria-hidden="true">{open ? '−' : simpleMode ? '+' : '?'}</span>
        {buttonLabel}
      </button>
      {open && (
        <p className={`mt-2 p-3 border-s-4 ${simpleMode ? 'border-ink bg-paper' : 'border-gold bg-gold/10 eli5-text'}`}>
          {secondary}
        </p>
      )}
    </div>
  );
}

/** The switch that flips every passage on the page between plain and simple. */
export function Eli5Toggle() {
  const t = useT();
  const { eli5, setEli5 } = useStore();
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border border-line rounded-2xl bg-card">
      <span className="text-sm font-semibold" id="eli5-label">{t('Explain everything simply')}</span>
      <button
        type="button"
        role="switch"
        aria-checked={eli5}
        aria-labelledby="eli5-label"
        onClick={() => setEli5(!eli5)}
        className={`relative w-14 h-7 border border-line rounded-2xl cursor-pointer transition-colors ${eli5 ? 'bg-gold' : 'bg-paper'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-ink transition-transform ${eli5 ? 'translate-x-7' : 'translate-x-0.5'}`}
          aria-hidden="true"
        />
      </button>
      <span className="num text-xs text-muted">{eli5 ? 'ON: like I’m 5' : 'OFF: plain English'}</span>
    </div>
  );
}
