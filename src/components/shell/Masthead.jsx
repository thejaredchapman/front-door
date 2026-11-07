import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store/useStore';
import { useT, LANGS } from '../../i18n';
import { NAV } from './nav';


function Logo() {
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <rect width="40" height="40" rx="13" fill="#0099cc" />
      <path d="M8 19 20 9l12 10" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 31V20.5a6 6 0 0 1 12 0V31Z" fill="#c4d600" stroke="#002f6c" strokeWidth="1.6" />
      <circle cx="22.4" cy="25.5" r="1.7" fill="#e55d25" />
    </svg>
  );
}

export function LanguageSelect({ id = 'lang' }) {
  const t = useT();
  const { lang, setLang } = useStore();
  return (
    <label className="lang-select" htmlFor={id}>
      <span className="sr-only">{t('Language')}</span>
      <span aria-hidden="true">🌐</span>
      <select id={id} value={lang || 'en'} onChange={(e) => setLang(e.target.value)}>
        {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
    </label>
  );
}

export function SimpleSwitch({ id = 'simple', compact = false }) {
  const t = useT();
  const { eli5, setEli5 } = useStore();
  return (
    <button type="button" id={id} role="switch" aria-checked={eli5} aria-label={t('Simple words')} title={t('Simple words')} onClick={() => setEli5(!eli5)} className={`simple-switch ${eli5 ? 'is-on' : ''}`}>
      <span className="simple-knob" aria-hidden="true" />
      <span className={compact ? 'hidden xl:inline' : ''}>{t('Simple words')}</span>
      {compact && <span className="xl:hidden font-bold" aria-hidden="true">Aa</span>}
    </button>
  );
}

export default function Masthead({ path }) {
  const t = useT();
  // The drawer remembers which page it was opened on, so navigating closes it automatically.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === path;
  const setOpen = (v) => setOpenAt(v ? path : null);
  const closeRef = useRef(null);
  const openRef = useRef(null);

  // Focus, Escape to close, and lock page scroll while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const opener = openRef.current;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpenAt(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus();
    };
  }, [open]);

  // The drawer is rendered into <body> (portal). The sticky header uses backdrop-filter,
  // which would otherwise trap position:fixed children inside the header's box.
  const drawer = typeof document === 'undefined' ? null : createPortal(
    <>
      {open && <div className="drawer-scrim lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div id="mobile-menu" className={`drawer lg:hidden ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label={t('Menu')} inert={!open} aria-hidden={!open}>
        <div className="flex items-center justify-between mb-6">
          <span className="kicker">{t('Menu')}</span>
          <button ref={closeRef} type="button" className="drawer-close" aria-label={t('Close menu')} onClick={() => setOpen(false)}>✕</button>
        </div>
        <nav aria-label={t('Main')}>
          <ul className="drawer-nav">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpenAt(null)} aria-current={n.match(path) ? 'page' : undefined} className={n.match(path) ? 'is-active' : ''}>
                  <span className="num text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {t(n.label)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col items-start gap-4">
          <SimpleSwitch id="simple-mobile" />
          <LanguageSelect id="lang-mobile" />
        </div>
      </div>
    </>,
    document.body,
  );

  return (
    <>
    <header className="masthead print:hidden">
      <a href="#main" className="skip-link">{t('Skip to content')}</a>
      <div className="masthead-inner">
        <a href="#/" className="flex items-center gap-3 min-w-0" aria-label={t('Front Door home')}>
          <Logo />
          <span className="min-w-0">
            <span className="display block text-2xl font-bold leading-none">Front Door</span>
            <span className="hidden sm:block text-xs text-muted mt-0.5">{t('Your path to an affordable home')}</span>
          </span>
        </a>

        <nav aria-label={t('Main')} className="hidden lg:flex items-center">
          {NAV.filter((n) => !n.mobileOnly).map((n) => (
            <a key={n.href} href={n.href} aria-current={n.match(path) ? 'page' : undefined} className={`nav-link ${n.match(path) ? 'is-active' : ''}`}>{t(n.label)}</a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <SimpleSwitch id="simple-desktop" compact />
          <LanguageSelect id="lang-desktop" />
        </div>

        <button
          ref={openRef}
          type="button"
          className="hamburger lg:hidden"
          aria-label={t('Open menu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span /><span /><span />
        </button>
      </div>

    </header>
    {drawer}
    </>
  );
}
