import { useRoute } from './router';
import { useLanguageEffects, useT, useTranslationPending } from './i18n';
import { useStore } from './store/useStore';
import Masthead from './components/shell/Masthead';
import PageBar from './components/shell/PageBar';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CalculatorPage from './components/pages/CalculatorPage';
import Quiz from './components/plan/Quiz';
import ResultsPages from './components/results/ResultsPages';
import { LearnIndex, LearnTopic } from './components/learn/LearnPages';
import { TOPICS } from './components/learn/topics';
import CommunityFund from './components/fund/CommunityFund';
import DonatePage from './components/fund/DonatePage';
import StartHere from './components/pages/StartHere';
import DoorieChat from './components/DoorieChat';
import NewsPage from './components/pages/NewsPage';

const RESULT_LABELS = { plans: 'My plans', lenders: 'Where to borrow', compare: 'Compare loans', timeline: 'Timeline & emails', report: 'Report & packet' };

/** Pick the page and its breadcrumb trail for a path like "/learn/rates". */
function resolve(segments) {
  const [section, sub] = segments;
  const home = { label: 'Home', href: '#/' };
  switch (section) {
    case undefined:
      return { page: <HomePage />, crumbs: null };
    case 'start':
      return { page: <StartHere />, crumbs: [home, { label: 'Start here' }] };
    case 'plan':
      return { page: <Quiz step={Number(sub) || 1} />, crumbs: [home, { label: 'Find my plan' }] };
    case 'results':
      return { page: <ResultsPages tab={sub} />, crumbs: [home, { label: 'Find my plan', href: '#/plan' }, { label: RESULT_LABELS[sub] || 'My plans' }] };
    case 'learn': {
      const topic = TOPICS.find((x) => x.id === sub);
      return sub && topic
        ? { page: <LearnTopic id={sub} />, crumbs: [home, { label: 'Learn', href: '#/learn' }, { label: topic.title }] }
        : { page: <LearnIndex />, crumbs: [home, { label: 'Learn' }] };
    }
    case 'news':
      return { page: <NewsPage />, crumbs: [home, { label: 'News' }] };
    case 'calculator':
      return { page: <CalculatorPage />, crumbs: [home, { label: 'Calculator' }] };
    case 'give':
      if (sub === 'donate') return { page: <DonatePage />, crumbs: [home, { label: 'Give', href: '#/give' }, { label: 'Donate' }] };
      if (sub === 'taxes') return { page: <CommunityFund part="taxes" />, crumbs: [home, { label: 'Give', href: '#/give' }, { label: 'Tax benefits' }] };
      return { page: <CommunityFund part="overview" />, crumbs: [home, { label: 'Give' }] };
    default:
      return { page: <HomePage />, crumbs: null };
  }
}

function TranslationNotice() {
  const t = useT();
  const pending = useTranslationPending();
  const setLang = useStore((s) => s.setLang);
  if (!pending) return null;
  return (
    <div className="translation-note print:hidden" role="status">
      {t('Menus are translated. Full page translations are being prepared; some text is still in English.')}{' '}
      <button type="button" className="btn-link" onClick={() => setLang('en')}>English</button>
    </div>
  );
}

export default function App() {
  useLanguageEffects();
  const { path, segments } = useRoute();
  const { page, crumbs } = resolve(segments);

  return (
    <div className="app">
      <Masthead path={path} />
      {crumbs && <PageBar crumbs={crumbs} />}
      <TranslationNotice />
      <main id="main" tabIndex={-1} key={path}>{page}</main>
      <Footer />
      <DoorieChat />
    </div>
  );
}
