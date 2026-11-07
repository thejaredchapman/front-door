import { useT } from '../../i18n';

/** One question card. */
export function Q({ n, title, help, children }) {
  const t = useT();
  return (
    <fieldset className="q-card">
      <legend className="sr-only">{t(title)}</legend>
      <div className="flex gap-3 items-baseline mb-3">
        <span className="q-num" aria-hidden="true">{n}</span>
        <p className="display text-xl font-semibold leading-snug">{t(title)}</p>
      </div>
      {children}
      {help && <p className="text-sm text-muted mt-3 leading-relaxed">💡 {t(help)}</p>}
    </fieldset>
  );
}

/** Big, tappable single-choice buttons. */
export function Choices({ name, value, options, onChange }) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={String(o.id)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={`chip ${on ? 'chip-on' : ''}`}
          >
            {t(o.label)}
          </button>
        );
      })}
    </div>
  );
}

export function Money({ id, value, onChange, step = 500 }) {
  return (
    <div className="relative max-w-xs">
      <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted num">$</span>
      <input id={id} type="number" inputMode="numeric" min={0} step={step} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value)))} className="field !ps-7" />
    </div>
  );
}

export function Check({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-3 text-base py-1 cursor-pointer">
      <input type="checkbox" className="w-5 h-5 accent-[var(--accent)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}
