import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import LAWS from '../../data/caLaws.json';

const IMPACT = {
  helps: { label: 'Helps buyers', badge: 'badge-good', icon: '👍' },
  mixed: { label: 'Mixed', badge: 'badge-maybe', icon: '⚖️' },
  restricts: { label: 'Restricts or adds cost', badge: 'badge-no', icon: '⚠️' },
};

const CATEGORIES = {
  supply: 'More homes', insurance: 'Home insurance', programs: 'Programs & ballot', costs: 'Costs & fees',
  'buyer-protection': 'Buyer protections', hoa: 'HOAs', disclosure: 'Disclosures', 'keep-home': 'Keeping your home',
  'property-tax': 'Property tax', ownership: 'Ownership', local: 'Local (Orange County)',
};

const SOON = '2027-01-01';

function fmtEffective(e) {
  if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return e || '';
  return new Date(`${e}T12:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function LawCard({ law }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const imp = IMPACT[law.impact] || IMPACT.mixed;
  return (
    <article className="plan-card">
      <div className="flex flex-wrap gap-2 mb-2">
        <span className={`badge ${imp.badge}`}>{imp.icon} {t(imp.label)}</span>
        <span className="badge badge-outline">{t(CATEGORIES[law.category] || law.category)}</span>
        {law.effective === SOON && <span className="badge badge-maybe">{t('Starts Jan 1, 2027')}</span>}
        {!law.verified && <span className="badge badge-no">{t('Not fully confirmed')}</span>}
      </div>
      <p className="num text-xs text-muted">{law.bill}</p>
      <h3 className="display text-xl font-semibold leading-tight">{t(law.title)}</h3>
      <Explain plain={law.plain} eli5={law.eli5} className="mt-2" />
      <p className="note text-sm mt-3"><strong>{t('What it means for buyers')}:</strong> {t(law.impactWhy)}</p>
      <button type="button" className="btn-link mt-3" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t('Show less') : t('Status, who it affects & source')}</button>
      {open && (
        <dl className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-line text-sm">
          <div><dt className="field-label">{t('Status')}</dt><dd>{law.status}</dd></div>
          <div><dt className="field-label">{t('In effect')}</dt><dd>{fmtEffective(law.effective)}</dd></div>
          <div className="sm:col-span-2"><dt className="field-label">{t('Who it affects')}</dt><dd>{t(law.who)}</dd></div>
          {law.notes && <div className="sm:col-span-2"><dt className="field-label">{t('Research notes')}</dt><dd className="text-muted">{law.notes}</dd></div>}
          <div className="sm:col-span-2"><a href={law.url} target="_blank" rel="noreferrer" className="btn-link">{t('Official source')} →</a> <span className="text-xs text-muted">· {t('checked')} {law.checked}</span></div>
        </dl>
      )}
    </article>
  );
}

export default function LawsPage() {
  const t = useT();
  const [impact, setImpact] = useState('all');
  const [cat, setCat] = useState('all');
  const [soon, setSoon] = useState(false);

  const counts = useMemo(() => Object.fromEntries(Object.keys(IMPACT).map((k) => [k, LAWS.filter((l) => l.impact === k).length])), []);
  const cats = useMemo(() => [...new Set(LAWS.map((l) => l.category))], []);
  const list = LAWS
    .filter((l) => impact === 'all' || l.impact === impact)
    .filter((l) => cat === 'all' || l.category === cat)
    .filter((l) => !soon || l.effective === SOON)
    .sort((a, b) => (b.effective || '').localeCompare(a.effective || ''));

  return (
    <div>
      <div className="stat-row mb-6">
        {Object.entries(IMPACT).map(([k, v]) => (
          <div key={k}><p className="field-label">{v.icon} {t(v.label)}</p><p className="display stat-v">{counts[k]}</p></div>
        ))}
      </div>
      <p className="note mb-6">
        <strong>{t('Note for Orange County')}:</strong>{' '}
        {t('SB 79 (taller housing near transit) only applies in "urban transit counties", and Orange County is not on the state\'s list, despite some news reports.')}
      </p>

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label={t('Filter by impact')}>
        <button type="button" className={`chip ${impact === 'all' ? 'chip-on' : ''}`} aria-pressed={impact === 'all'} onClick={() => setImpact('all')}>{t('All laws')} <span className="num text-xs opacity-70">{LAWS.length}</span></button>
        {Object.entries(IMPACT).map(([k, v]) => (
          <button key={k} type="button" className={`chip ${impact === k ? 'chip-on' : ''}`} aria-pressed={impact === k} onClick={() => setImpact(k)}>{v.icon} {t(v.label)}</button>
        ))}
        <button type="button" className={`chip ${soon ? 'chip-on' : ''}`} aria-pressed={soon} onClick={() => setSoon(!soon)}>📅 {t('Starts Jan 1, 2027')}</button>
      </div>
      <div className="mb-6">
        <label htmlFor="law-cat" className="field-label">{t('Topic')}</label>
        <select id="law-cat" className="field max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">{t('All topics')}</option>
          {cats.map((c) => <option key={c} value={c}>{t(CATEGORIES[c] || c)}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {list.map((l) => <LawCard key={l.id} law={l} />)}
        {list.length === 0 && <p className="text-muted">{t('No laws match these filters.')}</p>}
      </div>

      <p className="text-xs text-muted mt-8">
        {t('Checked November 7, 2026 using gov.ca.gov, HCD, CalHFA, the Department of Insurance, DRE, BOE, LAO, and the Secretary of State. Some details come from official bill analyses or law-firm summaries; each card\'s notes say which. Not legal advice.')}
      </p>
    </div>
  );
}
