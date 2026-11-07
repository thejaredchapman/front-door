import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';
import { useStore } from '../store/useStore';
import { askDoorie, SUGGESTIONS } from '../data/doorie';
import { servicesMentioned } from '../data/externalServices';
import Mascot from './Mascot';

/**
 * Doorie chat: tap the floating Doorie to ask about home loans in Orange County.
 * Answers come only from Front Door's own content (no AI, nothing sent anywhere).
 * Anything off-topic gets a friendly "try Google".
 */
export default function DoorieChat() {
  const t = useT();
  const simple = useStore((s) => s.eli5);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const opener = buttonRef.current;
    return () => { document.removeEventListener('keydown', onKey); opener?.focus(); };
  }, [open]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const ask = (q) => {
    const question = q.trim();
    if (!question) return;
    setMessages((m) => [...m, { from: 'you', text: question }, { from: 'doorie', ...askDoorie(question) }]);
    setInput('');
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`doorie-fab print:hidden ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="doorie-chat"
        aria-label={open ? t('Close Doorie chat') : t('Ask Doorie a question about home loans')}
      >
        <Mascot mood={open ? 'cheer' : 'wave'} size={58} />
        {!open && <span className="doorie-fab-label">{t('Ask Doorie')}</span>}
      </button>

      {open && (
        <section id="doorie-chat" className="doorie-panel print:hidden" role="dialog" aria-modal="false" aria-labelledby="doorie-title">
          <header className="doorie-head">
            <Mascot mood="wave" size={44} />
            <div className="min-w-0">
              <h2 id="doorie-title" className="display text-xl font-bold leading-none">{t('Ask Doorie')}</h2>
              <p className="text-xs text-muted">{t('Home loans in Orange County only')}</p>
            </div>
            <button type="button" className="drawer-close ms-auto" onClick={() => setOpen(false)} aria-label={t('Close Doorie chat')}>✕</button>
          </header>

          <div ref={listRef} className="doorie-list" aria-live="polite">
            <div className="doorie-msg is-doorie">
              <p>{t('Hi! I\'m Doorie. Ask me anything about buying a home or getting a home loan in Orange County.')}</p>
              <p className="text-xs text-muted mt-1">{t('I share general information from Front Door\'s sources, not financial advice. Your questions stay on this device.')}</p>
            </div>
            {messages.map((m, i) => (
              m.from === 'you'
                ? <div key={i} className="doorie-msg is-you">{m.text}</div>
                : <DoorieAnswer key={i} a={m} simple={simple} t={t} onAsk={ask} />
            ))}
          </div>

          {messages.length === 0 && (
            <div className="doorie-suggest" role="group" aria-label={t('Suggested questions')}>
              {SUGGESTIONS.map((s) => <button key={s} type="button" className="chip !min-h-0 !py-1.5 text-sm" onClick={() => ask(s)}>{t(s)}</button>)}
            </div>
          )}

          <form className="doorie-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
            <label htmlFor="doorie-input" className="sr-only">{t('Your question')}</label>
            <input id="doorie-input" ref={inputRef} className="field !py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('Ask about home loans in OC…')} maxLength={300} autoComplete="off" />
            <button type="submit" className="btn-primary !min-h-0 !py-2 !px-4" disabled={!input.trim()}>{t('Ask')}</button>
          </form>
        </section>
      )}
    </>
  );
}

function DoorieAnswer({ a, simple, t, onAsk }) {
  if (a.kind === 'offtopic' || a.kind === 'outofarea') {
    return (
      <div className="doorie-msg is-doorie">
        <p>
          {a.kind === 'offtopic'
            ? t('I only answer questions about home loans and buying a home in Orange County. For anything else, please try Google.')
            : t('I only cover Orange County. For other places, please try Google, or ask a HUD-approved housing counselor near you.')}
        </p>
        <a href="https://www.google.com" target="_blank" rel="noreferrer" className="btn-link inline-block mt-1">{t('Go to Google')} →</a>
      </div>
    );
  }
  const text = simple && a.eli5 ? a.eli5 : a.plain;
  const external = a.link && /^https?:/.test(a.link);
  const services = servicesMentioned(`${a.title} ${a.plain}`).filter((s) => s.url !== a.link);
  return (
    <div className="doorie-msg is-doorie">
      <p className="font-bold">{t(a.title)}</p>
      <p className="mt-1">{t(text)}</p>
      {a.status && a.status !== 'verified' && <p className="text-xs text-muted mt-1">{t('Status not fully confirmed; call before you count on it.')}</p>}
      {services.length > 0 && (
        <p className="text-sm mt-1">
          {services.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-link me-3 inline-block">{t(l.aliases?.[0] || l.name)} ↗</a>)}
        </p>
      )}
      {a.link && (
        <a href={a.link} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="btn-link inline-block mt-1">
          {t(a.linkLabel || 'Learn more')} {external ? '↗' : '→'}
        </a>
      )}
      {a.related?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {a.related.map((r) => <button key={r} type="button" className="chip !min-h-0 !py-1 text-xs" onClick={() => onAsk(r)}>{t(r)}</button>)}
        </div>
      )}
    </div>
  );
}
