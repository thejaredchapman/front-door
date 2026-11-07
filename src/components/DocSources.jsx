import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { loadLibrary, searchLibrary, excerpt } from '../utils/ragSearch';

/** Render "[2]" citations in an AI answer as small links to the matching passage. */
function withCitations(text, ids, results, t) {
  return text.split(/(\[\d\])/g).map((part, i) => {
    const m = /^\[(\d)\]$/.exec(part);
    if (!m) return part;
    const r = results.find((x) => x.id === ids[Number(m[1]) - 1]);
    return r ? <a key={i} href={`#src-${r.id}`} className="cite" title={`${r.doc.title}, ${t('page {n}', { n: r.page })}`}>[{m[1]}]</a> : part;
  });
}

/**
 * Passages from Front Door's library of official documents that match a question, searched in the browser.
 * "Summarize with AI" is opt-in: only then are the question and these passages' numbers sent to /api/ask.
 */
export default function DocSources({ question, k = 3, compact = false }) {
  const t = useT();
  const [state, setState] = useState({ status: 'loading', results: [] });
  const [ai, setAi] = useState({ status: 'idle' });

  useEffect(() => {
    let alive = true;
    loadLibrary()
      .then((ix) => { if (alive) setState({ status: 'ready', results: searchLibrary(ix, question, k) }); })
      .catch(() => { if (alive) setState({ status: 'error', results: [] }); });
    return () => { alive = false; };
  }, [question, k]);

  const summarize = async () => {
    setAi({ status: 'loading' });
    const ids = state.results.map((r) => r.id);
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question, ids }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setAi({ status: 'done', ...data });
    } catch (e) {
      setAi({ status: 'error', error: e.message });
    }
  };

  if (state.status === 'loading') return <p className="text-xs text-muted mt-2">{t('Checking the official documents…')}</p>;
  if (state.status === 'error' || !state.results.length) return null;
  const { results } = state;

  return (
    <div className={`doc-sources ${compact ? 'is-compact' : ''}`}>
      <p className="doc-sources-head">📄 {t('From the official documents')}</p>
      <ol className="space-y-2">
        {results.map((r, i) => (
          <li key={r.id} id={`src-${r.id}`} className="doc-passage">
            <p className="text-xs font-bold">
              <span className="num">[{i + 1}]</span> {r.doc.title} · {t('page {n}', { n: r.page })}
            </p>
            <p className="text-sm mt-0.5">{excerpt(r.text, question, compact ? 220 : 360)}</p>
            <p className="text-xs text-muted mt-0.5">
              {t(r.doc.category)} · {t('retrieved {date}', { date: r.doc.retrieved })}
              {r.link && <> · <a href={r.link} target="_blank" rel="noreferrer" className="btn-link">{t('Official source')} ↗</a></>}
            </p>
          </li>
        ))}
      </ol>

      {ai.status === 'idle' && (
        <div className="mt-2">
          <button type="button" className="chip !min-h-0 !py-1.5 text-sm" onClick={summarize}>✨ {t('Summarize with AI')}</button>
          <p className="text-[11px] text-muted mt-1">{t('Optional. Sends only your question and these passages to Claude (Anthropic) to write a short answer. Less than a tenth of a cent per answer, paid by Front Door.')}</p>
        </div>
      )}
      {ai.status === 'loading' && <p className="text-sm mt-2">✨ {t('Writing a short answer from these documents…')}</p>}
      {ai.status === 'error' && <p className="text-sm mt-2 text-muted">{t('AI summary is not available right now. The passages above have the details.')} <span className="text-xs">({ai.error})</span></p>}
      {ai.status === 'done' && (ai.offtopic ? (
        <p className="text-sm mt-2">{t('That isn\'t something these home-buying documents cover. For anything else, please try Google.')}</p>
      ) : (
        <div className="ai-answer mt-2">
          <p className="text-xs font-bold mb-1">✨ {t('AI summary of the passages above')}</p>
          <p className="text-sm whitespace-pre-line">{withCitations(ai.answer, ai.ids, results, t)}</p>
          <p className="text-[11px] text-muted mt-1">{t('Written by Claude Haiku from the cited passages. It can make mistakes, so check the official source before you rely on it.')}{ai.cached ? '' : ` · ${ai.usage.input_tokens + ai.usage.output_tokens} ${t('tokens')} · $${ai.costUsd.toFixed(4)}`}</p>
        </div>
      ))}
    </div>
  );
}
