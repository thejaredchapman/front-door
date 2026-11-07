import { useT } from '../../i18n';

/** Shared wrapper so every guide section has the same anchor, kicker and heading rhythm. */
export default function Section({ id, kicker, title, intro, children, className = '' }) {
  const t = useT();
  return (
    <section id={id} className={`scroll-mt-6 mb-14 ${className}`} aria-labelledby={`${id}-title`}>
      {kicker && <p className="kicker mb-2">{t(kicker)}</p>}
      <h2 id={`${id}-title`} className="display text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
        {t(title)}
      </h2>
      {intro && <div className="max-w-3xl text-[1.05rem] leading-relaxed mb-6">{intro}</div>}
      {children}
    </section>
  );
}

export function SourceTag({ source, sources }) {
  const s = sources[source];
  if (!s) return null;
  return (
    <a href={s.url} target="_blank" rel="noreferrer" className="text-[.7rem] text-muted underline underline-offset-2 hover:text-ink" title={s.title}>
      Source: {s.title.split(',')[0]}
    </a>
  );
}
