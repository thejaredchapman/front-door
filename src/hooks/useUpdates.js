import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * News and program-status files written by the daily check (scripts/daily-check.mjs)
 * and served as static files from /updates/. One fetch per visit; no backend needed.
 */
const useUpdatesStore = create(() => ({ news: null, status: null, error: false }));
let started = false;

function load() {
  if (started) return;
  started = true;
  const base = import.meta.env.BASE_URL || '/';
  Promise.all([
    fetch(`${base}updates/news.json`, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)),
    fetch(`${base}updates/status.json`, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)),
  ])
    .then(([news, status]) => useUpdatesStore.setState({ news, status }))
    .catch(() => useUpdatesStore.setState({ error: true }));
}

export function useUpdates() {
  useEffect(load, []);
  return useUpdatesStore();
}
