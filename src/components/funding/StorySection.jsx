import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import { STORY_FAMILY, STORY_CHAPTERS, STORY_STACK } from '../../data/story';
import { calculateMonthlyPayment } from '../../utils/amortization';
import { formatCurrency } from '../../utils/formatters';

function StackBox() {
  const s = STORY_STACK;
  const myHome = s.price * (s.myHomePercent / 100);
  const firstLoan = s.price - myHome - s.citySilentSecond;
  const pi = calculateMonthlyPayment(firstLoan, s.rate, 30);
  const tax = (s.price * s.propertyTaxRate) / 100 / 12;
  const ins = s.annualInsurance / 12;
  const mip = (firstLoan * s.fhaAnnualMipPercent) / 100 / 12;
  const total = pi + tax + ins + mip;
  const share = (total / (STORY_FAMILY.income / 12)) * 100;

  const rows = [
    ['Home price (deed-restricted)', s.price],
    [`CalHFA MyHome junior loan (${s.myHomePercent}%, deferred)`, -myHome],
    ['City silent second (example, deferred)', -s.citySilentSecond],
    ['First mortgage (FHA)', firstLoan],
  ];
  const monthly = [
    [`Principal & interest at ${s.rate}%`, pi],
    ['Property tax (assumed 1.1%)', tax],
    ['Insurance (assumed)', ins],
    ['FHA mortgage insurance', mip],
  ];

  return (
    <div className="mt-5 grid sm:grid-cols-2 gap-5 p-4 border border-line rounded-2xl bg-paper">
      <div>
        <h4 className="field-label">How the price is covered</h4>
        <dl className="text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-1.5 border-b border-rule">
              <dt>{k}</dt><dd className="num">{v < 0 ? `−${formatCurrency(-v)}` : formatCurrency(v)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <h4 className="field-label">Monthly payment</h4>
        <dl className="text-sm">
          {monthly.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 py-1.5 border-b border-rule">
              <dt>{k}</dt><dd className="num">{formatCurrency(v)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 py-1.5 font-semibold">
            <dt>Total</dt><dd className="num">{formatCurrency(total)}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted mt-1">That is {share.toFixed(0)}% of their gross monthly income.</p>
      </div>
      <p className="sm:col-span-2 text-xs text-muted">
        Illustrative only. The city silent-second amount is an example; real programs, limits and terms vary and change.
      </p>
    </div>
  );
}

export default function StorySection() {
  const [i, setI] = useState(0);
  const ch = STORY_CHAPTERS[i];
  const last = STORY_CHAPTERS.length - 1;

  return (
    <Section
      id="story"
      kicker="A story you can follow"
      title={`${STORY_FAMILY.names} find their way home`}
      intro={<p className="text-muted">{STORY_FAMILY.jobs} <em>(A made-up family, based on real programs and 2026 Orange County numbers.)</em></p>}
    >
      <ol className="flex flex-wrap gap-2 mb-5" aria-label="Chapters">
        {STORY_CHAPTERS.map((c, idx) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setI(idx)}
              aria-current={idx === i ? 'step' : undefined}
              className={`px-3 py-1.5 text-sm border border-line rounded-2xl cursor-pointer transition-colors ${
                idx === i ? 'bg-ink text-paper' : idx < i ? 'bg-gold/30' : 'bg-card hover:bg-paper'
              }`}
            >
              <span className="num mr-1">{idx + 1}</span> {c.title}
            </button>
          </li>
        ))}
      </ol>

      <article className="panel" aria-live="polite">
        <p className="kicker mb-2">Chapter {i + 1} of {STORY_CHAPTERS.length}</p>
        <h3 className="display text-3xl font-semibold mb-4">{ch.title}</h3>
        <Explain plain={ch.plain} eli5={ch.eli5} className="text-[1.05rem] leading-relaxed max-w-3xl" />
        {ch.id === 'stack' && <StackBox />}
        <div className="mt-6">
          <h4 className="field-label">What they did</h4>
          <ul className="space-y-1.5">
            {ch.did.map((d) => (
              <li key={d} className="flex gap-2 text-sm"><span aria-hidden="true" className="text-[var(--accent)] font-bold">✓</span>{d}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-8 pt-4 border-t border-rule">
          <button type="button" className="btn-link disabled:opacity-30 disabled:no-underline" disabled={i === 0} onClick={() => setI(i - 1)}>← Previous</button>
          {i < last
            ? <button type="button" className="btn-link" onClick={() => setI(i + 1)}>Next: {STORY_CHAPTERS[i + 1].title} →</button>
            : <a className="btn-link" href="#fit">Now try it with your numbers →</a>}
        </div>
      </article>
    </Section>
  );
}
