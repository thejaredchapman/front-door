import { useT } from '../../i18n';
import Explain from '../funding/Explain';

const ITEMS = [
  {
    title: 'Your benefits count as income',
    plain: 'SSDI, SSI, VA disability, and long-term disability payments can all count toward qualifying for a mortgage. Lenders want an award letter showing the income will continue (usually at least 3 years). Because most of these benefits aren\'t taxed, lenders can "gross them up", often counting them as about 25% more.',
    eli5: 'Disability checks count like a paycheck for a home loan. Because they aren\'t taxed, the bank can count them as a bit bigger.',
    url: 'https://www.consumerfinance.gov/owning-a-home/',
    link: 'CFPB homebuying guide',
  },
  {
    title: 'Save without losing benefits: CalABLE',
    plain: 'A CalABLE account lets people with disabilities save and invest without losing SSI or Medi-Cal (up to set limits). Housing is a qualified expense, but SSI has timing rules for housing withdrawals. Ask CalABLE or a benefits counselor before you buy.',
    eli5: 'A special savings jar that doesn\'t take away your benefits. Ask a helper how to use it for a home.',
    url: 'https://www.calable.ca.gov/',
    link: 'CalABLE',
  },
  {
    title: 'Make a home accessible: FHA 203(k)',
    plain: 'An FHA 203(k) loan rolls the cost of renovations, like ramps, wider doors, or an accessible bathroom, into one mortgage. It lets you buy a home that isn\'t accessible yet and fix it.',
    eli5: 'One loan that pays for the house and for making it easy to get around in.',
    url: 'https://www.hud.gov/program_offices/housing/sfh/203k',
    link: 'HUD 203(k)',
  },
  {
    title: 'Section 8 homeownership',
    plain: 'If your household has a Housing Choice Voucher, the homeownership option can help pay a mortgage. Families with a disability have special rules, including no minimum work requirement. Ask the OC Housing Authority (714-480-2973) or your local housing authority.',
    eli5: 'If you get help paying rent, that help might switch to help you pay for a house.',
    url: 'https://housingauthority.oc.gov/special-housing-programs/homeownership-program',
    link: 'OC Housing Authority',
  },
  {
    title: 'For veterans with a disability',
    plain: 'The VA funding fee is waived for veterans receiving compensation for a service-connected disability. Specially Adapted Housing (SAH) and Special Housing Adaptation (SHA) grants help build or change a home for accessibility. California also offers a property tax exemption for qualifying disabled veterans.',
    eli5: 'If you served and got hurt, there is extra help to buy and fix a home, and you may pay less tax.',
    url: 'https://www.va.gov/housing-assistance/disability-housing-grants/',
    link: 'VA housing grants',
  },
  {
    title: 'Repairs and your rights',
    plain: 'Habitat for Humanity OC\'s Home Preservation Program makes accessibility repairs for low-income owners. Fair housing law requires reasonable accommodations; Disability Rights California can help if you face discrimination.',
    eli5: 'Helpers can fix your home so it\'s safe to get around, and the law protects you from unfair treatment.',
    url: 'https://www.disabilityrightsca.org/',
    link: 'Disability Rights California',
  },
];

export default function DisabilityPath() {
  const t = useT();
  return (
    <ol className="ledger-list">
      {ITEMS.map((it, i) => (
        <li key={it.title}>
          <span className="num ledger-n">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h2 className="font-semibold text-xl">{t(it.title)}</h2>
            <Explain plain={it.plain} eli5={it.eli5} className="mt-1" />
            <a href={it.url} target="_blank" rel="noreferrer" className="btn-link inline-block mt-2">{t(it.link)} →</a>
          </div>
        </li>
      ))}
    </ol>
  );
}
