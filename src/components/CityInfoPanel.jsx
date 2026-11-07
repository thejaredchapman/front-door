import { useT } from '../i18n';
import Explain from './funding/Explain';
import { PROGRAMS, STATUS_LABELS } from '../data/programs';
import { HABITAT_CITIES } from '../data/ocFacts';
import { OC_PROPERTY_TAX_ESTIMATE, OC_INSURANCE_ESTIMATE } from '../data/ocCities';
import { OC_INCOME_LIMITS_2026 } from '../data/incomeLimits';
import { formatCurrency } from '../utils/formatters';

/** Orange County city panel: local help, weather, and the cost assumptions behind the estimate. */
export default function CityInfoPanel({ city, liveWeather, isEnriching }) {
  const t = useT();
  if (!city) return null;

  const programs = city.programIds.map((id) => PROGRAMS.find((p) => p.id === id)).filter(Boolean);
  const map = PROGRAMS.find((p) => p.id === 'oc-map');
  const habitatHere = HABITAT_CITIES.includes(city.name);

  return (
    <section className="panel" aria-labelledby="city-title">
      <p className="kicker mb-1">{t('Your city')}</p>
      <h3 id="city-title" className="display text-3xl font-bold">{t(city.name)}</h3>
      {city.note && <p className="text-sm text-muted mt-1">{t(city.note)}</p>}

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <h4 className="field-label">{t('Local help for buyers')}</h4>
          <ul className="space-y-3">
            {programs.map((p) => (
              <li key={p.id} className="rounded-2xl border border-line p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">{t(p.name)}</span>
                  <span className={`badge ${p.status === 'verified' ? 'badge-good' : p.status === 'closed' ? 'badge-no' : 'badge-maybe'}`}>{t(STATUS_LABELS[p.status].label)}</span>
                </div>
                <p className="text-sm mt-1">{t(p.gives)}</p>
                <a href={p.url} target="_blank" rel="noreferrer" className="btn-link text-sm">{t('Official page')} →</a>
              </li>
            ))}
            <li className="rounded-2xl border border-line p-3">
              <span className="font-bold">{t('County Mortgage Assistance Program (MAP)')}</span>{' '}
              {city.mapEligible
                ? <span className="badge badge-good">{t('Covers this city')}</span>
                : <span className="badge badge-no">{t('Not available here')}</span>}
              <p className="text-sm mt-1">
                {city.mapEligible
                  ? t(map?.gives || 'Up to $120,000 (low income) or $80,000 (moderate income) as a deferred second loan.')
                  : t('The county loan only covers unincorporated areas and 14 smaller cities. Use your city\'s own program or statewide help instead.')}
              </p>
            </li>
            {habitatHere && (
              <li className="rounded-2xl border border-line p-3">
                <span className="font-bold">{t('Habitat for Humanity OC has built homes here')}</span>
                <p className="text-sm mt-1">{t('Watch for new projects and orientations at habitatoc.org.')}</p>
              </li>
            )}
            {programs.length === 0 && !city.mapEligible && (
              <li className="text-sm text-muted">{t('No city down payment loan found for this city. Statewide help (CalHFA MyHome, WISH grants, credit-union and bank programs) still applies.')}</li>
            )}
          </ul>
          <a href="#/plan" className="btn-primary mt-4">{t('See everything that fits you')} →</a>
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="field-label">{t('Weather now')}</h4>
            {isEnriching && <p className="text-xs text-muted animate-pulse">{t('updating…')}</p>}
            {liveWeather
              ? <p className="num text-lg font-bold">{liveWeather.currentTemp}°F · {t('wind')} {liveWeather.windSpeed} mph</p>
              : !isEnriching && <p className="text-sm text-muted">{t('Not available right now.')}</p>}
          </div>
          <div>
            <h4 className="field-label">{t('Costs used in your estimate')}</h4>
            <dl className="text-sm space-y-1">
              <div className="flex justify-between gap-3"><dt>{t('Property tax')}</dt><dd className="num font-semibold">~{OC_PROPERTY_TAX_ESTIMATE}%</dd></div>
              <div className="flex justify-between gap-3"><dt>{t('Home insurance')}</dt><dd className="num font-semibold">~{formatCurrency(OC_INSURANCE_ESTIMATE)}/{t('yr')}</dd></div>
              <div className="flex justify-between gap-3"><dt>{t('OC median income (4 people)')}</dt><dd className="num font-semibold">{formatCurrency(OC_INCOME_LIMITS_2026.median[3])}</dd></div>
            </dl>
            <Explain
              className="text-xs text-muted mt-2"
              plain="Estimates. California's base property tax is 1% of the price, plus local bonds; some newer neighborhoods (often in Irvine, Lake Forest, and south county) add Mello-Roos taxes that can be much higher. Ask for the exact tax bill and get real insurance quotes, especially near wildfire areas."
              eli5="These are guesses. Ask for the real tax bill and insurance price for the exact house."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
