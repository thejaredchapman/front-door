import { useT } from '../../i18n';
import Section from './Section';
import ExternalServicesList from '../ExternalServicesList';
import COSTS from '../../data/buildCosts.json';
import { TEAM } from '../../data/team';

const usd = (n) => (n === 0 ? '$0.00' : n < 0.01 ? `$${n.toFixed(6)}` : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const tok = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n));
const api = (label) => COSTS.anthropicApi.find((a) => a.label.startsWith(label)) || { calls: 0, usd: 0 };

/** One row per service, with the actual amount spent so far. Numbers come from `npm run cost-report`. */
const SERVICES = [
  {
    service: 'Claude Code', url: 'https://claude.com/claude-code', what: 'AI coding assistant (Claude Opus 5.5) that designed, wrote, researched, and tested Front Door',
    usage: `${COSTS.claudeCode.totals.calls} model calls · ${tok(COSTS.claudeCode.totals.output)} tokens written · ${tok(COSTS.claudeCode.totals.cacheRead)} tokens re-read from cache`,
    cost: COSTS.claudeCode.totals.usd, label: 'List price', note: 'Pay-as-you-go API price for the tokens actually used. On a Claude subscription, the bill is the plan fee instead.',
  },
  {
    service: 'Anthropic API · Claude Haiku 5.5', url: 'https://platform.claude.com/', what: 'Key check, Doorie\'s "Summarize with AI" button, translation script, and daily news check',
    usage: `${api('Key check').calls} key check · ${api('Doorie').calls} AI summaries (testing) · ${api('Translation').calls} translation calls · ${api('Daily').calls} daily-check calls`,
    cost: COSTS.anthropicApi.reduce((s, a) => s + a.usd, 0), label: 'Billed', note: 'Each call is logged in docs/*-log.jsonl. Translations shipped so far were written during the build, not by the script.',
  },
  {
    service: 'ElevenLabs', url: 'https://elevenlabs.io/', what: 'Voiceover for the 30-second video, and Doorie\'s voice (planned)',
    usage: `${COSTS.elevenlabs.runs} runs · ${COSTS.elevenlabs.characters} characters`, cost: 0, label: 'Not used yet', note: COSTS.elevenlabs.note,
  },
  {
    service: 'RentCast', url: 'https://www.rentcast.io/api', what: 'Homes for sale for the affordability map (planned)',
    usage: '0 calls', cost: 0, label: 'Not connected', note: 'Free plan: 50 calls a month, then $0.20 a call. Needs a key.',
  },
  {
    service: 'Google Maps Platform', url: 'https://developers.google.com/maps', what: 'Map pins for affordable homes (planned)',
    usage: '0 map loads', cost: 0, label: 'Not connected', note: 'Needs a key restricted to this site.',
  },
  {
    service: 'Vercel', url: 'https://vercel.com/', what: 'Hosting and the /api/rates function',
    usage: '3 production deploys · about 10-second builds', cost: 0, label: '$0 extra', note: 'Runs on an existing Vercel Pro team plan that wasn\'t bought for this project. Usage so far fits in what the plan includes.',
  },
  {
    service: 'GitHub', url: 'https://github.com/thejaredchapman/front-door', what: 'Public code repository and the daily-check workflow',
    usage: 'Public repo · 0 Actions runs so far', cost: 0, label: 'Free', note: 'Actions are free for public repositories.',
  },
  {
    service: 'Free public data', url: null, what: 'Freddie Mac rates, HCD income limits, FHFA loan limits, CalHFA, county and city program pages, lender rate pages, Open-Meteo weather, Google Fonts',
    usage: 'Read at build time, daily, or when you open a page', cost: 0, label: 'Free', note: 'No keys or fees.',
  },
];

/** Every call a visitor's browser makes, and what it costs. */
const RUNTIME_CALLS = [
  { call: '"Explain it to me" button / simple-words switch', where: 'In the browser (pre-written text)', cost: '$0.00', note: 'No AI call. Works offline.' },
  { call: 'Ask Doorie (chatbot) and official-document search', where: 'In the browser (Front Door\'s content + 60 official documents)', cost: '$0.00', note: 'No AI call; questions stay on the device. The 475 KB library loads only when needed.' },
  { call: '"Summarize with AI" (optional button)', where: 'Front Door\'s /api/ask → Claude Haiku 5.5', url: 'https://platform.claude.com/', cost: '≈$0.0003', note: 'Only when tapped. Sends the question and passage numbers, about 1,300 tokens in and 150 out. Limited to 20 per hour per person.' },
  { call: 'Check-in, home goal, program matching, calendar, quote comparer', where: 'In the browser (JavaScript)', cost: '$0.00', note: 'Data ships with the app.' },
  { call: 'Rates lenders post today', where: 'Front Door\'s /api/rates (Vercel function)', cost: '$0.00', note: 'Cached 5 minutes, so 3 lender pages are read at most every 5 minutes. No personal data is sent.' },
  { call: 'News and program status', where: 'Same site (/updates/*.json)', cost: '$0.00', note: 'Updated by the daily check.' },
  { call: 'Live weather for city panel', where: 'api.open-meteo.com', url: 'https://open-meteo.com/', cost: '$0.00', note: 'Free, no API key. Calculator view only.' },
  { call: 'Google Fonts', where: 'fonts.googleapis.com', url: 'https://fonts.google.com/', cost: '$0.00', note: 'Free.' },
];

const LABEL_CLASS = { 'List price': 'badge-maybe', Billed: 'badge-good', Free: 'badge-good', '$0 extra': 'badge-good', 'Not used yet': 'badge-outline', 'Not connected': 'badge-outline' };

