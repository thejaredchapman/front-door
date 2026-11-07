import { useT } from '../i18n';
import RATE_INFO from '../data/rate.json';

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t-2 border-ink mt-8 bg-card">
      <div className="mx-auto px-5 max-w-6xl py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <p className="display text-xl font-bold">Front Door</p>
          <p className="text-muted mt-1">{t('Free homebuyer help for working families. Built for the Habitat for Humanity of Orange County hackathon, using Habitat\'s color palette with respect. Not an official Habitat for Humanity website.')}</p>
        </div>
        <nav aria-label={t('Footer')} className="grid grid-cols-2 gap-1">
          <a href="#/plan" className="hover:underline">{t('Find my plan')}</a>
          <a href="#/learn" className="hover:underline">{t('Learn')}</a>
          <a href="#/calculator" className="hover:underline">{t('Calculator')}</a>
          <a href="#/give" className="hover:underline">{t('Give')}</a>
          <a href="#/learn/sources" className="hover:underline">{t('Sources')}</a>
          <a href="#/learn/about" className="hover:underline">{t('How this was built')}</a>
          <a href="presentation/handout.html" target="_blank" rel="noreferrer" className="hover:underline">{t('Handout')} ↗</a>
          <a href="presentation/slides.html" target="_blank" rel="noreferrer" className="hover:underline">{t('Slides')} ↗</a>
          <a href="https://github.com/thejaredchapman/front-door" target="_blank" rel="noreferrer" className="hover:underline">GitHub ↗</a>
        </nav>
        <p className="note text-xs">
          {t('Estimates for education only, not a loan offer or financial advice. Rates (Freddie Mac 30-yr: {rate}%, {date}), limits, and programs change. Confirm everything with a HUD-approved counselor and a licensed lender.', { rate: RATE_INFO.value, date: RATE_INFO.asOf })}
        </p>
      </div>
    </footer>
  );
}
