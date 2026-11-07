import { useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { formatCurrency } from '../../utils/formatters';
import { SOURCES, CREDITS, NEEDS, CHECKED_ON } from '../../data/fundingSources';

const AI_PER_ANSWER = 0.0003; // measured: Claude Haiku 5.5 "Summarize with AI", 2026-11-07
const RENTCAST_FREE = 50;
const RENTCAST_EACH = 0.2;

function Num({ id, label, value, onChange, min = 0, max = 1e9, step = 1, prefix, suffix, help }) {
  const t = useT();
  return (
    <div>
      <label htmlFor={id} className="field-label">{t(label)}</label>
      <div className="relative">
        {prefix && <span className="absolute start-3 top-1/2 -translate-y-1/2 text-muted num">{prefix}</span>}
        <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value}
          onChange={(e) => { const v = Number(e.target.value); if (e.target.value !== '' && Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v))); }}
          className={`field ${prefix ? '!ps-7' : ''}`} />
        {suffix && <span className="absolute end-3 top-1/2 -translate-y-1/2 text-muted text-sm">{t(suffix)}</span>}
      </div>
      {help && <p className="text-xs text-muted mt-1">{t(help)}</p>}
    </div>
  );
}

const fmtWindow = (w) => (/^\d{4}-/.test(w) ? new Date(`${w}T12:00:00`) : null);

