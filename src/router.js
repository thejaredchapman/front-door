import { useEffect, useState } from 'react';

/**
 * Tiny hash router. URLs look like "#/learn/rates". No dependency needed.
 * Old links ("#/funding", "#/fund", "#/report", "#rates") are redirected to the new pages.
 */
const LEGACY = {
  '/funding': '/learn',
  '/fund': '/give',
  '/report': '/results/report',
  '/results': '/results/plans',
};

// Old in-page anchors from the single-page guide → new topic pages
const ANCHORS = {
  fit: '/learn/fit', rates: '/learn/rates', story: '/learn/story', jobs: '/learn/jobs', steps: '/learn/steps',
  habitat: '/learn/habitat', 'all-programs': '/learn/programs', private: '/learn/private', gap: '/learn/gap',
  changing: '/learn/new', glossary: '/learn/words', sources: '/learn/sources', built: '/learn/about', reality: '/learn/why',
  matrix: '/results/compare',
};

export function normalize(hash) {
  let path = hash.replace(/^#/, '');
  if (!path || path === '/') return '/';
  if (!path.startsWith('/')) return ANCHORS[path] || '/';
  path = path.replace(/\/+$/, '');
  return LEGACY[path] || path;
}

export function useRoute() {
  const [path, setPath] = useState(() => normalize(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      const next = normalize(window.location.hash);
      const raw = window.location.hash.replace(/^#/, '');
      if (raw !== next && raw !== '' && next !== '/') window.history.replaceState(null, '', `#${next}`);
      setPath(next);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return { path, segments: path.split('/').filter(Boolean) };
}

export function navigate(to) {
  window.location.hash = to;
}

/** Back: previous page in this tab if there is one, otherwise Home. */
export function goBack() {
  if (window.history.length > 1) window.history.back();
  else navigate('/');
}
