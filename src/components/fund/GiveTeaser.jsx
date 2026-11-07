import { useState } from 'react';
import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import { donorAfterTaxCost } from '../../data/taxBenefits';
import { formatCurrency } from '../../utils/formatters';

// Same math and defaults as the fund simulator on #/give
const RESIDENTS = 2000;
const AVG_GIFT = 50; // ≈ $4 a month
const MATCH = 0.5;
const COMPANIES = 20;
const AVG_CORP = 25000;
const ADMIN = 0.05;
const GRANT = 25000;
const raised = RESIDENTS * AVG_GIFT * (1 + MATCH) + COMPANIES * AVG_CORP;
const families = Math.floor((raised * (1 - ADMIN)) / GRANT);

/** Home-page "Give" section: the community down payment fund, a gift-cost slider, and ways to help. */
export default function GiveTeaser() {
  const t = useT();
  const [gift, setGift] = useState(100);
  const [joint, setJoint] = useState(false);
  const { savings } = donorAfterTaxCost({ gift, type: 'person', itemizes: false, filing: joint ? 'joint' : 'single', federalRate: 12, stateRate: 4 });

  return (
    <section className="home-give" aria-labelledby="give-title">
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 items-start">
        <div>
          <p className="kicker mb-2">💛 {t('Give')}</p>
          <h2 id="give-title" className="display text-3xl sm:text-4xl font-extrabold leading-tight">{t('Help a neighbor get the keys')}</h2>
          <Explain
            className="mt-3 max-w-2xl"
            plain="The hardest part for working families is the down payment. A community fund hosted by a nonprofit pools gifts from residents, companies, and employers, gives donors a tax deduction, and turns it into down payment grants for local buyers."
            eli5="Neighbors and companies put money in one big jar, and the jar helps families buy homes."
          />
          <div className="give-stat mt-5">
            <span className="display give-stat-v">{t('{n} families a year', { n: families })}</span>
            <span className="text-sm">{t('If {r} neighbors gave about $4 a month, employers matched half, and {c} companies gave {corp} each, the fund could give {grant} down payment grants to about {n} families every year.', { r: RESIDENTS.toLocaleString(), c: COMPANIES, corp: formatCurrency(AVG_CORP), grant: formatCurrency(GRANT), n: families })}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <a href="#/give/donate" className="btn-primary">{t('Donate')} →</a>
            <a href="#/give" className="btn-ghost">{t('How the fund works')}</a>
            <a href="#/give/taxes" className="btn-ghost">{t('Tax benefits')}</a>
          </div>
        </div>

        <div className="card">
          <p className="font-bold">{t('What your gift really costs')}</p>
          <label htmlFor="give-gift" className="field-label mt-3 block">{t('Your gift')}: <span className="num">{formatCurrency(gift)}</span></label>
          <input id="give-gift" type="range" min={10} max={2000} step={10} value={gift} onChange={(e) => setGift(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
          <div className="flex gap-2 mt-2" role="group" aria-label={t('How you file taxes')}>
            {[[false, 'Single'], [true, 'Married filing jointly']].map(([v, l]) => (
              <button key={l} type="button" aria-pressed={joint === v} onClick={() => setJoint(v)} className={`chip !min-h-0 !py-1 text-sm ${joint === v ? 'chip-on' : ''}`}>{t(l)}</button>
            ))}
          </div>
          <dl className="give-math mt-4">
            <div><dt>{t('A family gets')}</dt><dd className="num">{formatCurrency(gift)}</dd></div>
            <div><dt>{t('Your tax savings')}</dt><dd className="num">−{formatCurrency(savings)}</dd></div>
            <div className="is-total"><dt>{t('Your real cost')}</dt><dd className="num">{formatCurrency(gift - savings)}</dd></div>
          </dl>
          <p className="text-xs text-muted mt-2">{t('Assumes the 12% federal bracket and the new 2026 deduction for people who don\'t itemize (up to $1,000 single or $2,000 joint). Itemizers and companies save more. Not tax advice.')}</p>
          <p className="text-xs mt-3"><strong>{t('Test mode')}:</strong> {t('online giving is being set up with a nonprofit host; no real money is collected yet.')}</p>
          <a href="#/learn/fund-front-door" className="btn-link inline-block mt-2">{t('Or help fund Front Door itself')} →</a>
        </div>
      </div>
    </section>
  );
}
