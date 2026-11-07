import { useT } from '../i18n';
import { SERVICE_GROUPS, SERVICES } from '../data/externalServices';

/** Every outside organization, data source, service, and tool, with official links. */
export default function ExternalServicesList({ groups }) {
  const t = useT();
  const shown = SERVICE_GROUPS.filter((g) => !groups || groups.includes(g.id));
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {shown.map((g) => (
        <section key={g.id} className="card" aria-labelledby={`svc-${g.id}`}>
          <h3 id={`svc-${g.id}`} className="kicker mb-3">{t(g.title)}</h3>
          <ul className="space-y-1.5 text-sm">
            {SERVICES.filter((s) => s.group === g.id).map((s) => (
              <li key={s.url + s.name}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[var(--color-hfh-blue-strong)]">{t(s.name)}</a>
                <span className="text-muted" aria-hidden="true"> ↗</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
