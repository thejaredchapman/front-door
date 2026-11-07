import { useT } from '../../i18n';
import Explain from '../funding/Explain';

/** Consistent page opening: kicker, one title, one short summary (with a simple-words version). */
export default function PageHeader({ kicker, title, plain, eli5, children }) {
  const t = useT();
  return (
    <header className="page-head rise">
      {kicker && <p className="kicker mb-3">{t(kicker)}</p>}
      <h1 className="display page-title">{t(title)}</h1>
      {plain && <Explain plain={plain} eli5={eli5} className="lede mt-4" />}
      {children}
    </header>
  );
}
