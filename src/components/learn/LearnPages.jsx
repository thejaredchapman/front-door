import { useT } from '../../i18n';
import PageHeader from '../shell/PageHeader';
import { TOPICS, TOPIC_GROUPS } from './topics';

export function LearnIndex() {
  const t = useT();
  return (
    <div className="page">
      <PageHeader
        kicker="Learn"
        title="Short pages, plain words"
        plain="Pick a topic. Each page covers one idea, and every passage has an 'Explain it to me' button."
        eli5="Pick something you want to learn about. Each page is short."
      />
      <div className="grid lg:grid-cols-3 gap-10">
        {TOPIC_GROUPS.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="kicker mb-3">{t(g)}</h2>
            <ol className="topic-list">
              {TOPICS.filter((x) => x.group === g).map((x) => (
                <li key={x.id}>
                  <a href={`#/learn/${x.id}`}>
                    <span className="num topic-n">{String(TOPICS.indexOf(x) + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="topic-title">{t(x.title)}</span>
                      <span className="topic-sum">{t(x.summary)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

export function LearnTopic({ id }) {
  const t = useT();
  const i = TOPICS.findIndex((x) => x.id === id);
  if (i < 0) return <LearnIndex />;
  const topic = TOPICS[i];
  const prev = TOPICS[i - 1];
  const next = TOPICS[i + 1];
  const { Component } = topic;

  return (
    <div className="page topic-page">
      {topic.ownHeader === false && <PageHeader kicker={topic.group} title={topic.title} plain={topic.plain} eli5={topic.eli5} />}
      <div className="rise"><Component /></div>

      <nav className="topic-pager" aria-label={t('More topics')}>
        {prev ? (
          <a href={`#/learn/${prev.id}`} className="pager-link">
            <span className="field-label"><span className="flip-rtl" aria-hidden="true">←</span> {t('Previous')}</span>
            <span className="display text-xl font-semibold">{t(prev.title)}</span>
          </a>
        ) : <span />}
        {next ? (
          <a href={`#/learn/${next.id}`} className="pager-link text-end">
            <span className="field-label">{t('Next')} <span className="flip-rtl" aria-hidden="true">→</span></span>
            <span className="display text-xl font-semibold">{t(next.title)}</span>
          </a>
        ) : <span />}
      </nav>

      <a href="#/plan" className="cta-band">
        <span className="display text-2xl font-bold">{t('Ready to see what fits you?')}</span>
        <span>{t('Take the check-in: see where you are')} <span className="flip-rtl" aria-hidden="true">→</span></span>
      </a>
    </div>
  );
}
