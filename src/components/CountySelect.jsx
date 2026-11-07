import { CA_REGIONS } from '../data/caIncomeLimits';

/** California county picker grouped by region, with Orange County featured at the top. */
export default function CountySelect({ id, value, onChange, label = 'California county' }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {CA_REGIONS.map((r) => (
          <optgroup key={r.name} label={r.name}>
            {r.counties.map((c) => <option key={c} value={c}>{c} County{c === 'Orange' ? ' ★' : ''}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
