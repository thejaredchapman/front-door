import { useMemo } from 'react';
import { generateRealtorLinks } from '../utils/realtorUrl';

export default function RealtorListings({ city, maxAffordablePrice }) {
  const links = useMemo(() => {
    if (!city || !maxAffordablePrice || maxAffordablePrice <= 0) return [];
    return generateRealtorLinks(city, maxAffordablePrice);
  }, [city, maxAffordablePrice]);

  if (!city) return null;

  return (
    <section className="panel">
      <h3 className="kicker mb-1">Real estate listings</h3>
      <p className="text-sm text-muted mb-5">Browse current listings on Realtor.com for {city.name}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 px-4 py-3 border border-line rounded-2xl bg-paper hover:bg-[var(--accent)] hover:text-paper transition-colors"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold truncate">{link.label}</span>
              <span className="block text-xs text-muted group-hover:text-paper/70">realtor.com</span>
            </span>
            <span aria-hidden="true" className="display text-xl transition-transform group-hover:translate-x-1">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
