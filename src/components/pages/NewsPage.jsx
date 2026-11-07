import { useState } from 'react';
import { useT } from '../../i18n';
import { useUpdates } from '../../hooks/useUpdates';
import PageHeader from '../shell/PageHeader';
import Explain from '../funding/Explain';
import { NEWS_TYPES } from '../../data/newsTypes';
import Mascot from '../Mascot';


function fmtDate(iso) {
  if (!iso) return '';
  return new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function NewsItem({ item, compact = false }) {
  const t = useT();
  const type = NEWS_TYPES.find((x) => x.id === item.type);
  return (
    <article className={`news-item ${compact ? 'is-compact' : ''}`}>
      <div className="news-meta">
        <time dateTime={item.date} className="num">{fmtDate(item.date)}</time>
        {type && <span className="badge badge-outline">{t(type.label)}</span>}
        {item.verified ? <span className="badge badge-good">{t('Verified')}</span> : <span className="badge badge-maybe">{t(item.note || 'Not yet confirmed')}</span>}
        {item.auto && <span className="badge badge-maybe">{t('Found by daily check')}</span>}
      </div>
      <h3 className="display news-title">{t(item.headline)}</h3>
      {!compact && <Explain plain={item.plain} eli5={item.eli5} className="mt-2" />}
      {!compact && item.url && (
        <a href={item.url} target="_blank" rel="noreferrer" className="btn-link inline-block mt-2">{t('Source')}: {item.source} →</a>
      )}
    </article>
  );
}

export default function NewsPage() {
  const t = useT();
  const { news, status, error } = useUpdates();
  const [type, setType] = useState('all');
  const items = (news?.items || []).filter((n) => type === 'all' || n.type === type).sort((a, b) => b.date.localeCompare(a.date));
  const changes = Object.entries(status?.items || {}).filter(([, s]) => s.result === 'changed');

  return (
    <div className="page-narrow">
      <PageHeader
        kicker="News"
        title="What's changing for homebuyers"
        plain="Rates, programs, laws, and income limits that affect you. A daily check looks at official pages and flags changes for review."
        eli5="News about home loans and helpers, so you know what's new."
      >
        <p className="text-sm text-muted mt-3">
          {status?.checkedAt
            ? t('Official pages last checked: {date}', { date: fmtDate(status.checkedAt) })
            : t('News reviewed {date}. Automatic daily checks start once they are switched on.', { date: fmtDate(news?.updatedAt) })}
        </p>
      </PageHeader>

      {changes.length > 0 && (
        <section className="card mb-8" aria-labelledby="changes-title">
          <h2 id="changes-title" className="kicker mb-3">{t('Recently changed pages')}</h2>
          <ul className="space-y-3">
            {changes.map(([id, s]) => (
              <li key={id}>
                <a href={s.url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{t(s.name || id)}</a>
                <p className="text-sm">{t(s.summary)}</p>
                <p className="text-xs text-muted">{t('Changed')} {fmtDate(s.lastChanged)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <a href="#/learn/laws" className="card hover-lift mb-6 flex items-center justify-between gap-3">
        <span><span className="font-bold">⚖️ {t('New California laws')}</span><span className="block text-sm text-muted">{t('49 laws that help or restrict homebuyers, 2024–2027')}</span></span>
        <span className="btn-link flip-rtl" aria-hidden="true">→</span>
      </a>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label={t('Filter news')}>
        {NEWS_TYPES.map((x) => (
          <button key={x.id} type="button" aria-pressed={type === x.id} onClick={() => setType(x.id)} className={`chip ${type === x.id ? 'chip-on' : ''}`}>{t(x.label)}</button>
        ))}
      </div>

      {error && <p className="note">{t('News could not be loaded. Please try again later.')}</p>}
      {!news && !error && <p className="text-muted">{t('Loading…')}</p>}
      <div className="news-list">
        {items.map((n) => <NewsItem key={n.id} item={n} />)}
        {news && items.length === 0 && <div className="flex items-center gap-3 py-6"><Mascot mood="think" size={80} /><p className="text-muted">{t('No news in this category yet.')}</p></div>}
      </div>
    </div>
  );
}
