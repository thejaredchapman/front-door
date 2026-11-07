import { useMemo, useState } from 'react';
import Explain from '../funding/Explain';
import { buildSteps, schedule, addWeeks, buildIcs, buildEmails } from '../../data/timeline';

const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const todayIso = () => new Date().toISOString().slice(0, 10);

function months(weeks) {
  const m = weeks / 4.345;
  return m < 1.5 ? `${weeks} weeks` : `about ${Math.round(m)} months`;
}

function EmailCard({ e }) {
  const [copied, setCopied] = useState(false);
  const mailto = `mailto:${encodeURIComponent(e.to)}?subject=${encodeURIComponent(e.subject)}&body=${encodeURIComponent(e.body)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${e.subject}\n\n${e.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <details className="bg-card border border-line rounded-2xl">
      <summary className="p-3 cursor-pointer flex flex-wrap justify-between gap-2">
        <span className="font-semibold">{e.org}</span>
        <span className="text-xs text-muted">{e.subject}</span>
      </summary>
      <div className="px-3 pb-3 text-sm">
        <p className="text-xs text-muted mb-2">
          To: {e.to || 'find the email on their website'}
          {e.link && <> · <a href={e.link} target="_blank" rel="noreferrer" className="underline">website</a></>}
          {e.phone && <> · or call {e.phone}</>}
        </p>
        <pre className="whitespace-pre-wrap font-sans bg-paper p-3 border border-rule text-sm">{e.body}</pre>
        <div className="flex flex-wrap gap-4 mt-2">
          <a href={mailto} className="btn-link">Open in my email app</a>
          <button type="button" onClick={copy} className="btn-link">{copied ? 'Copied ✓' : 'Copy text'}</button>
        </div>
      </div>
    </details>
  );
}

export default function TimelinePlanner({ answers, results, categoryLabel }) {
  const [mode, setMode] = useState('fast');
  const [startIso, setStartIso] = useState(todayIso);
  const start = new Date(`${startIso}T12:00:00`);

  const steps = useMemo(() => buildSteps(answers, results), [answers, results]);
  const std = useMemo(() => schedule(steps, 'standard'), [steps]);
  const fast = useMemo(() => schedule(steps, 'fast'), [steps]);
  const active = mode === 'fast' ? fast : std;
  const saved = std.totalWeeks - fast.totalWeeks;
  const emails = useMemo(() => buildEmails(answers, results, categoryLabel), [answers, results, categoryLabel]);

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(active.list, start, mode)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-home-plan-${mode}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mt-10" aria-labelledby="timeline-title">
      <p className="kicker mb-2">Your calendar</p>
      <h3 id="timeline-title" className="display text-3xl font-extrabold mb-2">My timeline</h3>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="This is a planning calendar built from your answers. The standard path does one step at a time. The fast track does several at once. The times are typical estimates, not promises."
        eli5="This is your house-buying calendar. Doing some steps at the same time gets you there sooner."
      />

      <div className="flex flex-wrap items-end gap-4 mb-5 print:hidden">
        <div className="flex border border-line rounded-2xl" role="group" aria-label="Timeline speed">
          {[['standard', 'Standard'], ['fast', '⚡ Fast track']].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)} className={`px-4 py-2 text-sm font-semibold cursor-pointer ${mode === id ? 'bg-ink text-paper' : 'bg-card'}`}>{label}</button>
          ))}
        </div>
        <div>
          <label htmlFor="t-start" className="field-label">Start date</label>
          <input id="t-start" type="date" value={startIso} onChange={(e) => setStartIso(e.target.value || todayIso())} className="field !py-1.5" />
        </div>
        <button type="button" onClick={downloadIcs} className="px-4 py-2 bg-ink text-paper font-semibold hover:bg-[var(--accent)] cursor-pointer">
          📅 Add to my calendar (.ics)
        </button>
      </div>

      <div className="grid sm:grid-cols-3 border border-line rounded-2xl bg-card mb-5">
        <div className="p-4"><p className="field-label">Standard path</p><p className="display text-2xl font-bold">{months(std.totalWeeks)}</p></div>
        <div className="p-4 sm:border-l-[1.5px] border-t-[1.5px] sm:border-t-0 border-ink"><p className="field-label">Fast track</p><p className="display text-2xl font-bold text-[var(--accent)]">{months(fast.totalWeeks)}</p></div>
        <div className="p-4 sm:border-l-[1.5px] border-t-[1.5px] sm:border-t-0 border-ink"><p className="field-label">You could save</p><p className="display text-2xl font-bold">{saved} weeks</p></div>
      </div>

      <ol className="border-t-2 border-ink">
        {active.list.map((s) => {
          const left = (s.start / active.totalWeeks) * 100;
          const width = Math.max(1.5, (s.dur / active.totalWeeks) * 100);
          return (
            <li key={s.id} className="py-3 border-b border-rule grid md:grid-cols-[1fr_2fr] gap-3 break-inside-avoid">
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="num text-xs text-muted">{fmt(addWeeks(start, s.start))} → {fmt(addWeeks(start, s.end))} · {s.dur} wk</p>
              </div>
              <div>
                <div className="h-3 bg-paper border border-rule relative mb-2" aria-hidden="true">
                  <span className="absolute inset-y-0 bg-[var(--accent)]" style={{ left: `${left}%`, width: `${width}%` }} />
                </div>
                <Explain plain={s.plain} eli5={s.eli5} className="text-sm" />
                {mode === 'fast' && <p className="text-xs mt-1"><strong>⚡ How to go faster:</strong> {s.fastTip}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 panel !mb-0">
        <h4 className="kicker mb-3">Can the timeline be shorter?</h4>
        <Explain
          className="text-sm leading-relaxed"
          plain="Yes, mostly by doing things at the same time instead of one after another: take the class online in week one, gather papers that same week, join every list immediately, and use one lender who handles all your programs. Credit fixes like paying down cards before the statement date or a lender's 'rapid rescore' can take weeks instead of months. Two things you can't rush: the legal waiting period after a bankruptcy or foreclosure (though FHA can shorten it for documented hardship), and lottery or waitlist timing for Habitat and below-market homes. That's why it's smart to get on those lists on day one."
          eli5="You can finish sooner if you do several steps at once, like brushing your teeth while the bath fills up. Some things just take time, like waiting your turn in a line, so get in line first."
        />
      </div>

      <div className="mt-8">
        <h4 className="display text-2xl font-semibold mb-1">Emails to send</h4>
        <p className="text-sm text-muted mb-3">
          Ready-to-send drafts for the providers that match your plan. They open in <em>your</em> email app, and nothing is
          sent for you. Fill in your name and phone, and only share details you&rsquo;re comfortable with.
        </p>
        <div className="space-y-2">
          {emails.map((e) => <EmailCard key={e.id} e={e} />)}
        </div>
      </div>
    </section>
  );
}
