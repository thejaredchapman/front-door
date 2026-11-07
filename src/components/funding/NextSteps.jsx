import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';

const STEPS = [
  {
    title: 'Take a free homebuyer class',
    plain: 'Book NeighborWorks OC\'s free Homebuyer 101, or any HUD-approved counselor, and finish the 8-hour certificate. Almost every program requires it.',
    eli5: 'Go to the free class first. It is the ticket that lets you in to see the helpers.',
  },
  {
    title: 'Check your credit and budget',
    plain: 'Pull free reports at annualcreditreport.com. Aim for 640+ (580 is the FHA minimum). Pay cards below 30% of their limits and list all monthly debts.',
    eli5: 'Look at your money report card. Pay bills on time, and keep credit cards from getting too full.',
  },
  {
    title: 'Gather your papers',
    plain: '2 years of tax returns and W-2s, 30 days of pay stubs, 2 months of bank statements, ID, and any gift letters.',
    eli5: 'Put all your money papers in one folder so helpers can see you are ready.',
  },
  {
    title: 'Save a small cushion',
    plain: 'Many programs need 1–3% from you, plus a few months of payments in reserve. Automate a transfer every payday.',
    eli5: 'Put a little money in a special jar every payday. Small amounts add up.',
  },
  {
    title: 'Get on every list',
    plain: 'Attend a Habitat OC orientation, sign up for city below-market-rate home lists, and watch for the next CalHFA Dream For All round.',
    eli5: 'Put your name on every list. The more doors you knock on, the sooner one opens.',
  },
  {
    title: 'Find a lender who knows the programs',
    plain: 'Choose a CalHFA-approved lender who also works with your city\'s program. Ask: "Which assistance can you stack on my loan?" Then get pre-approved.',
    eli5: 'Find a bank helper who knows all the other helpers, and ask them to put the pieces together for you.',
  },
  {
    title: 'Read before you sign',
    plain: 'Understand every deed restriction, resale cap, and repayment trigger. Never pay up-front fees for "grant" applications. Real programs don\'t charge them.',
    eli5: 'Read the rules before you sign. If someone asks you to pay to get a "free" present, that is a trick.',
  },
];

export default function NextSteps() {
  const [done, setDone] = useState(() => new Set());
  const toggle = (i) => setDone((prev) => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <Section id="steps" kicker="Step 3 · Do this next" title="Your checklist">
      <p className="num text-sm mb-3">{done.size} of {STEPS.length} done</p>
      <ol className="border-t-2 border-ink">
        {STEPS.map((s, i) => (
          <li key={s.title} className="py-4 border-b border-rule grid grid-cols-[2.5rem_1fr] gap-3">
            <input
              type="checkbox"
              aria-label={`Mark "${s.title}" done`}
              checked={done.has(i)}
              onChange={() => toggle(i)}
              className="w-6 h-6 mt-1 accent-[var(--accent)]"
            />
            <div>
              <h3 className={`display text-xl font-semibold ${done.has(i) ? 'line-through text-muted' : ''}`}>
                <span className="num text-sm text-muted mr-2">{i + 1}</span>{s.title}
              </h3>
              <Explain plain={s.plain} eli5={s.eli5} className="text-sm leading-relaxed mt-1" />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