export default function FundingCalculator() {
  const t = useT();
  // ── What it costs to run (per year) ──
  const [families, setFamilies] = useState(5000);
  const [aiPct, setAiPct] = useState(30);
  const [aiEach, setAiEach] = useState(2);
  const [mapPct, setMapPct] = useState(40);
  const [mapsFree, setMapsFree] = useState(10000);
  const [mapsPer1k, setMapsPer1k] = useState(7);
  const [rentcastCalls, setRentcastCalls] = useState(30);
  const [voicePlan, setVoicePlan] = useState(0);
  const [hosting, setHosting] = useState(20);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(35);
  const [translation, setTranslation] = useState(3000);
  const [outreach, setOutreach] = useState(5000);
  const [coordinator, setCoordinator] = useState(30000);
  const [credits, setCredits] = useState({ 'vercel-oss': true, 'github-np': true });

  // ── Who could pay ──
  const [have, setHave] = useState({ nonprofit: true, hud: true, network: true, bank: false });
  const [plan, setPlan] = useState(() => Object.fromEntries(SOURCES.map((s) => [s.id, { on: Boolean(s.start), amount: s.amount, chance: s.chance }])));
  const setSource = (id, patch) => setPlan((p) => ({ ...p, [id]: { ...p[id], ...patch } }));

  const budget = useMemo(() => {
    const ai = families * (aiPct / 100) * aiEach * AI_PER_ANSWER;
    const mapLoadsMonth = (families * (mapPct / 100) * 2) / 12;
    const maps = Math.max(0, mapLoadsMonth - mapsFree) / 1000 * mapsPer1k * 12;
    const listings = Math.max(0, rentcastCalls - RENTCAST_FREE) * RENTCAST_EACH * 12;
    const hostingYear = hosting * 12;
    const hostingCredit = credits['vercel-oss'] ? Math.min(hostingYear, CREDITS.find((c) => c.id === 'vercel-oss').value) : 0;
    const rows = [
      { label: 'Hosting (Vercel)', value: hostingYear - hostingCredit, note: hostingCredit ? `after ${formatCurrency(hostingCredit)} open-source credits` : '' },
      { label: '"Summarize with AI" answers (Claude Haiku)', value: ai, note: `${Math.round(families * (aiPct / 100) * aiEach).toLocaleString()} answers × $${AI_PER_ANSWER}` },
      { label: 'Map of affordable homes (Google Maps)', value: maps, note: `${Math.round(mapLoadsMonth).toLocaleString()} map loads a month` },
      { label: 'Homes-for-sale data (RentCast)', value: listings, note: `${rentcastCalls} calls a month (first ${RENTCAST_FREE} free)` },
      { label: 'Doorie\'s voice (ElevenLabs plan)', value: voicePlan * 12, note: 'answers are cached, so each is voiced once' },
      { label: 'Keeping programs and rates up to date (staff time)', value: hours * rate * 12, note: `${hours} hours a month × ${formatCurrency(rate)}` },
      { label: 'Part-time program coordinator', value: coordinator, note: 'runs partnerships, workshops, and reporting' },
      { label: 'Native-speaker translation review', value: translation, note: '6 languages' },
      { label: 'Outreach and counselor partnerships', value: outreach, note: 'flyers, workshops, partner time' },
    ];
    return { rows, total: rows.reduce((s, r) => s + r.value, 0) };
  }, [families, aiPct, aiEach, mapPct, mapsFree, mapsPer1k, rentcastCalls, voicePlan, hosting, hours, rate, translation, outreach, coordinator, credits]);

  const sources = SOURCES.map((s) => {
    const missing = s.needs.filter((n) => !have[n]);
    const p = plan[s.id];
    const counted = p.on && missing.length === 0;
    return { ...s, ...p, missing, counted, expected: counted ? p.amount * (p.chance / 100) : 0 };
  });
  const expected = sources.reduce((sum, s) => sum + s.expected, 0);
  const ifAll = sources.filter((s) => s.counted).reduce((sum, s) => sum + s.amount, 0);
  const coverage = budget.total > 0 ? expected / budget.total : 0;
  const gap = Math.max(0, budget.total - expected);
  const perFamily = families > 0 ? budget.total / families : 0;
  const maxRow = Math.max(1, ...budget.rows.map((r) => r.value));
  const upcoming = sources.filter((s) => s.counted).map((s) => ({ ...s, date: fmtWindow(s.window) }))
    .sort((a, b) => (a.date ? a.date.getTime() : 9e15) - (b.date ? b.date.getTime() : 9e15));

  return (
    <div className="space-y-10">
      {/* Headline numbers */}
      <section aria-label={t('Summary')}>
        <div className="stat-row !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4">
          <div><p className="field-label">{t('Yearly budget')}</p><p className="display stat-v">{formatCurrency(budget.total)}</p></div>
          <div><p className="field-label">{t('Expected funding')}</p><p className="display stat-v">{formatCurrency(expected)}</p><p className="text-xs text-muted">{t('{all} if every grant you picked comes through', { all: formatCurrency(ifAll) })}</p></div>
          <div><p className="field-label">{t('Still to raise')}</p><p className="display stat-v">{formatCurrency(gap)}</p></div>
          <div><p className="field-label">{t('Cost per family helped')}</p><p className="display stat-v">{formatCurrency(perFamily)}</p><p className="text-xs text-muted">{t('{n} families a year', { n: families.toLocaleString() })}</p></div>
        </div>
        <div className="card mt-4">
          <div className="flex flex-wrap justify-between gap-2 text-sm mb-2">
            <span className="font-bold">{t('Expected funding covers {pct}% of the budget', { pct: Math.round(coverage * 100) })}</span>
            <span className="text-muted">{formatCurrency(expected)} / {formatCurrency(budget.total)}</span>
          </div>
          <div className="fund-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round(coverage * 100))} aria-label={t('Share of the budget covered by expected funding')}
            title={`${t('Expected funding')}: ${formatCurrency(expected)} · ${t('Yearly budget')}: ${formatCurrency(budget.total)}`}>
            <span style={{ width: `${Math.min(100, coverage * 100)}%` }} />
          </div>
          {coverage >= 1 && <p className="text-sm mt-2">✅ {t('Fully covered, with {extra} to spare for growth or a reserve.', { extra: formatCurrency(expected - budget.total) })}</p>}
        </div>
      </section>

      {/* Step 1: budget */}
      <section aria-labelledby="fund-cost-title">
        <h2 id="fund-cost-title" className="display text-2xl font-bold mb-3"><span className="num tab-n">1</span> {t('What it costs to run for a year')}</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div>
              <label htmlFor="f-families" className="field-label">{t('Families using Front Door each year')}: <span className="num">{families.toLocaleString()}</span></label>
              <input id="f-families" type="range" min={500} max={50000} step={500} value={families} onChange={(e) => setFamilies(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Num id="f-aipct" label="Families who tap “Summarize with AI”" value={aiPct} onChange={setAiPct} max={100} suffix="%" />
              <Num id="f-aieach" label="AI answers per family" value={aiEach} onChange={setAiEach} max={50} />
              <Num id="f-mappct" label="Families who open the homes map" value={mapPct} onChange={setMapPct} max={100} suffix="%" />
              <Num id="f-rentcast" label="Listing updates (RentCast calls) a month" value={rentcastCalls} onChange={setRentcastCalls} max={10000} help="One call a day ≈ 30." />
              <Num id="f-hosting" label="Hosting per month" value={hosting} onChange={setHosting} prefix="$" help="Vercel Pro is about $20 a month." />
              <Num id="f-voice" label="ElevenLabs plan per month" value={voicePlan} onChange={setVoicePlan} prefix="$" help="Enter your plan's price; $0 if not used." />
              <Num id="f-hours" label="Staff hours a month for updates" value={hours} onChange={setHours} max={400} />
              <Num id="f-rate" label="Hourly cost of staff time" value={rate} onChange={setRate} prefix="$" max={500} />
              <Num id="f-trans" label="Translation review per year" value={translation} onChange={setTranslation} prefix="$" step={100} />
              <Num id="f-outreach" label="Outreach per year" value={outreach} onChange={setOutreach} prefix="$" step={100} />
              <Num id="f-coord" label="Program coordinator per year" value={coordinator} onChange={setCoordinator} prefix="$" step={1000} help="Set to $0 if volunteers run it." />
            </div>
            <details>
              <summary className="btn-link cursor-pointer text-sm">{t('Google Maps pricing assumptions')}</summary>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <Num id="f-mfree" label="Free map loads a month" value={mapsFree} onChange={setMapsFree} step={1000} />
                <Num id="f-mper" label="Price per 1,000 loads after that" value={mapsPer1k} onChange={setMapsPer1k} prefix="$" step={0.5} />
              </div>
              <p className="text-xs text-muted mt-2">{t('Check Google Maps Platform pricing for your account; these are editable estimates.')}</p>
            </details>
            <fieldset>
              <legend className="field-label">{t('Free credits to apply')}</legend>
              {CREDITS.map((c) => (
                <label key={c.id} className="flex items-start gap-2 text-sm py-1">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[var(--accent)]" checked={Boolean(credits[c.id])} onChange={(e) => setCredits({ ...credits, [c.id]: e.target.checked })} />
                  <span><a href={c.url} target="_blank" rel="noreferrer" className="underline">{c.name}</a>{c.value ? ` · ${formatCurrency(c.value)}` : ''} · <span className="text-muted">{t(c.windowLabel)}</span></span>
                </label>
              ))}
            </fieldset>
          </div>
          <div className="card">
            <p className="field-label">{t('Where the money goes')}</p>
            <ul className="space-y-2.5">
              {budget.rows.map((r) => (
                <li key={r.label} title={`${t(r.label)}: ${formatCurrency(r.value)}`}>
                  <div className="flex justify-between gap-3 text-sm"><span>{t(r.label)}</span><span className="num font-bold">{formatCurrency(r.value)}</span></div>
                  <div className="cost-bar" aria-hidden="true"><span style={{ width: `${(r.value / maxRow) * 100}%` }} /></div>
                  {r.note && <p className="text-xs text-muted">{t(r.note)}</p>}
                </li>
              ))}
              <li className="flex justify-between gap-3 font-bold border-t border-rule pt-2"><span>{t('Total per year')}</span><span className="num">{formatCurrency(budget.total)}</span></li>
            </ul>
            <p className="text-xs text-muted mt-3">{t('AI cost per answer was measured on this site: about $0.0003. Everything else in the app runs in the visitor\'s browser for $0.')}</p>
          </div>
        </div>
      </section>

      {/* Step 2: funding */}
      <section aria-labelledby="fund-src-title">
        <h2 id="fund-src-title" className="display text-2xl font-bold mb-3"><span className="num tab-n">2</span> {t('Who could pay for it')}</h2>
        <div className="card mb-4">
          <p className="field-label">{t('Who would apply? (most funders require a nonprofit)')}</p>
          <div className="grid md:grid-cols-2 gap-x-6">
            {NEEDS.map((n) => (
              <label key={n.id} className="flex items-start gap-2 py-1.5 text-sm">
                <input type="checkbox" className="w-4 h-4 mt-0.5 accent-[var(--accent)]" checked={have[n.id]} onChange={(e) => setHave({ ...have, [n.id]: e.target.checked })} />
                <span><span className="font-semibold">{t(n.label)}</span><span className="block text-xs text-muted">{t(n.help)}</span></span>
              </label>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-sm">
            <thead>
              <tr><th scope="col">{t('Apply?')}</th><th scope="col">{t('Funding source')}</th><th scope="col">{t('Amount to ask')}</th><th scope="col">{t('Chance of winning')}</th><th scope="col">{t('Expected')}</th><th scope="col">{t('When')}</th></tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className={s.missing.length ? 'opacity-55' : ''}>
                  <td><input type="checkbox" className="w-4 h-4 accent-[var(--accent)]" checked={s.on} disabled={s.missing.length > 0} onChange={(e) => setSource(s.id, { on: e.target.checked })} aria-label={t('Apply to {name}', { name: s.name })} /></td>
                  <th scope="row" className="min-w-[14rem]">
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{s.name}</a>
                    <span className={`badge ms-1 ${s.confirmed ? 'badge-good' : 'badge-outline'}`}>{t(s.confirmed ? 'Checked' : 'Unconfirmed')}</span>
                    <span className="block text-xs text-muted font-normal mt-0.5">{t(s.type)} · {t(s.note)}</span>
                    {s.missing.length > 0 && <span className="block text-xs font-semibold mt-0.5">🔒 {t('Needs: {list}', { list: s.missing.map((m) => t(NEEDS.find((n) => n.id === m).label)).join('; ') })}</span>}
                    {(s.min || s.max) && <span className="block text-xs text-muted font-normal">{t('Typical award')}: {s.min ? formatCurrency(s.min) : '?'}{s.max && s.max !== s.min ? `–${formatCurrency(s.max)}` : ''}</span>}
                  </th>
                  <td><input type="number" min={0} step={1000} className="field !py-1 !w-28 num" value={s.amount} disabled={!s.counted} onChange={(e) => setSource(s.id, { amount: Math.max(0, Number(e.target.value) || 0) })} aria-label={t('Amount to ask from {name}', { name: s.name })} /></td>
                  <td>
                    <input type="range" min={0} max={100} step={5} value={s.chance} disabled={!s.counted} onChange={(e) => setSource(s.id, { chance: Number(e.target.value) })} className="w-24 accent-[var(--accent)] align-middle" aria-label={t('Chance of winning {name}', { name: s.name })} />
                    <span className="num ms-1">{s.chance}%</span>
                  </td>
                  <td className="num font-bold">{formatCurrency(s.expected)}</td>
                  <td className="text-xs">{t(s.windowLabel)}</td>
                </tr>
              ))}
              <tr className="is-best">
                <th scope="row" colSpan={4}>{t('Expected funding (amount × chance, for grants you can apply to)')}</th>
                <td className="num font-bold">{formatCurrency(expected)}</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-2">{t('Researched {date}. "Checked" means confirmed on the funder\'s own page. Deadlines and amounts change; confirm before applying. Chances are your own planning guesses, not funder statistics.', { date: CHECKED_ON })}</p>
      </section>

      {/* Step 3: calendar */}
      <section aria-labelledby="fund-when-title">
        <h2 id="fund-when-title" className="display text-2xl font-bold mb-3"><span className="num tab-n">3</span> {t('Application calendar')}</h2>
        {upcoming.length === 0 ? <p className="note">{t('Pick at least one funding source you can apply to.')}</p> : (
          <ol className="space-y-2">
            {upcoming.map((s) => (
              <li key={s.id} className="task-row">
                <span className="num font-bold w-28 shrink-0">{s.date ? s.date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : t(s.window === 'rolling' ? 'Any time' : 'Ongoing')}</span>
                <span className="flex-1"><a href={s.url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{s.name}</a> <span className="text-sm text-muted">· {t(s.windowLabel)}</span></span>
                <span className="num text-sm">{formatCurrency(s.amount)}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="card mt-4">
          <p className="font-bold mb-1">{t('First steps')}</p>
          <ol className="list-decimal ps-5 text-sm space-y-1">
            <li>{t('Ask NeighborWorks Orange County (HUD-approved) or Habitat OC to host Front Door, and whether it can join the HUD counseling application due about Nov 30, 2026.')}</li>
            <li>{t('Send the Wells Fargo Grant Interest Form and a U.S. Bank letter of inquiry now; both are rolling.')}</li>
            <li>{t('Start counting visitors, languages used, and referrals to counselors. Every funder will ask.')}</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