export default function BuildCostPanel() {
  const t = useT();
  const total = SERVICES.reduce((s, x) => s + x.cost, 0);
  const updated = new Date(COSTS.generatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <Section id="built" kicker="Transparency" title="How this was built, and what it cost">
      <div className="card mb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
          <h3 className="display text-2xl font-bold">{t('What each service actually cost')}</h3>
          <p className="text-sm text-muted">{t('Updated {date} · run npm run cost-report to refresh', { date: updated })}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-sm">
            <thead>
              <tr><th scope="col">{t('Service')}</th><th scope="col">{t('Used for')}</th><th scope="col">{t('Actual usage')}</th><th scope="col">{t('Cost')}</th></tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => (
                <tr key={s.service}>
                  <th scope="row" className="whitespace-nowrap">{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{s.service}</a> : t(s.service)}</th>
                  <td>{t(s.what)}<span className="block text-xs text-muted mt-0.5">{t(s.note)}</span></td>
                  <td className="text-xs">{t(s.usage)}</td>
                  <td className="whitespace-nowrap">
                    <span className="num font-bold block">{usd(s.cost)}</span>
                    <span className={`badge ${LABEL_CLASS[s.label]} mt-1`}>{t(s.label)}</span>
                  </td>
                </tr>
              ))}
              <tr className="is-best">
                <th scope="row">{t('Total so far')}</th>
                <td colSpan={2} className="text-xs">{t('Almost all of it is the AI assistant that built the app. Running Front Door costs $0 per visitor.')}</td>
                <td className="num font-bold whitespace-nowrap">{usd(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <details className="mt-4">
          <summary className="btn-link cursor-pointer">{t('See the Claude Code cost for each part of the build')}</summary>
          <div className="overflow-x-auto mt-3">
            <table className="data-table w-full text-sm">
              <thead><tr><th scope="col">{t('Part of the build')}</th><th scope="col">{t('Model calls')}</th><th scope="col">{t('Tokens written')}</th><th scope="col">{t('Tokens read from cache')}</th><th scope="col">{t('Cost')}</th></tr></thead>
              <tbody>
                {COSTS.claudeCode.parts.slice().sort((a, b) => b.usd - a.usd).map((p) => (
                  <tr key={p.label}>
                    <th scope="row">{t(p.label)} {p.kind !== 'main' && <span className="text-xs text-muted">({t(p.kind === 'web-fetch' ? 'page reader' : 'research helper')})</span>}</th>
                    <td className="num">{p.calls}</td>
                    <td className="num">{tok(p.output)}</td>
                    <td className="num">{tok(p.cacheRead)}</td>
                    <td className="num">{usd(p.usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-2">
            {t('Priced at Claude Opus 5.5 list prices: $4 per million input tokens, $5 per million written to cache, $0.20 per million read from cache, $20 per million output. Source:')}{' '}
            <a href={COSTS.pricing.source} target="_blank" rel="noreferrer" className="underline">{t('Anthropic pricing')}</a> ({COSTS.pricing.checked}).{' '}
            {t('Most tokens are cache reads: each step re-reads the conversation so far at a 95% discount.')}
          </p>
        </details>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">{t('Cost per call when you use it')}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-left">
                <th className="py-2 pr-3 field-label !mb-0">{t('Call')}</th>
                <th className="py-2 pr-3 field-label !mb-0">{t('Cost')}</th>
              </tr>
            </thead>
            <tbody>
              {RUNTIME_CALLS.map((r) => (
                <tr key={r.call} className="border-b border-rule align-top">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{t(r.call)}</div>
                    <div className="text-xs text-muted">{r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="underline">{r.where}</a> : t(r.where)} · {t(r.note)}</div>
                  </td>
                  <td className="py-2 num">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm mt-3">
            <strong>{t('Total per visitor: $0')}</strong> {t('unless they tap "Summarize with AI" (about $0.0003 each). No account, and your answers stay in your own browser.')}
          </p>
        </div>
        <div className="panel !mb-0">
          <h3 className="kicker mb-3">{t('How it was built')}</h3>
          <p className="text-sm mb-3"><strong>{t('Built by')}:</strong> {TEAM.join(', ')}</p>
          <ul className="text-sm space-y-2 list-disc pl-5">
            <li>{t('React 19, Vite, Tailwind CSS v4, and Zustand, hosted on Vercel with two small server functions: lender rates and the optional AI summary.')}</li>
            <li>{t('Doorie\'s document library: 60 official PDFs split into 688 passages and searched in the browser (BM25). "Summarize with AI" sends only the question and passage numbers to Claude Haiku.')}</li>
            <li>{t('Built with Claude Code (an AI coding assistant). Research helpers checked official sources for programs, laws, lenders, and 2026 limits.')}</li>
            <li>{t('Income limits, Habitat facts, Prop 1, and energy-code details were read from the hackathon source PDFs and cited.')}</li>
            <li>{t('Every program carries a verified, unverified, or closed status. Nothing is presented as a guarantee.')}</li>
          </ul>
          <p className="text-sm mt-3">
            {t('The step-by-step build log is in')} <code className="num text-xs">docs/BUILD_LOG.md</code>.
          </p>
        </div>
      </div>
      <h3 className="display text-2xl font-bold mt-10 mb-4">{t('Every outside service, data source, and tool')}</h3>
      <ExternalServicesList />
      <p className="text-sm mt-6">
        {t('Presentation materials:')} <a className="btn-link" href="presentation/handout.html" target="_blank" rel="noreferrer">{t('one-page handout')} ↗</a> ·{' '}
        <a className="btn-link" href="presentation/slides.html" target="_blank" rel="noreferrer">{t('slides')} ↗</a>
      </p>
    </Section>
  );
}
