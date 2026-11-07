import { useState } from 'react';
import { useT } from '../../i18n';
import PageHeader from '../shell/PageHeader';
import { START_DEFAULT, START_PERSONAS } from '../../data/startHere';
import Mascot from '../Mascot';

function Route({ steps }) {
  const t = useT();
  return (
    <ol className="start-route">
      {steps.map((s, i) => (
        <li key={s.title}>
          <a href={s.href} className="start-step">
            <span className="start-n display">{i + 1}</span>
            <span className="min-w-0">
              <span className="start-title">{t(s.title)}</span>
              <span className="start-why">{t(s.why)}</span>
            </span>
            <span className="start-go flip-rtl" aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function StartHere() {
  const t = useT();
  const [who, setWho] = useState(null);
  const persona = START_PERSONAS.find((p) => p.id === who);

  return (
    <div className="page-narrow">
      <div className="flex justify-end -mb-6"><Mascot mood="wave" size={96} /></div>
      <PageHeader
        kicker="Start here"
        title="Your suggested plan"
        plain="Not sure where to begin? Follow these five steps, or pick what describes you for a shorter route."
        eli5="Don't know where to start? Do these steps in order."
      />

      <section aria-labelledby="who-title" className="mb-10">
        <h2 id="who-title" className="field-label">{t('Which describes you? (optional)')}</h2>
        <div className="flex flex-wrap gap-2">
          {START_PERSONAS.map((p) => (
            <button key={p.id} type="button" aria-pressed={who === p.id} onClick={() => setWho(who === p.id ? null : p.id)} className={`chip ${who === p.id ? 'chip-on' : ''}`}>
              {t(p.label)}
            </button>
          ))}
        </div>
      </section>

      {persona ? (
        <section aria-live="polite">
          <p className="kicker mb-2">{t(persona.label)}</p>
          <p className="lede mb-5">{t(persona.note)}</p>
          <Route steps={persona.steps} />
          <button type="button" className="btn-link mt-6" onClick={() => setWho(null)}>{t('Show the plan for everyone')}</button>
        </section>
      ) : (
        <section>
          <p className="kicker mb-4">{t('The plan for everyone')}</p>
          <Route steps={START_DEFAULT} />
        </section>
      )}

      <p className="note mt-10">
        {t('Tip: turn on "Simple words" at the top for the easiest explanations, and pick your language with 🌐.')}
      </p>
    </div>
  );
}
