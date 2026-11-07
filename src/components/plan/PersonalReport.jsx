import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import Explain, { Eli5Toggle } from '../funding/Explain';
import { DEFAULT_ANSWERS, GROUPS } from '../../data/plans';
import { OCCUPATIONS } from '../../data/programs';
import { GLOSSARY } from '../../data/glossary';
import { buildReport } from '../../utils/report';
import { formatCurrency } from '../../utils/formatters';
import RATE_INFO from '../../data/rate.json';

const WORDS = ['AMI (Area Median Income)', 'DTI (Debt-to-Income ratio)', 'Credit score', 'Down payment assistance (DPA)', 'Silent second (deferred loan)', 'Mortgage insurance (PMI / MIP)', 'Pre-approval', 'Closing costs'];

function H({ n, children }) {
  return (
    <h3 className="display text-2xl font-bold mt-10 mb-3 flex items-baseline gap-3 break-after-avoid">
      <span className="num text-sm text-muted">{String(n).padStart(2, '0')}</span>{children}
    </h3>
  );
}

export default function PersonalReport({ embedded = false }) {
  const stored = useStore((s) => s.planAnswers);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const ratio = useStore((s) => s.housingRatio ?? 30);
  const r = useMemo(() => buildReport(a, ratio), [a, ratio]);
  const [name, setName] = useState('');
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const job = OCCUPATIONS.find((o) => o.id === a.occupation)?.label;
  const groups = a.groups.map((g) => GROUPS.find((x) => x.id === g)?.label).filter(Boolean);

  return (
    <Wrapper embedded={embedded}>
      {!embedded && <div className="flex flex-wrap gap-3 items-center justify-between mb-6 print:hidden">
        <a href="#/plan" className="btn-link">← Back to my answers</a>
        <div className="flex flex-wrap gap-3 items-center">
          <Eli5Toggle />
          <button type="button" onClick={() => window.print()} className="px-4 py-2 bg-ink text-paper font-semibold cursor-pointer hover:bg-[var(--accent)]">Print / save as PDF</button>
        </div>
      </div>}

      <div className="border-b-2 border-ink pb-5 report-head">
        <p className="kicker mb-2">Personal Home Report · {today}</p>
        <h2 className="display text-4xl sm:text-5xl font-extrabold leading-tight">
          {name ? `${name}'s` : 'Your'} path to a home
        </h2>
        <div className="mt-3 max-w-sm print:hidden">
          <label htmlFor="r-name" className="field-label">Name on the report (optional, stays on this device)</label>
          <input id="r-name" className="field !font-sans" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. The Ramirez family" />
        </div>
        <Explain
          className="mt-4 text-[1.05rem] leading-relaxed"
          plain="This report explains where you stand today, what is already working for you, what to improve, and a step-by-step plan for the next year. It is based only on your answers and is meant to guide a conversation with a housing counselor or lender."
          eli5="This is your own home-buying report card and map. It shows what you're doing great, what to work on, and the steps to take, one at a time."
        />
      </div>

      {/* 1. Snapshot */}
      <H n={1}>Your snapshot</H>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 text-sm">
        {[
          ['Household', `${a.householdSize} ${a.householdSize === 1 ? 'person' : 'people'}`],
          ['County', `${a.county} County`],
          ['Yearly income', formatCurrency(a.income)],
          ['Income group', `${r.ctx.category.label} (${r.pctAmi.toFixed(0)}% of AMI)`],
          ['Monthly debts', formatCurrency(a.monthlyDebts)],
          ['Debt-to-income', `${Math.round(r.dti * 100)}%`],
          ['Savings', formatCurrency(a.savings)],
          ['Credit', r.band.label],
          ['First-time buyer', a.ownedRecently === 'unsure' ? 'Not sure' : a.ownedRecently ? 'No' : 'Yes'],
          ['Job', job],
          ['Groups', groups.length ? groups.join(', ') : 'None yet'],
        ].map(([k, v]) => (
          <div key={k}><dt className="field-label !mb-0">{k}</dt><dd className="font-medium">{v}</dd></div>
        ))}
      </dl>

      {/* 2. Readiness */}
      <H n={2}>Your readiness score</H>
      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="text-center border border-line rounded-2xl bg-card p-5">
          <p className="display text-6xl font-extrabold text-[var(--accent)]">{r.total}</p>
          <p className="text-xs text-muted">out of 100</p>
          <p className="font-semibold mt-1">{r.stage}</p>
        </div>
        <ul className="space-y-2">
          {r.pillars.map((p) => (
            <li key={p.id} className="grid grid-cols-[8rem_1fr_3.5rem] items-center gap-2 text-sm">
              <span>{p.name}</span>
              <span className="h-4 bg-paper border border-rule relative"><span className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: `${(p.score / p.max) * 100}%` }} /></span>
              <span className="num text-right">{p.score}/{p.max}</span>
            </li>
          ))}
        </ul>
      </div>
      <Explain
        className="text-xs text-muted mt-3"
        plain="How it's scored: credit (25 points), debt (20), savings toward your goal (20), programs that fit you (20), and preparation such as the homebuyer class (15). It is a coaching tool, not a lender's decision."
        eli5="Five parts add up to 100 points, like a report card with five subjects."
      />

      {/* 3. Afford */}
      <H n={3}>What you can afford today</H>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-line rounded-2xl bg-card p-4">
          <p className="field-label">Safe monthly housing payment</p>
          <p className="display text-3xl font-bold">{formatCurrency(r.now.budget)}</p>
        </div>
        <div className="border border-line rounded-2xl bg-card p-4">
          <p className="field-label">Home price that payment supports</p>
          <p className="display text-3xl font-bold">{formatCurrency(r.now.price)}</p>
          <p className="text-xs text-muted">FHA at {RATE_INFO.value}%, 3.5% down. Down payment help, city loans, and below-market homes can stretch this.</p>
        </div>
      </div>
      <ul className="mt-4 text-sm space-y-1.5">
        {r.whatIf.debtCut > 0 && (
          <li>📉 Cutting about <strong>{formatCurrency(r.whatIf.debtCut)}/month</strong> of debt payments could raise your price range by about <strong>{formatCurrency(r.whatIf.debtGain)}</strong>.</li>
        )}
        <li>📈 A rate 0.5% lower (better credit, shopping lenders, or a buydown) adds about <strong>{formatCurrency(r.whatIf.rateGain)}</strong> of buying power.</li>
      </ul>

      {/* 4. Strengths and gaps */}
      <H n={4}>What&rsquo;s working, and what to work on</H>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-line rounded-2xl bg-card p-4">
          <p className="field-label">👍 Your strengths</p>
          <ul className="list-disc pl-5 text-sm space-y-1">{r.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="border border-line rounded-2xl bg-card p-4">
          <p className="field-label">🛠️ Work on these</p>
          <ul className="list-disc pl-5 text-sm space-y-1">{r.gaps.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>

      {/* 5. Plan */}
      <H n={5}>Your 12-month improvement plan</H>
      <p className="text-sm mb-3">
        Savings goal: <strong>{formatCurrency(r.savingsTarget)}</strong> (about 1% down, 3% closing costs, and 2 months of payments).
        That&rsquo;s about <strong>{formatCurrency(r.monthlyToSave)}/month</strong> for 12 months.
      </p>
      <ol className="grid sm:grid-cols-2 gap-4">
        {r.phases.map((ph) => (
          <li key={ph.title} className="border border-line rounded-2xl bg-card p-4 break-inside-avoid">
            <p className="display text-lg font-semibold mb-2">{ph.title}</p>
            <ul className="space-y-1.5 text-sm">
              {ph.items.map((it) => <li key={it} className="flex gap-2"><span aria-hidden="true">☐</span><span>{it}</span></li>)}
            </ul>
          </li>
        ))}
      </ol>
      <p className="text-sm mt-3">⚡ On the fast track, your estimated time to keys is about <strong>{Math.round(r.fastWeeks / 4.345)} months</strong>. See your calendar on the plan page.</p>

      {/* 6. Plans */}
      <H n={6}>Your best plans</H>
      <ul className="space-y-3">
        {r.plans.map((p) => (
          <li key={p.id} className="border border-line rounded-2xl bg-card p-4 break-inside-avoid">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">{p.name}</p>
              <span className={`text-[.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 h-fit ${p.fit === 'good' ? 'bg-[var(--accent)] text-paper' : 'bg-gold'}`}>{p.fit === 'good' ? 'Good fit' : 'Maybe'}</span>
            </div>
            <p className="text-sm">{p.simple}</p>
            <p className="text-sm mt-1"><strong>Cash up front:</strong> {p.down} · <strong>First step:</strong> {p.firstStep}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2 text-sm">
              <div><span className="field-label !mb-0">👍 Good</span> {p.pros.join(' · ')}</div>
              <div><span className="field-label !mb-0">👎 Watch out</span> {p.cons.join(' · ')}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* 7. Loans */}
      <H n={7}>Loan types that could work, at {formatCurrency(r.now.price)}</H>
      {r.loans.length === 0 ? (
        <p className="text-sm p-3 border border-line rounded-2xl bg-card">
          No loan type fits your answers yet, which is common after recent credit trouble. Follow the improvement plan above;
          most people qualify for FHA or VA once the waiting period ends and they have 12 months of on-time payments.
          Habitat and a free counselor can help in the meantime.
        </p>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="py-2 pr-2 field-label !mb-0">Loan</th>
              <th className="py-2 pr-2 field-label !mb-0">Cash up front</th>
              <th className="py-2 pr-2 field-label !mb-0">Monthly</th>
              <th className="py-2 field-label !mb-0">Check</th>
            </tr>
          </thead>
          <tbody>
            {r.loans.map((l) => (
              <tr key={l.id} className="border-b border-rule align-top">
                <td className="py-2 pr-2 font-medium">{l.name}</td>
                <td className="py-2 pr-2 num">{formatCurrency(l.cost.cash)}</td>
                <td className="py-2 pr-2 num">{formatCurrency(l.cost.monthly)}</td>
                <td className="py-2 text-xs text-muted">{l.fit.notes.join(' ') || 'Looks OK from your answers'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* 8. Contacts */}
      <H n={8}>Who to contact</H>
      <ul className="grid sm:grid-cols-2 gap-3 text-sm">
        {r.helpers.map((h) => (
          <li key={h.name}><p className="font-semibold">{h.name}</p><p className="text-muted">{h.what}</p>{h.url && <p className="text-xs break-all">{h.url}</p>}</li>
        ))}
      </ul>

      {/* 9. Lessons */}
      <H n={9}>Money lessons for you</H>
      <ol className="space-y-3">
        {r.lessons.map((l) => (
          <li key={l.title} className="break-inside-avoid">
            <p className="font-semibold">{l.title}</p>
            <Explain plain={l.plain} eli5={l.eli5} className="text-sm leading-relaxed" />
          </li>
        ))}
      </ol>

      {/* 10. Words */}
      <H n={10}>Words to know</H>
      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {GLOSSARY.filter((g) => WORDS.includes(g.term)).map((g) => (
          <div key={g.term}><dt className="font-semibold">{g.term}</dt><dd><Explain plain={g.plain} eli5={g.eli5} /></dd></div>
        ))}
      </dl>

      <p className="mt-10 p-3 border-l-4 border-gold bg-gold/10 text-xs">
        This report is an educational estimate based on your answers. It is not a loan offer, credit decision, or financial
        advice. Programs and rates change. Confirm everything with a HUD-approved housing counselor and licensed lender.
        Your answers are stored only in this browser.
      </p>
    </Wrapper>
  );
}

function Wrapper({ embedded, children }) {
  return embedded
    ? <div className="max-w-4xl report-page">{children}</div>
    : <main className="mx-auto px-4 sm:px-6 py-10 max-w-4xl report-page">{children}</main>;
}
