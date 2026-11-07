import Section from './Section';
import ExternalServicesList from '../ExternalServicesList';
import { DOC_SOURCES } from '../../data/ocFacts';
import RATE_INFO from '../../data/rate.json';

const WEB_SOURCES = [
  { name: `Freddie Mac PMMS: 30-yr ${RATE_INFO.value}% (${RATE_INFO.asOf})`, url: 'https://www.freddiemac.com/pmms', status: 'Verified' },
  { name: 'HCD 2026 State Income Limits (revised June 23, 2026)', url: 'https://www.hcd.ca.gov/sites/default/files/docs/grants-and-funding/income-limits-2026.pdf', status: 'Verified' },
  { name: 'HCD 2026 State HOME Income Limits (eff. June 1, 2026)', url: 'https://www.hcd.ca.gov/sites/default/files/docs/grants-and-funding/2026-california-HOME-income-limits_0.pdf', status: 'Verified' },
  { name: 'CA Health & Safety Code §50052.5 (affordable housing cost)', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=50052.5', status: 'Verified' },
  { name: 'CalHFA homebuyer programs', url: 'https://www.calhfa.ca.gov/homebuyer/programs/', status: 'Verified' },
  { name: 'CalHFA Dream For All', url: 'https://www.calhfa.ca.gov/dream/', status: 'Verified (2026 round closed)' },
  { name: 'HCD CalHome', url: 'https://www.hcd.ca.gov/grants-and-funding/programs-active/calhome', status: 'Verified' },
  { name: 'HUD Exchange SHOP (sweat-equity land & infrastructure)', url: 'https://www.hudexchange.info/programs/shop/', status: 'Verified' },
  { name: 'FHLBank SF WISH', url: 'https://fhlbsf.com/products/community-programs-grants/wish', status: 'Verified' },
  { name: 'Habitat OC: review qualifications', url: 'https://habitatoc.org/review-qualifications', status: 'Verified' },
  { name: 'Garden Grove First-Time Home Buyer', url: 'https://ggcity.org/FTHB', status: 'Verified' },
  { name: 'Santa Ana My First Home', url: 'https://santa-ana.org/my-first-home', status: 'Page loads; 2026 terms unverified' },
  { name: 'OC Mortgage Credit Certificate', url: 'https://ocgov.com/residents/mortgage-credit-certificate-program', status: 'Verified; credit rate unverified' },
  { name: 'GSFA Platinum', url: 'https://gsfahome.org/programs/dpa/platinum.shtml', status: 'Verified' },
  { name: 'SchoolsFirst FCU $7,500 grant (May 12, 2026)', url: 'https://www.schoolsfirstfcu.org/about-us/newsroom/2026/2026-05-12-press-release/', status: 'Verified' },
  { name: 'LAO: Propositions 1 and 37 (2026)', url: 'https://lao.ca.gov/BallotAnalysis/Proposition?number=1&year=2026', status: 'Verified; results uncertified' },
  { name: 'C.A.R. Housing Affordability Index', url: 'https://www.car.org/marketdata/data/haitraditional', status: 'Verified' },
  { name: 'Grounded Solutions: community land trusts', url: 'https://groundedsolutions.org/strengthening-neighborhoods/community-land-trusts', status: 'Verified' },
];

export default function SourcesSection() {
  return (
    <Section id="sources" kicker="Check our work" title="Sources">
      <p className="text-sm max-w-3xl mb-5">
        Checked November 6–7, 2026. Program terms change often, and city sites sometimes block automated checks.
        Anything marked &ldquo;unverified&rdquo; is a lead to confirm by phone, not a fact. Nothing here is a loan offer.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="field-label">Hackathon source documents</h3>
          <ul className="text-sm space-y-2">
            {Object.values(DOC_SOURCES).map((s) => (
              <li key={s.title}><a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="field-label">Web sources</h3>
          <ul className="text-sm space-y-2">
            {WEB_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">{s.name}</a>
                <span className="text-xs text-muted"> · {s.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className="display text-2xl font-bold mt-10 mb-4">Organizations and services we link to</h3>
      <ExternalServicesList groups={['help', 'lenders', 'gov', 'data']} />
    </Section>
  );
}
