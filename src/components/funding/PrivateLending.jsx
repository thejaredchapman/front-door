import Section from './Section';
import Explain from './Explain';
import { PRIVATE_OPTIONS, RED_FLAGS, CHECK_A_LENDER } from '../../data/privateLending';

const RISK = {
  low: { t: 'Lower risk', c: 'bg-[var(--accent)] text-paper' },
  medium: { t: 'Medium risk: compare carefully', c: 'bg-gold text-ink' },
  high: { t: 'High risk: get advice first', c: 'bg-[#B4400F] text-paper' },
};

export default function PrivateLending() {
  return (
    <Section
      id="private"
      kicker="Outside the big programs"
      title="Private lending: real options and red flags"
      intro={
        <Explain
          plain="Private lending means money that doesn't come from government-backed loans (FHA, VA, USDA) or the standard Fannie Mae and Freddie Mac loans. It can open doors for self-employed workers, gig drivers, ITIN filers, and families with relatives who can help. It's also where most predatory loans hide. Use the safest option that works for you, and check every lender."
          eli5="Some home loans come from regular banks with government rules. Others come from private lenders, family, or even the seller. Some are great; some are tricky. Here's how to tell."
        />
      }
    >
      <div className="grid md:grid-cols-2 gap-5">
        {PRIVATE_OPTIONS.map((o) => {
          const risk = RISK[o.risk];
          return (
            <article key={o.id} className="bg-card border border-line rounded-2xl p-4 flex flex-col">
              <span className={`self-start text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 ${risk.c}`}>{risk.t}</span>
              <h3 className="display text-xl font-semibold mt-2">{o.name}</h3>
              <p className="text-xs text-muted mb-2"><strong>Who it&rsquo;s for:</strong> {o.who}</p>
              <Explain plain={o.plain} eli5={o.eli5} className="text-sm leading-relaxed" />
              <p className="text-sm mt-2"><strong>Typical terms:</strong> {o.typical}</p>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div><p className="field-label">👍 Good</p><ul className="list-disc pl-4 space-y-0.5">{o.pros.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><p className="field-label">👎 Watch out</p><ul className="list-disc pl-4 space-y-0.5">{o.cons.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <a href={o.url} target="_blank" rel="noreferrer" className="btn-link mt-auto pt-3">Learn more →</a>
            </article>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-2">Typical terms are general ranges, not quotes. They vary widely by lender and borrower.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">🚩 Red flags: walk away if you see these</h3>
          <ul className="space-y-1.5 text-sm">{RED_FLAGS.map((f) => <li key={f} className="flex gap-2"><span aria-hidden="true">🚩</span>{f}</li>)}</ul>
        </div>
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">✅ Check a lender in 2 minutes</h3>
          <ul className="space-y-3 text-sm">
            {CHECK_A_LENDER.map((c) => (
              <li key={c.name}>
                <a href={c.url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">{c.name}</a>
                <p className="text-muted">{c.what}</p>
              </li>
            ))}
          </ul>
          <Explain
            className="text-sm mt-4"
            plain="Before signing any private loan, ask a free HUD-approved counselor to review the Loan Estimate with you. It costs nothing and can save your home."
            eli5="Before you sign, show the papers to a free helper. They'll spot the tricks."
          />
        </div>
      </div>
    </Section>
  );
}
