import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { OC_CITIES as CITIES } from '../data/ocCities';
import { useT } from '../i18n';

export default function CitySelector() {
  const t = useT();
  const { selectedCityId, setSelectedCity } = useStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedCity = CITIES.find((c) => c.id === selectedCityId);

  const filtered = useMemo(() => {
    if (!search) return CITIES;
    const q = search.toLowerCase();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="field-label">{t('Orange County city')}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="field text-left !font-sans flex justify-between items-center cursor-pointer"
      >
        <span>{selectedCity ? t(selectedCity.name) : t('Select a city...')}</span>
        <span className="text-muted text-xs">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-line rounded-2xl shadow-soft">
          <div className="p-2 border-b border-rule">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search cities...')}
              aria-label="Search cities"
              className="field !font-sans !py-2 text-sm"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto schedule-scroll">
            {filtered.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full px-3 py-2 text-left text-sm flex justify-between gap-3 hover:bg-paper cursor-pointer ${
                  city.id === selectedCityId ? 'bg-[var(--accent-soft)] font-semibold' : ''
                }`}
              >
                <span>{t(city.name)}</span>
                <span className="text-muted text-xs self-center">{city.programIds.length ? t('City help') : city.mapEligible ? t('County loan') : ''}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-muted text-sm">{t('No cities found')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
