/**
 * Every outside organization, data source, service, and tool Front Door mentions or uses,
 * with its official link. Used by the Sources page, the "How this was built" page, and
 * Doorie (which links any of these it mentions). `aliases` are extra names to recognize.
 */
export const SERVICE_GROUPS = [
  { id: 'help', title: 'Homebuyer help & programs' },
  { id: 'lenders', title: 'Lenders & credit unions' },
  { id: 'gov', title: 'Government & consumer protection' },
  { id: 'data', title: 'Data sources' },
  { id: 'runtime', title: 'Services the site connects to' },
  { id: 'tech', title: 'Tools & technologies used to build it' },
];

export const SERVICES = [
  // Homebuyer help & programs
  { name: 'Habitat for Humanity of Orange County', aliases: ['Habitat OC', 'Habitat for Humanity'], url: 'https://habitatoc.org/', group: 'help' },
  { name: 'NeighborWorks Orange County', aliases: ['NeighborWorks OC', 'NeighborWorks'], url: 'https://www.nwoc.org/', group: 'help' },
  { name: 'CalHFA (California Housing Finance Agency)', aliases: ['CalHFA', 'MyHome', 'Dream For All', 'ZIP', 'MyAccess'], url: 'https://www.calhfa.ca.gov/homebuyer/programs/index.htm', group: 'help' },
  { name: 'County of Orange Mortgage Assistance Program', aliases: ['County Mortgage Assistance Program', 'MAP', 'Affordable Housing Clearinghouse'], url: 'https://housing.oc.gov/housing-development', group: 'help' },
  { name: 'Orange County Housing Authority', aliases: ['OC Housing Authority', 'Section 8'], url: 'https://housingauthority.oc.gov/special-housing-programs/homeownership-program', group: 'help' },
  { name: 'Santa Ana My First Home', aliases: ['My First Home'], url: 'https://santa-ana.org/my-first-home', group: 'help' },
  { name: 'Garden Grove First-Time Home Buyer Program', aliases: ['Garden Grove'], url: 'https://ggcity.org/FTHB', group: 'help' },
  { name: 'Anaheim First-Time Homebuyer Program', aliases: ['Anaheim'], url: 'https://www.anaheim.net/6695/First-Time-Homebuyer-Program', group: 'help' },
  { name: 'City of Irvine Affordable Housing', aliases: ['Irvine'], url: 'https://cityofirvine.gov/affordable-housing', group: 'help' },
  { name: 'GSFA Platinum (Golden State Finance Authority)', aliases: ['GSFA'], url: 'https://gsfahome.org/programs/dpa/platinum.shtml', group: 'help' },
  { name: 'FHLBank San Francisco WISH', aliases: ['WISH', 'FHLBank'], url: 'https://fhlbsf.com/products/community-programs-grants/wish', group: 'help' },
  { name: 'Mortgage Credit Certificate (National Homebuyers Fund)', aliases: ['Mortgage Credit Certificate', 'MCC'], url: 'https://ocgov.com/residents/mortgage-credit-certificate-program', group: 'help' },
  { name: 'CalABLE', aliases: ['CalABLE'], url: 'https://www.calable.ca.gov/', group: 'help' },
  { name: 'HUD housing counselor finder', aliases: ['HUD-approved', 'housing counselor'], url: 'https://www.hud.gov/findacounselor', group: 'help' },
  { name: 'Disability Rights California', aliases: ['Disability Rights California'], url: 'https://www.disabilityrightsca.org/', group: 'help' },
  { name: 'Grounded Solutions Network (community land trusts)', aliases: ['community land trust'], url: 'https://groundedsolutions.org/strengthening-neighborhoods/community-land-trusts', group: 'help' },

  // Lenders & credit unions
  { name: 'SchoolsFirst Federal Credit Union', aliases: ['SchoolsFirst'], url: 'https://www.schoolsfirstfcu.org/', group: 'lenders' },
  { name: 'Firefighters First Credit Union', aliases: ['Firefighters First'], url: 'https://www.firefightersfirstcu.org/', group: 'lenders' },
  { name: "Orange County's Credit Union", aliases: ["Orange County's Credit Union"], url: 'https://orangecountyscu.org/', group: 'lenders' },
  { name: 'Navy Federal Credit Union', aliases: ['Navy Federal'], url: 'https://www.navyfederal.org/', group: 'lenders' },
  { name: 'Golden 1 Credit Union', aliases: ['Golden 1'], url: 'https://www.golden1.com/', group: 'lenders' },
  { name: 'Wescom Credit Union', aliases: ['Wescom'], url: 'https://www.wescom.org/', group: 'lenders' },
  { name: 'Fannie Mae HomeReady', aliases: ['HomeReady', 'Fannie Mae'], url: 'https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/homeready-mortgage', group: 'lenders' },
  { name: 'Freddie Mac Home Possible', aliases: ['Home Possible'], url: 'https://sf.freddiemac.com/working-with-us/origination-underwriting/mortgage-products/home-possible', group: 'lenders' },
  { name: 'Bank of America affordable programs', aliases: ['Bank of America'], url: 'https://www.bankofamerica.com/mortgage/affordable-housing-programs/', group: 'lenders' },
  { name: 'Chase Homebuyer Grant', aliases: ['Chase'], url: 'https://chase.com/personal/mortgage/education/financing-a-home/chase-homebuyer-grant', group: 'lenders' },
  { name: 'Wells Fargo affordable options', aliases: ['Wells Fargo'], url: 'https://www.wellsfargo.com/mortgage/buying-a-house/affordable-options/', group: 'lenders' },
  { name: 'U.S. Bank American Dream', aliases: ['U.S. Bank'], url: 'https://www.usbank.com/home-loans/mortgage/american-dream-mortgage.html', group: 'lenders' },
  { name: 'Citi Lender Paid Assistance', aliases: ['Citi'], url: 'https://www.citi.com/mortgage/lender-paid-assistance', group: 'lenders' },

  // Government & consumer protection
  { name: 'HUD / FHA loans', aliases: ['FHA', 'HUD'], url: 'https://www.hud.gov/buying/loans', group: 'gov' },
  { name: 'VA home loans', aliases: ['VA loan', 'VA loans', 'VA'], url: 'https://www.va.gov/housing-assistance/home-loans/', group: 'gov' },
  { name: 'CalVet Home Loans', aliases: ['CalVet'], url: 'https://www.calvet.ca.gov/HomeLoans', group: 'gov' },
  { name: 'USDA Rural Development home loans', aliases: ['USDA'], url: 'https://www.rd.usda.gov/programs-services/single-family-housing-programs', group: 'gov' },
  { name: 'HUD reverse mortgages (HECM)', aliases: ['HECM', 'reverse mortgage'], url: 'https://www.hud.gov/program_offices/housing/sfh/hecm/hecmhome', group: 'gov' },
  { name: 'California Department of Housing and Community Development (HCD)', aliases: ['HCD'], url: 'https://www.hcd.ca.gov/', group: 'gov' },
  { name: 'Consumer Financial Protection Bureau (CFPB)', aliases: ['CFPB', 'Loan Estimate'], url: 'https://www.consumerfinance.gov/owning-a-home/', group: 'gov' },
  { name: 'NMLS Consumer Access (check a lender\'s license)', aliases: ['NMLS'], url: 'https://www.nmlsconsumeraccess.org/', group: 'gov' },
  { name: 'California DFPI', aliases: ['DFPI'], url: 'https://dfpi.ca.gov/', group: 'gov' },
  { name: 'California DRE', aliases: ['DRE'], url: 'https://www.dre.ca.gov/', group: 'gov' },
  { name: 'IRS', aliases: ['IRS', 'EITC', 'Form 8888'], url: 'https://www.irs.gov/', group: 'gov' },
  { name: 'Federal Student Aid (loan forgiveness)', aliases: ['Teacher Loan Forgiveness', 'PSLF', 'studentaid.gov'], url: 'https://studentaid.gov/manage-loans/forgiveness-cancellation', group: 'gov' },
  { name: 'Free credit reports (AnnualCreditReport.com)', aliases: ['annualcreditreport.com', 'credit report'], url: 'https://www.annualcreditreport.com/', group: 'gov' },
  { name: 'Legislative Analyst\'s Office (ballot measures)', aliases: ['LAO', 'Prop 1', 'Prop 37'], url: 'https://lao.ca.gov/', group: 'gov' },
  { name: 'Office of the Governor (bill signings)', aliases: ['SB 1116', 'AB 1751', 'AB 2038'], url: 'https://www.gov.ca.gov/', group: 'gov' },

  // Data sources
  { name: 'Freddie Mac Primary Mortgage Market Survey (PMMS)', aliases: ['Freddie Mac', 'PMMS'], url: 'https://www.freddiemac.com/pmms', group: 'data' },
  { name: 'HCD 2026 State Income Limits', aliases: ['income limits'], url: 'https://www.hcd.ca.gov/grants-and-funding/income-limits', group: 'data' },
  { name: 'HMDA Data Browser (FFIEC / CFPB)', aliases: ['HMDA'], url: 'https://ffiec.cfpb.gov/data-browser/', group: 'data' },
  { name: 'California Energy Commission: 2025 Energy Code', aliases: ['Energy Code'], url: 'https://www.energy.ca.gov/programs-and-topics/programs/building-energy-efficiency-standards/2025-building-energy-efficiency', group: 'data' },
  { name: 'County of Orange Housing Element', aliases: ['Housing Element'], url: 'https://ocds.ocpublicworks.com/service-areas/oc-development-services/planning-development/codes-and-regulations/general-plan', group: 'data' },

  // Services the site connects to
  { name: 'Open-Meteo (live weather, free, no key)', aliases: ['Open-Meteo'], url: 'https://open-meteo.com/', group: 'runtime' },
  { name: 'Google Fonts (Baloo 2, Nunito, Noto)', aliases: ['Google Fonts'], url: 'https://fonts.google.com/', group: 'runtime' },
  { name: 'Realtor.com (listing links)', aliases: ['Realtor.com'], url: 'https://www.realtor.com/', group: 'runtime' },
  { name: 'Google Search (Doorie\'s off-topic answer)', aliases: ['Google'], url: 'https://www.google.com/', group: 'runtime' },
  { name: 'GitHub (code and daily-check pull requests)', aliases: ['GitHub'], url: 'https://github.com/thejaredchapman/front-door', group: 'runtime' },

  // Tools & technologies used to build it
  { name: 'Claude Code (Anthropic\'s AI coding agent)', aliases: ['Claude Code'], url: 'https://www.anthropic.com/claude-code', group: 'tech' },
  { name: 'Anthropic API / Claude Haiku (daily check, translation)', aliases: ['Claude Haiku', 'Anthropic API'], url: 'https://docs.anthropic.com/', group: 'tech' },
  { name: 'React 19', aliases: ['React'], url: 'https://react.dev/', group: 'tech' },
  { name: 'Vite 7', aliases: ['Vite'], url: 'https://vite.dev/', group: 'tech' },
  { name: 'Tailwind CSS 4', aliases: ['Tailwind'], url: 'https://tailwindcss.com/', group: 'tech' },
  { name: 'Zustand 5', aliases: ['Zustand'], url: 'https://zustand.docs.pmnd.rs/', group: 'tech' },
  { name: 'Node.js', aliases: ['Node.js'], url: 'https://nodejs.org/', group: 'tech' },
  { name: 'GitHub Actions', aliases: ['GitHub Actions'], url: 'https://github.com/features/actions', group: 'tech' },
  { name: 'Poppler pdftotext', aliases: ['pdftotext'], url: 'https://poppler.freedesktop.org/', group: 'tech' },
  { name: 'Chrome DevTools Protocol (headless screenshots)', aliases: ['Headless Chrome'], url: 'https://chromedevtools.github.io/devtools-protocol/', group: 'tech' },
  { name: 'ESLint', aliases: ['ESLint'], url: 'https://eslint.org/', group: 'tech' },
];

/** Services whose name or alias appears in a piece of text (whole-word, case-insensitive). */
export function servicesMentioned(text, limit = 4) {
  if (!text) return [];
  const found = [];
  for (const s of SERVICES) {
    if (s.group === 'tech' || s.group === 'runtime') continue;
    const names = [s.name, ...(s.aliases || [])];
    const hit = names.some((n) => new RegExp(`(^|[^A-Za-z])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`, n.length <= 4 ? '' : 'i').test(text));
    if (hit && !found.some((f) => f.url === s.url)) found.push(s);
    if (found.length >= limit) break;
  }
  return found;
}
