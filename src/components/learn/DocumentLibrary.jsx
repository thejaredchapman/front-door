import { useEffect, useState } from 'react';
import { useT } from '../../i18n';
import DocSources from '../DocSources';
import { loadLibrary } from '../../utils/ragSearch';

const EXAMPLES = ['Does Habitat OC require citizenship?', 'What is the CalHFA income limit in Orange County?', 'When can I remove PMI?', 'How much is the VA funding fee?', 'What documents does Garden Grove need?', 'What is a homeowners\' exemption?'];

export default function DocumentLibrary() {
  const t = useT();
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [lib, setLib] = useState(null);
  useEffect(() => { loadLibrary().then((ix) => setLib(ix.lib)).catch(() => setLib(false)); }, []);
  const ask = (q) => { setInput(q); setQuestion(q.trim()); };
  const byCategory = lib ? lib.docs.reduce((m, d) => ({ ...m, [d.category]: [...(m[d.category] || []), d] }), {}) : {};

  return (
    <div>
      <form className="card flex flex-wrap gap-3 items-end" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <div className="flex-1 min-w-[16rem]">
          <label htmlFor="doc-q" className="field-label">{t('Ask a question about buying a home in Orange County')}</label>
          <input id="doc-q" className="field" value={input} onChange={(e) => setInput(e.target.value)} maxLength={300} placeholder={t('e.g. What is the CalHFA income limit in Orange County?')} />
        </div>
        <button type="submit" className="btn-primary" disabled={!input.trim()}>{t('Search')}</button>
      </form>
      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((q) => <button key={q} type="button" className="chip !min-h-0 !py-1.5 text-sm" onClick={() => ask(q)}>{t(q)}</button>)}
      </div>
      {question && <div className="mt-5"><DocSources key={question} question={question} k={5} /></div>}

      <h2 className="display text-2xl font-bold mt-10 mb-1">{t('Every document in the library')}</h2>
      {lib === false && <p className="note">{t('The document library could not load.')}</p>}
      {lib && (
        <>
          <p className="text-sm text-muted mb-4">{t('{docs} official documents, {passages} searchable passages. Retrieved {date}. Programs change; the official source always wins.', { docs: lib.docs.length, passages: lib.chunks.length, date: lib.docs[0]?.retrieved })}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(byCategory).map(([cat, docs]) => (
              <div key={cat} className="card">
                <h3 className="font-bold mb-2">{t(cat)}</h3>
                <ul className="text-sm space-y-1">
                  {docs.map((d) => (
                    <li key={d.id}>{d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{d.title}</a> : d.title} <span className="text-xs text-muted">· {d.pages} {t(d.pages === 1 ? 'page' : 'pages')}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
