import { useEffect, useMemo, useState } from 'react';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import Explain from '../funding/Explain';
import { STAGES, STAGE_COLORS, buildTasks, tasksIcs, isoDay, fromIso } from '../../data/planTasks';

const stageStyle = (i) => ({ '--stage': STAGE_COLORS[i].color, '--stage-soft': STAGE_COLORS[i].soft });

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6].map((i) => new Date(2026, 10, 1 + i)); // Nov 1, 2026 is a Sunday

function MonthGrid({ month, tasks, done, onMonth }) {
  const t = useT();
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(first.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const byDay = {};
  tasks.forEach((tk) => {
    if (tk.due.getFullYear() === month.getFullYear() && tk.due.getMonth() === month.getMonth()) (byDay[tk.due.getDate()] ||= []).push(tk);
  });
  const today = new Date();
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <button type="button" className="btn-ghost !py-1" onClick={() => onMonth(-1)} aria-label={t('Previous month')}><span className="flip-rtl">←</span></button>
        <p className="display text-xl font-bold">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
        <button type="button" className="btn-ghost !py-1" onClick={() => onMonth(1)} aria-label={t('Next month')}><span className="flip-rtl">→</span></button>
      </div>
      <div className="cal-grid" role="grid">
        {WEEKDAYS.map((d) => <div key={d.getDay()} className="cal-head" role="columnheader">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>)}
        {cells.map((day, i) => {
          const isToday = day && today.getFullYear() === month.getFullYear() && today.getMonth() === month.getMonth() && today.getDate() === day;
          return (
            <div key={i} className={`cal-cell ${day ? '' : 'is-empty'} ${isToday ? 'is-today' : ''}`} role="gridcell">
              {day && <span className="cal-day num">{day}</span>}
              {(byDay[day] || []).map((tk) => (
                <a key={tk.id} href={`#task-${tk.id}`} className={`cal-task ${done[tk.id] ? 'is-done' : ''}`} style={stageStyle(tk.stage)} title={`${t(STAGES[tk.stage])}: ${t(tk.title)}`}>{t(tk.title)}</a>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PlanCalendar({ answers, results }) {
  const t = useT();
  const startedAt = useStore((s) => s.planStartedAt);
  const setStartedAt = useStore((s) => s.setPlanStartedAt);
  const done = useStore((s) => s.taskDone);
  const toggle = useStore((s) => s.toggleTask);
  const dates = useStore((s) => s.taskDates);
  const setDate = useStore((s) => s.setTaskDate);
  const [view, setView] = useState('list');

  useEffect(() => { if (!startedAt) setStartedAt(isoDay(new Date())); }, [startedAt, setStartedAt]);
  const start = useMemo(() => (startedAt ? fromIso(startedAt) : new Date()), [startedAt]);
  const target = useMemo(() => new Date(start.getTime() + Math.round(answers.targetMonths * 30.4375) * 86400000), [start, answers.targetMonths]);
  const tasks = useMemo(() => buildTasks(results, { start, target, overrides: dates }), [results, start, target, dates]);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const finished = tasks.filter((tk) => done[tk.id]).length;

  const download = () => {
    const blob = new Blob([tasksIcs(tasks, done)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'front-door-plan.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="cal-title">
      <p className="kicker mb-2">{t('Your checklist')}</p>
      <h3 id="cal-title" className="display text-3xl font-extrabold mb-2">{t('Your plan, step by step')}</h3>
      <Explain
        className="text-sm max-w-3xl mb-4"
        plain="Every task has a suggested date, counted back from the month you want to buy. Check things off as you go, or change any date. Once you have a purchase contract, its deadlines replace these."
        eli5="Here's your to-do list with dates. Tick each one when it's done."
      />
      <div className="flex flex-wrap items-center gap-3 mb-4 print:hidden">
        <div className="flex border border-line rounded-2xl overflow-hidden" role="group" aria-label={t('View')}>
          {[['list', 'Checklist'], ['month', 'Month view']].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)} className={`px-4 py-2 text-sm font-semibold cursor-pointer ${view === id ? 'bg-ink text-paper' : 'bg-card'}`}>{t(label)}</button>
          ))}
        </div>
        <button type="button" onClick={download} className="btn-primary">📅 {t('Add unfinished tasks to my calendar (.ics)')}</button>
        <span className="text-sm text-muted">{t('{done} of {total} done · target {date}', { done: finished, total: tasks.length, date: target.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) })}</span>
      </div>
      <div className="progress mb-3" aria-hidden="true"><span style={{ width: `${(finished / tasks.length) * 100}%` }} /></div>
      <ul className="stage-legend mb-5" aria-label={t('Stages')}>
        {STAGES.map((stage, si) => {
          const list = tasks.filter((tk) => tk.stage === si);
          const n = list.filter((tk) => done[tk.id]).length;
          return (
            <li key={stage} style={stageStyle(si)}>
              <a href={`#stage-${si}`}><span aria-hidden="true">{STAGE_COLORS[si].icon}</span> <span className="font-bold">{si + 1}. {t(stage)}</span> <span className="num text-xs">{n}/{list.length}</span></a>
            </li>
          );
        })}
      </ul>

      {view === 'month' && (
        <div className="mb-6">
          <MonthGrid month={month} tasks={tasks} done={done} onMonth={(n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))} />
        </div>
      )}

      <div className="space-y-6">
        {STAGES.map((stage, si) => (
          <div key={stage} id={`stage-${si}`} className="stage-block" style={stageStyle(si)}>
            <h4 className="stage-head display text-xl font-bold mb-2"><span className="stage-num num">{si + 1}</span> <span aria-hidden="true">{STAGE_COLORS[si].icon}</span> {t(stage)}</h4>
            <ul className="space-y-2">
              {tasks.filter((tk) => tk.stage === si).map((tk) => (
                <li key={tk.id} id={`task-${tk.id}`} className={`task-row ${done[tk.id] ? 'is-done' : ''}`}>
                  <input type="checkbox" className="w-5 h-5 mt-1 accent-[var(--stage)]" checked={Boolean(done[tk.id])} onChange={() => toggle(tk.id)} aria-label={t('Done: {task}', { task: t(tk.title) })} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{t(tk.title)}</p>
                    <p className="text-sm text-muted">{t(tk.detail)} {tk.link && <a href={tk.link} target="_blank" rel="noreferrer" className="btn-link">{t('Link')} →</a>}</p>
                  </div>
                  <div className="shrink-0">
                    <label className="sr-only" htmlFor={`due-${tk.id}`}>{t('Due date')}</label>
                    <input id={`due-${tk.id}`} type="date" className="field !py-1 !w-auto text-sm" value={isoDay(tk.due)} onChange={(e) => setDate(tk.id, e.target.value)} />
                    {dates[tk.id] && <button type="button" className="btn-link text-xs block" onClick={() => setDate(tk.id, null)}>{t('Reset date')}</button>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
