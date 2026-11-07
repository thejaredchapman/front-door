import { useStore } from '../store/useStore';
import { useT } from '../i18n';

/** Opt-in switch: keep check-in answers, tasks, and quotes in this browser after the page closes. */
export default function SaveToggle({ compact = false }) {
  const t = useT();
  const on = useStore((s) => s.saveOnDevice);
  const setOn = useStore((s) => s.setSaveOnDevice);
  return (
    <div className={`save-toggle ${on ? 'is-on' : ''}`}>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="w-5 h-5 mt-0.5 accent-[var(--accent)]" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span>
          <span className="font-semibold">{t('Save my answers on this device')}</span>
          {!compact && (
            <span className="block text-sm text-muted">
              {on
                ? t('Saved only in this browser. Nothing is sent to us or to lenders. Turn this off to erase them when you close the page.')
                : t('Off: your answers disappear when you close the page. Nothing is ever sent to us or to lenders.')}
            </span>
          )}
        </span>
      </label>
    </div>
  );
}
