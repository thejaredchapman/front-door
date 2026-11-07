import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import ProgramCard from './ProgramCard';
import { PROGRAMS } from '../../data/programs';

const JOB_GUIDES = [
  {
    id: 'firefighter',
    tab: 'Firefighters & EMS',
    headline: 'For firefighters, EMTs and paramedics',
    plain: 'California has no state-run "hero" grant for firefighters. Florida\'s Hometown Heroes and Texas\'s Homes for Texas Heroes do not apply here. What you can actually use: GSFA Platinum Select (an extra gift for public safety), Firefighters First Credit Union (3% down, no PMI), CalHFA MyHome, city loans, and the OC Mortgage Credit Certificate. Entry-level and seasonal firefighters often earn below 80% AMI, which opens up Garden Grove, Santa Ana, the county program, and Habitat.',
    eli5: 'You keep everyone safe, but there isn\'t one big "firefighter house present" in California. Instead, you collect several smaller helpers: a firefighter bank, a helper that gives public servants a little extra, and city helpers.',
    ids: ['gsfa-platinum', 'firefighters-first', 'calhfa-myhome', 'mcc', 'garden-grove', 'santa-ana', 'gnnd', 'homes-for-heroes'],
  },
  {
    id: 'police',
    tab: 'Police & public safety',
    headline: 'For police, sheriff\'s deputies, and corrections',
    plain: 'Same honest picture as firefighters: no California-only grant for officers. GSFA Platinum Select covers law enforcement, sheriff, and corrections staff. HUD Good Neighbor Next Door gives officers 50% off HUD homes, but none have been found in Orange County. Stack CalHFA MyHome with a city loan, and use VA or CalVet if you served.',
    eli5: 'You protect people, and a few helpers say thank you. The biggest wins come from stacking regular helpers together.',
    ids: ['gsfa-platinum', 'calhfa-myhome', 'mcc', 'va', 'garden-grove', 'santa-ana', 'gnnd', 'homes-for-heroes'],
  },
  {
    id: 'healthcare',
    tab: 'Nurses & healthcare',
    headline: 'For nurses, CNAs, techs, and hospital staff',
    plain: 'We found no Orange County hospital system with a public homebuyer benefit, but ask HR anyway, because benefits change. GSFA Platinum Select includes medical and health care workers. CNAs, medical assistants, and techs often fall in the low-income range, which makes HomeReady or Home Possible (3% down), city loans, and Habitat strong options. UCI Health staff can join the UC Irvine campus housing waitlist.',
    eli5: 'You take care of sick people. Some helpers give health workers a little extra. If your paycheck is on the smaller side, lots of other helpers can say yes too.',
    ids: ['gsfa-platinum', 'calhfa-myhome', 'homeready', 'home-possible', 'garden-grove', 'habitat-oc', 'uci-icha', 'homes-for-heroes'],
  },
  {
    id: 'teacher',
    tab: 'Teachers & school staff',
    headline: 'For teachers, aides, bus drivers, and school staff',
    plain: 'The best option right now is SchoolsFirst FCU. It offers a $7,500 grant for first-time buyers earning up to about $150K, plus a loan up to $1M with 3% down and no PMI. Classified staff such as aides, custodians, bus drivers, and food service count too. GSFA Platinum Select also covers K-12 and college staff. Teachers also have tools others don\'t: Teacher Loan Forgiveness (up to $17,500) and Public Service Loan Forgiveness can shrink student debt, and an income-driven repayment plan lowers the monthly payment lenders count against you. Lenders count your yearly contract salary even on a 10-month schedule. Some districts build employee housing under the California Teacher Housing Act; ask HR. CalHFA\'s old Extra Credit Teacher Program is not currently offered, and "Teacher Next Door" is a private company, not HUD.',
    eli5: 'If you work at a school, even if you are not a teacher, a school bank gives you a $7,500 present toward your home. And if you have school loans, some can be erased, which helps the bank say yes.',
    ids: ['schoolsfirst', 'gsfa-platinum', 'calhfa-myhome', 'mcc', 'uci-icha', 'gnnd', 'ectp'],
  },
  {
    id: 'public',
    tab: 'Other public workers',
    headline: 'For city, county, and state employees',
    plain: 'Parks crews, clerks, maintenance, transit, and social services staff are often below 80% AMI in Orange County. That makes you a strong fit for city and county deferred loans plus CalHFA. GSFA\'s Assist-to-Own is for employees of member counties (check whether yours is one). Local credit unions offer low- and zero-down loans.',
    eli5: 'You keep the city running. City helpers and state helpers are a great match for you.',
    ids: ['calhfa-myhome', 'oc-map', 'garden-grove', 'santa-ana', 'gsfa-platinum', 'ocscu', 'mcc', 'habitat-oc'],
  },
  {
    id: 'service',
    tab: 'Everyone else',
    headline: 'For service, retail, care, and trade workers',
    plain: 'Your strongest paths are Habitat for Humanity, below-market-rate homes, and big city loans (Garden Grove up to $110,000, Santa Ana up to $120,000) stacked on an FHA or HomeReady loan with CalHFA MyHome. Start with free counseling: it is required by almost everything, and it is the fastest way to find which doors are open right now.',
    eli5: 'You might need the most help, and the most helpers are made for you. Start with a free class, then knock on every door.',
    ids: ['neighborworks-oc', 'habitat-oc', 'inclusionary', 'garden-grove', 'santa-ana', 'calhfa-myhome', 'fha', 'fhlb-wish'],
  },
];

export default function OccupationSection() {
  const [active, setActive] = useState(JOB_GUIDES[0].id);
  const guide = JOB_GUIDES.find((g) => g.id === active);
  const programs = guide.ids.map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean)
    .map((p) => ({ ...p, forYourJob: p.occupations.includes(guide.id) }));

  return (
    <Section
      id="jobs"
      kicker="Step 2 · By job"
      title="Firefighters, nurses, teachers, and public workers"
      intro={
        <Explain
          plain="People who serve the public often earn too much for some programs and too little for Orange County prices. Here is an honest list for each job: what is real, what is not available here, and what to stack."
          eli5="Pick your job. We'll show you the helpers that fit people who do that job."
        />
      }
    >
      <div role="tablist" aria-label="Choose a job" className="flex flex-wrap gap-2 mb-5">
        {JOB_GUIDES.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === active}
            onClick={() => setActive(g.id)}
            className={`px-4 py-2 text-sm font-semibold border border-line rounded-2xl cursor-pointer ${g.id === active ? 'bg-ink text-paper' : 'bg-card hover:bg-paper'}`}
          >
            {g.tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="panel">
        <h3 className="display text-2xl font-semibold mb-3">{guide.headline}</h3>
        <Explain plain={guide.plain} eli5={guide.eli5} className="leading-relaxed max-w-3xl" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p) => <ProgramCard key={p.id} program={p} highlight={p.forYourJob} />)}
      </div>
    </Section>
  );
}
