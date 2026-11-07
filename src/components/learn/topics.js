import RealityCheck from '../funding/RealityCheck';
import RatesExplainer from '../funding/RatesExplainer';
import StorySection from '../funding/StorySection';
import GlossarySection from '../funding/GlossarySection';
import IncomeFit from '../funding/IncomeFit';
import OccupationSection from '../funding/OccupationSection';
import ProgramDirectory from '../funding/ProgramDirectory';
import HabitatSection from '../funding/HabitatSection';
import PrivateLending from '../funding/PrivateLending';
import NextSteps from '../funding/NextSteps';
import GapFunder from '../funding/GapFunder';
import WhatsChanging from '../funding/WhatsChanging';
import SourcesSection from '../funding/SourcesSection';
import BuildCostPanel from '../funding/BuildCostPanel';
import InterestSaver from './InterestSaver';
import DisabilityPath from './DisabilityPath';
import LenderFinder from './LenderFinder';
import FiveBuyers from './FiveBuyers';
import LoanTypes from './LoanTypes';
import LawsPage from './LawsPage';
import AffordabilityToolkit from './AffordabilityToolkit';

/**
 * Learn pages, in reading order. `ownHeader: false` means the component has no title of its own,
 * so the page adds one from `title` + `plain`/`eli5`.
 */
export const TOPIC_GROUPS = ['Understand', 'Find help', 'Go deeper'];

export const TOPICS = [
  { id: 'afford', group: 'Understand', title: 'Affordability toolkit', summary: 'Every way to make a home more affordable, in one place.', Component: AffordabilityToolkit, ownHeader: false,
    plain: 'A home is affordable when the payment fits your life. Here is every lever that lowers the price, the cash you need, the monthly payment, and the total cost.',
    eli5: 'Lots of little tricks make a home cost less. Here they all are.' },
  { id: 'why', group: 'Understand', title: 'Why homes cost so much here', summary: 'The gap between prices and pay, in numbers.', Component: RealityCheck },
  { id: 'five-buyers', group: 'Understand', title: 'Five buyers, one market', summary: 'Low to ultra-high income: it\'s not just you.', Component: FiveBuyers, ownHeader: false,
    plain: 'Why is it so expensive, and is it just me? Meet five Orange County households, from a home health aide to a startup executive, and see what each can afford.',
    eli5: 'Five families with very different paychecks try to buy a house. See how each one does.' },
  { id: 'rates', group: 'Understand', title: 'Rates, supply & finding a lower rate', summary: 'Why rates are high, and how to shop lenders.', Component: RatesExplainer },
  { id: 'interest', group: 'Understand', title: 'Pay less interest', summary: 'Extra payments, biweekly, shorter terms: see what you save.', Component: InterestSaver, ownHeader: false,
    plain: 'Small extra payments toward principal can save tens of thousands of dollars and years of payments. Try it below.',
    eli5: 'Paying a little extra makes your loan end sooner and cost less.' },
  { id: 'loan-types', group: 'Understand', title: 'Every kind of mortgage', summary: 'Jumbo, chattel, HELOC, home equity, reverse, DSCR, SBA, commercial.', Component: LoanTypes, ownHeader: false,
    plain: 'Beyond FHA and conventional loans: what each real-estate loan is for, who it fits, and which ones are not for buying a family home.',
    eli5: 'There are many kinds of house loans. Here is what each one is for.' },
  { id: 'story', group: 'Understand', title: 'A story: Ana and Luis', summary: 'Follow one family from renting to keys.', Component: StorySection },
  { id: 'words', group: 'Understand', title: 'Words lenders use', summary: 'AMI, DTI, PMI and more, in plain words.', Component: GlossarySection },

  { id: 'fit', group: 'Find help', title: 'Where do I fit?', summary: 'Your income group and matching programs.', Component: IncomeFit },
  { id: 'jobs', group: 'Find help', title: 'Help by job', summary: 'Teachers, nurses, firefighters, police, public workers.', Component: OccupationSection },
  { id: 'programs', group: 'Find help', title: 'All programs', summary: 'Every loan and helper, with status labels.', Component: ProgramDirectory },
  { id: 'habitat', group: 'Find help', title: 'Habitat for Humanity', summary: 'Build, buy, and how the silent second protects you.', Component: HabitatSection },
  { id: 'private', group: 'Find help', title: 'Private lending', summary: 'CDFIs, ITIN, self-employed, family, and red flags.', Component: PrivateLending },
  { id: 'disability', group: 'Find help', title: 'Buyers with a disability', summary: 'Benefits as income, CalABLE, accessible homes, veterans.', Component: DisabilityPath, ownHeader: false,
    plain: 'Disability benefits can help you qualify, and there are programs to save and to make a home accessible.',
    eli5: 'If someone in your home has a disability, there are extra helpers for you.' },
  { id: 'lenders', group: 'Find help', title: 'Where to get the loan', summary: 'The cheapest lenders in OC, and which help each one accepts.', Component: LenderFinder, ownHeader: false,
    plain: 'The cheapest loan is the one that unlocks the most down payment help at the lowest total cost. Here is what Orange County buyers actually paid, and where to start.',
    eli5: 'Find the bank that charges the least and works with your helpers.' },
  { id: 'steps', group: 'Find help', title: 'Your checklist', summary: 'Seven steps, in order.', Component: NextSteps },

  { id: 'gap', group: 'Go deeper', title: 'Fund the gap', summary: 'For organizations: balance a home\'s cost to $0.', Component: GapFunder },
  { id: 'new', group: 'Go deeper', title: 'What\'s new in 2026', summary: 'Prop 1, Prop 37, and the energy code.', Component: WhatsChanging },
  { id: 'laws', group: 'Go deeper', title: 'New California laws', summary: 'What helps or restricts buyers, 2024–2027.', Component: LawsPage, ownHeader: false,
    plain: 'California passes housing laws every year. Here are the ones that help people buy or keep a home, and the ones that add cost or limits, in plain words.',
    eli5: 'New rules can make buying a home easier or harder. Here they are, explained simply.' },
  { id: 'sources', group: 'Go deeper', title: 'Sources', summary: 'Where every fact comes from.', Component: SourcesSection },
  { id: 'about', group: 'Go deeper', title: 'How this was built', summary: 'Tools used and the cost of every call.', Component: BuildCostPanel },
];
