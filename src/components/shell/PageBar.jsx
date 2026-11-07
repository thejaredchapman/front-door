import { useT } from '../../i18n';
import { goBack } from '../../router';

/** Back + Home buttons and a breadcrumb, shown on every page except Home. */
export default function PageBar({ crumbs = [] }) {
  const t = useT();
  return (
    <div className="pagebar print:hidden">
      <div className="pagebar-inner">
        <button type="button" onClick={goBack} className="pagebar-btn">
          <span aria-hidden="true" className="flip-rtl">←</span> {t('Back')}
        </button>
        <a href="#/" className="pagebar-btn">
          <span aria-hidden="true">⌂</span> {t('Home')}
        </a>
        {crumbs.length > 0 && (
          <nav aria-label={t('Breadcrumb')} className="crumbs">
            <ol>
              {crumbs.map((c, i) => (
                <li key={c.label}>
                  {c.href && i < crumbs.length - 1 ? <a href={c.href}>{t(c.label)}</a> : <span aria-current="page">{t(c.label)}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
