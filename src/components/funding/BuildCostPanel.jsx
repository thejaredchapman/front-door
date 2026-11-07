import Section from './Section';
import ExternalServicesList from '../ExternalServicesList';

/** Every network call the running app makes, and what each one costs. Keep in sync with docs/BUILD_LOG.md. */
const RUNTIME_CALLS = [
  { call: '"Explain it to me" button / simple-words switch', where: 'In the browser (pre-written text)', cost: '$0.00', note: 'No AI call. Works offline.' },
  { call: 'Ask Doorie (chatbot)', where: 'In the browser (Front Door\'s own content)', cost: '$0.00', note: 'No AI call; questions never leave the device.' },
  { call: 'News and program status', where: 'Same site (/updates/*.json)', cost: '$0.00', note: 'Updated by the daily check (Claude Haiku only for changed pages, logged per call).' },
  { call: 'Program matching, income limits, gap math', where: 'In the browser (JavaScript)', cost: '$0.00', note: 'Data ships with the app.' },
  { call: 'Live weather for city panel', where: 'api.open-meteo.com', url: 'https://open-meteo.com/', cost: '$0.00', note: 'Free, no API key. Calculator view only.' },
  { call: 'Google Fonts', where: 'fonts.googleapis.com', url: 'https://fonts.google.com/', cost: '$0.00', note: 'Free.' },
  { call: 'Hosting (static site)', where: 'Vercel / Netlify / GitHub Pages', url: 'https://vercel.com/', cost: '$0.00', note: 'Free tiers cover a hackathon demo.' },
];

export default function BuildCostPanel() {
  return (
    <Section id="built" kicker="Transparency" title="How this was built, and what it costs">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">Cost per call when you use it</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 field-label !mb-0">Call</th>
                <th className="py-2 pr-3 field-label !mb-0">Cost</th>
              </tr>
            </thead>
            <tbody>
              {RUNTIME_CALLS.map((r) => (
                <tr key={r.call} className="border-b border-rule align-top">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{r.call}</div>
                    <div className="text-xs text-muted">{r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="underline">{r.where}</a> : r.where} · {r.note}</div>
                  </td>
                  <td className="py-2 num">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm mt-3">
            <strong>Total per visitor: $0.</strong> Front Door has no backend, no account, and no paid APIs. Your answers
            stay in your own browser.
          </p>
        </div>
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">How it was built</h3>
          <ul className="text-sm space-y-2 list-disc pl-5">
            <li>React 19, Vite, Tailwind CSS v4, and Zustand. Static site, no server.</li>
            <li>Built with Claude Code (an AI coding assistant), including a research agent that checked 80+ web sources for current programs.</li>
            <li>Income limits, Habitat facts, Prop 1, and energy-code details were read from the hackathon source PDFs and cited.</li>
            <li>Every program carries a verified, unverified, or closed status. Nothing is presented as a guarantee.</li>
          </ul>
          <p className="text-sm mt-3">
            The full step-by-step build log, including AI build costs, is in <code className="num text-xs">docs/BUILD_LOG.md</code>.
          </p>
        </div>
      </div>
      <h3 className="display text-2xl font-bold mt-10 mb-4">Every outside service, data source, and tool</h3>
      <ExternalServicesList />
      <p className="text-sm mt-6">
        Presentation materials: <a className="btn-link" href="presentation/handout.html" target="_blank" rel="noreferrer">one-page handout ↗</a> ·{' '}
        <a className="btn-link" href="presentation/slides.html" target="_blank" rel="noreferrer">slides ↗</a>
      </p>
    </Section>
  );
}
