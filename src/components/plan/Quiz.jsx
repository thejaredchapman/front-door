import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';
import { navigate } from '../../router';
import { OCCUPATIONS } from '../../data/programs';
import {
  CREDIT_BANDS, BANKRUPTCY_OPTIONS, FORECLOSURE_OPTIONS, CITY_OPTIONS, GROUPS, PAY_TYPES, ID_TYPES,
  DEFAULT_ANSWERS, QUIZ_STEPS, YES_NO, YES_NO_UNSURE_BOOL,
} from '../../data/plans';
import { TARGET_MONTHS, DOWN_OPTIONS, PROPERTY_TYPES, MILITARY_ROLES, VA_USE, YES_NO_UNSURE } from '../../data/goalRules';
import SaveToggle from '../SaveToggle';
import { matchJob } from '../../data/employers';
import { Q, Choices, Money, Check, OptionalMoney, SmallNumber } from './quizParts';
import CountySelect from '../CountySelect';
import PageHeader from '../shell/PageHeader';

export default function Quiz({ step = 1 }) {
  const t = useT();
  const stored = useStore((s) => s.planAnswers);
  const setPlanAnswer = useStore((s) => s.setPlanAnswer);
  const touched = useStore((s) => s.planTouched);
  const markTouched = useStore((s) => s.markPlanTouched);
  const submitted = useStore((s) => s.planSubmitted);
  const setSubmitted = useStore((s) => s.setPlanSubmitted);
  const resetPlanAnswers = useStore((s) => s.resetPlanAnswers);
  const a = useMemo(() => ({ ...DEFAULT_ANSWERS, ...stored }), [stored]);
  const set = (k) => (v) => setPlanAnswer(k, v);

  const s = Math.min(Math.max(step, 1), QUIZ_STEPS.length);
  const sid = QUIZ_STEPS[s - 1].id;
  const allQuestions = QUIZ_STEPS.flatMap((st) => st.questions);
  const answered = allQuestions.map((keys) => keys.some((k) => touched.includes(k)));
  const answeredCount = answered.filter(Boolean).length;
  const skipped = answered.map((x, i) => (x ? null : i + 1)).filter(Boolean);
  const firstN = QUIZ_STEPS.slice(0, s - 1).reduce((n, st) => n + st.questions.length, 0) + 1;
  const job = matchJob(a.jobTitle, a.employer);
  const suggested = job.guessedCategory && job.guessedCategory !== a.occupation ? OCCUPATIONS.find((o) => o.id === job.guessedCategory) : null;
  const toggleGroup = (id) => set('groups')(a.groups.includes(id) ? a.groups.filter((g) => g !== id) : [...a.groups, id]);

  const finish = () => {
    setSubmitted(true);
    navigate('/results/plans');
  };

  let n = firstN;
  const next = () => n++;

  return (
    <div className="page-narrow">
      <PageHeader
        kicker={t('Your check-in · Step {s} of {total}', { s, total: QUIZ_STEPS.length })}
        title={t(QUIZ_STEPS[s - 1].title)}
        plain="This quick check-in helps you see where you are today. Answer what you can; there are no wrong answers, and nothing leaves your device."
        eli5="Answer a few easy questions so we can help. Your answers stay secret on your phone or computer."
      />

      {/* Step tracker */}
      <ol className="stepper mb-8" aria-label={t('Steps')}>
        {QUIZ_STEPS.map((st, i) => (
          <li key={st.title}>
            <a href={`#/plan/${i + 1}`} aria-current={i + 1 === s ? 'step' : undefined} className={`stepper-item ${i + 1 === s ? 'is-current' : i + 1 < s ? 'is-done' : ''}`}>
              <span className="num">{i + 1}</span>
              <span className="stepper-label">{t(st.title)}</span>
            </a>
          </li>
        ))}
      </ol>

      <div className="space-y-5">
        {sid === 'money' && (
          <>
            <Q n={next()} title="How many people live in your home?">
              <Choices name="size" value={a.householdSize} onChange={set('householdSize')} options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => ({ id: x, label: x === 9 ? '9+' : String(x) }))} />
            </Q>
            <Q n={next()} title="What does your household earn in a year, before taxes?" help="Add up everyone's pay. Use your W-2s or pay stubs. 'Before taxes' is called gross income.">
              <Money id="q-income" value={a.income} onChange={set('income')} step={1000} />
            </Q>
            <Q n={next()} title="How much do you pay each month on debts?" help="Car loan, credit card minimums, student loans, child support. Not rent, food, or phone.">
              <Money id="q-debts" value={a.monthlyDebts} onChange={set('monthlyDebts')} step={50} />
            </Q>
            <Q n={next()} title="How much have you saved for a home?" help="Many plans need 1–3% of the price from you, plus money for closing costs.">
              <Money id="q-savings" value={a.savings} onChange={set('savings')} step={500} />
            </Q>
          </>
        )}

        {sid === 'goal' && (
          <>
            <Q n={next()} title="How much can you put away each month for a home?" help="Even a small amount counts. We use it to show when you could be ready.">
              <Money id="q-monthly" value={a.monthlySaving} onChange={set('monthlySaving')} step={25} />
            </Q>
            <Q n={next()} title="How much do you want to keep in the bank after you buy?" help="A safety cushion for surprises, like a car repair or a broken water heater. Many counselors suggest 2–3 months of house payments.">
              <Money id="q-reserve" value={a.reserve} onChange={set('reserve')} step={500} />
            </Q>
            <Q n={next()} title="When would you like to buy?">
              <Choices name="months" value={a.targetMonths} onChange={set('targetMonths')} options={TARGET_MONTHS.map((m) => ({ id: m, label: t('{n} months', { n: m }) }))} />
            </Q>
            <Q n={next()} title="What monthly home cost feels comfortable to you? (optional)" help="Leave it blank if you're not sure. If you type a number, we never plan above it. Zero means you don't want any housing cost right now.">
              <OptionalMoney id="q-comfort" value={a.comfort} onChange={set('comfort')} />
            </Q>
            <Q n={next()} title="What kind of home, and how much down?" help="Many first-time buyers put 3–5% down. Programs can help with this part.">
              <Choices name="ptype" value={a.propertyType} onChange={set('propertyType')} options={PROPERTY_TYPES} />
              <p className="field-label mt-4">{t('Planned down payment')}</p>
              <Choices name="down" value={a.downPct} onChange={set('downPct')} options={DOWN_OPTIONS.map((d) => ({ id: d, label: `${d}%` }))} />
              <details className="mt-4">
                <summary className="btn-link cursor-pointer">{t('Change the cost assumptions (insurance, HOA, interest rate)')}</summary>
                <div className="grid sm:grid-cols-3 gap-4 mt-3">
                  <SmallNumber id="q-ins" label="Home insurance per month" value={a.insurance} onChange={set('insurance')} step={10} suffix="$" />
                  <SmallNumber id="q-hoa" label="HOA dues per month" value={a.hoa} onChange={set('hoa')} step={10} suffix="$" />
                  <SmallNumber id="q-rate" label="Interest rate" value={a.rate} onChange={set('rate')} max={25} step={0.125} suffix="%" />
                </div>
                <p className="text-sm text-muted mt-2">{t('The rate starts at this week\'s national average. Use a real quote when you have one.')}</p>
              </details>
            </Q>
          </>
        )}

        {sid === 'credit' && (
          <>
            <Q n={next()} title="What is your credit score?" help="Not sure? Get free reports at annualcreditreport.com. Many bank apps show your score free. Checking it yourself does NOT lower it.">
              <Choices name="credit" value={a.credit} onChange={set('credit')} options={CREDIT_BANDS} />
            </Q>
            <Q n={next()} title="In the last 12 months, did you have any late payments or bills sent to collections?">
              <Check checked={a.latePayments} onChange={set('latePayments')}>{t('Late payment (30+ days)')}</Check>
              <Check checked={a.collections} onChange={set('collections')}>{t('A bill in collections (including medical)')}</Check>
              <button type="button" onClick={() => { set('latePayments')(false); set('collections')(false); markTouched('q6'); }} className={`chip mt-2 ${touched.includes('q6') && !a.latePayments && !a.collections ? 'chip-on' : ''}`}>{t('No, none of these')}</button>
            </Q>
            <Q n={next()} title="Have you ever filed for bankruptcy?" help="This doesn't stop you forever. Most loans just have a waiting period.">
              <Choices name="bk" value={a.bankruptcy} onChange={set('bankruptcy')} options={BANKRUPTCY_OPTIONS} />
            </Q>
            <Q n={next()} title="Have you ever lost a home to foreclosure or a short sale?">
              <Choices name="fc" value={a.foreclosure} onChange={set('foreclosure')} options={FORECLOSURE_OPTIONS} />
            </Q>
          </>
        )}

        {sid === 'work' && (
          <>
            <Q n={next()} title="Have you owned a home in the last 3 years?" help="If not, you count as a first-time buyer, even if you owned one long ago.">
              <Choices name="owned" value={a.ownedRecently} onChange={set('ownedRecently')} options={YES_NO_UNSURE_BOOL} />
              <p className="mt-4 mb-2">{t('Did your parents own a home?')}</p>
              <Choices name="parents" value={a.parentsOwned} onChange={set('parentsOwned')} options={YES_NO} />
            </Q>
            <Q n={next()} title="What job do you do, and where?" help="Your job and employer can unlock special help: school staff, health care, public safety, and government workers often have extra options.">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="q-title" className="field-label">{t('Job title')}</label>
                  <input id="q-title" className="field !font-sans" value={a.jobTitle} onChange={(e) => set('jobTitle')(e.target.value)} placeholder={t('e.g. CNA, teacher\'s aide, bus driver')} />
                </div>
                <div>
                  <label htmlFor="q-employer" className="field-label">{t('Employer')}</label>
                  <input id="q-employer" className="field !font-sans" value={a.employer} onChange={(e) => set('employer')(e.target.value)} placeholder={t('e.g. Kaiser, Santa Ana Unified, City of Irvine')} />
                </div>
              </div>
              {suggested && (
                <p className="mb-3 p-3 bg-gold/15 border-s-4 border-gold">
                  {t('Looks like: {job}.', { job: t(suggested.label) })}{' '}
                  <button type="button" className="btn-link" onClick={() => set('occupation')(suggested.id)}>{t('Use this')}</button>
                </p>
              )}
              <p className="field-label">{t('Kind of work')}</p>
              <Choices name="job" value={a.occupation} onChange={set('occupation')} options={OCCUPATIONS} />
              {job.tips.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-sm">
                  {job.tips.map((tip) => <li key={tip} className="flex gap-2"><span aria-hidden="true">💼</span>{t(tip)}</li>)}
                </ul>
              )}
            </Q>
            <Q n={next()} title="Which of these groups do you belong to? (pick all)" help="Credit unions, unions, employers, and the military often have their own home help.">
              <div className="grid sm:grid-cols-2 gap-x-4">
                {GROUPS.map((g) => (
                  <Check key={g.id} checked={a.groups.includes(g.id)} onChange={() => toggleGroup(g.id)}>{t(g.label)}</Check>
                ))}
              </div>
              <button type="button" onClick={() => { set('groups')([]); markTouched('q11'); }} className={`chip mt-2 ${touched.includes('q11') && a.groups.length === 0 ? 'chip-on' : ''}`}>{t('None of these')}</button>
              {a.groups.includes('veteran') && (
                <div className="mt-5 p-4 rounded-2xl bg-paper border border-rule space-y-4">
                  <p className="font-semibold">{t('A few military questions (for VA loans)')}</p>
                  <div><p className="field-label">{t('Your connection to the military')}</p><Choices name="mrole" value={a.militaryRole} onChange={set('militaryRole')} options={MILITARY_ROLES} /></div>
                  <div><p className="field-label">{t('Have you used a VA home loan before?')}</p><Choices name="vause" value={a.vaUse} onChange={set('vaUse')} options={VA_USE} /></div>
                  <div><p className="field-label">{t('Has the VA said you don\'t pay the funding fee?')}</p><Choices name="vaex" value={a.vaExempt} onChange={set('vaExempt')} options={YES_NO_UNSURE} /></div>
                  <p className="text-sm text-muted">{t('We never ask about medical details. Your VA Certificate of Eligibility shows the funding fee answer.')}</p>
                </div>
              )}
            </Q>
            <Q n={next()} title="Does anyone in your home have a disability?" help="Disability benefits can count as income, and there are programs for saving and for making a home accessible.">
              <Choices name="disability" value={a.disability} onChange={set('disability')} options={[...YES_NO]} />
            </Q>
          </>
        )}

        {sid === 'where' && (
          <>
            <Q n={next()} title="Where in California do you want to live?" help="Income limits and local programs depend on your county.">
              <div className="max-w-sm mb-3"><CountySelect id="q-county" value={a.county} onChange={set('county')} label={t('County')} /></div>
              {a.county === 'Orange' ? (
                <>
                  <label htmlFor="q-city" className="field-label">{t('Which Orange County city?')}</label>
                  <select id="q-city" className="field max-w-sm" value={a.city} onChange={(e) => set('city')(e.target.value)}>
                    {CITY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{t(c.label)}</option>)}
                  </select>
                </>
              ) : (
                <p className="text-sm p-3 bg-paper border border-rule">
                  {t('Our deepest local research is for Orange County. For other counties we use official 2026 state income limits and statewide programs, and point you to local offices.')}
                </p>
              )}
            </Q>
            <Q n={next()} title="How do you get paid, and how do you file taxes?" help="Self-employed, gig, and ITIN buyers have options too, often through private and mission lenders.">
              <Choices name="pay" value={a.payType} onChange={set('payType')} options={PAY_TYPES} />
              <p className="mt-4 mb-2">{t('I file taxes with a…')}</p>
              <Choices name="id" value={a.idType} onChange={set('idType')} options={ID_TYPES} />
            </Q>
            <Q n={next()} title="Could any other money help?" help="Gifts from family are allowed by most loans with a signed gift letter.">
              <p className="mb-2">{t('Could family give or lend part of the down payment?')}</p>
              <Choices name="family" value={a.familyHelp} onChange={set('familyHelp')} options={YES_NO} />
              <p className="mt-4 mb-2">{t('Would you consider a seller who finances the home?')}</p>
              <Choices name="seller" value={a.sellerOpen} onChange={set('sellerOpen')} options={YES_NO} />
            </Q>
          </>
        )}
      </div>

      <div className="mt-6"><SaveToggle /></div>

      {/* Progress + step navigation */}
      <div className="mt-8 q-card">
        <p className="field-label">{t('Your progress: {n} of {total} answered', { n: answeredCount, total: allQuestions.length })}</p>
        <div className="progress" aria-hidden="true"><span style={{ width: `${(answeredCount / allQuestions.length) * 100}%` }} /></div>
        {s === QUIZ_STEPS.length && skipped.length > 0 && (
          <p className="text-sm mt-3">{t('Not answered yet: {list}. You can still continue; we\'ll use the answer that\'s shown.', { list: skipped.join(', ') })}</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
          {s > 1
            ? <a href={`#/plan/${s - 1}`} className="btn-ghost">← {t('Previous')}</a>
            : <button type="button" onClick={resetPlanAnswers} className="btn-link">{t('Start over')}</button>}
          {s < QUIZ_STEPS.length
            ? <a href={`#/plan/${s + 1}`} className="btn-primary">{t('Next')}: {t(QUIZ_STEPS[s].title)} →</a>
            : <button type="button" onClick={finish} className="btn-primary">{submitted ? t('Update my plan') : t('Show my plan')} →</button>}
        </div>
      </div>
    </div>
  );
}
