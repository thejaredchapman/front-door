import { useState } from 'react';
import Section from './Section';
import Explain from './Explain';
import { calculateMonthlyPayment } from '../../utils/amortization';
import { formatCurrency } from '../../utils/formatters';
import RATE_INFO from '../../data/rate.json';

const RATE_NOW = RATE_INFO.value; // Freddie Mac PMMS 30-yr, updated by the daily check
const RATE_YEAR_AGO = RATE_INFO.yearAgo;

// County of Orange Housing Element, Table 2-26 (Orange County median sales price)
const OC_PRICE_HISTORY = [
  { year: '2015', price: 609000 },
  { year: '2019', price: 740000 },
  { year: '2021', price: 889000 },
  { year: 'Jul 2023', price: 1055000 },
];

const WHY_RATES = [
  {
    title: 'Rates follow the bond market',
    plain: 'Lenders sell most mortgages to investors. Investors compare them with safe government bonds, especially the 10-year Treasury. When Treasury yields rise, mortgage rates usually rise too.',
    eli5: 'Banks borrow money from big investors. When those investors want more "rent" for their money, the bank charges you more too.',
  },
  {
    title: 'Inflation and the Federal Reserve',
    plain: 'When prices rise fast, investors demand higher interest so their money doesn\'t lose value, and the Federal Reserve keeps its rate higher to cool spending. Both push mortgage rates up.',
    eli5: 'When everything at the store costs more, borrowing money costs more too.',
  },
  {
    title: 'Government borrowing',
    plain: 'When the government borrows a lot, it sells more bonds. More bonds for sale can mean investors ask for higher yields, which can lift mortgage rates.',
    eli5: 'If lots of people want to borrow from the same piggy bank, the piggy bank can charge more.',
  },
  {
    title: 'Risk and lender costs',
    plain: 'On top of the bond rate, lenders add a "spread" for risk and costs. Your rate also depends on your credit score, down payment, loan type, and how long you lock the rate.',
    eli5: 'If the bank thinks a loan is riskier, it charges a little extra. A better credit report card means a lower price.',
  },
];

const SUPPLY_DEMAND = [
  {
    title: 'Not enough homes are built',
    plain: 'Land in Orange County is scarce and expensive. Approvals, fees, and construction costs are high, and building takes years. The state sets housing targets (RHNA) because cities have built far fewer homes than people need.',
    eli5: 'There aren\'t enough houses for everyone who wants one, and making new ones is slow and costly.',
  },
  {
    title: 'Owners stay put',
    plain: 'Many owners have low mortgage rates from earlier years. Selling would mean a new loan at today\'s higher rate, so fewer homes go up for sale. This is often called the "lock-in" effect.',
    eli5: 'People who got a cheap loan long ago don\'t want to give it up, so they don\'t move, and fewer houses come up for sale.',
  },
  {
    title: 'Lots of people still want to live here',
    plain: 'Jobs, weather, and schools keep demand high. When many buyers chase few homes, prices get bid up.',
    eli5: 'When 10 kids want the same 3 toys, the toys get "more expensive" because everyone offers more to get one.',
  },
];

const CONSEQUENCES = [
  ['Higher prices', 'Orange County\'s median price rose from about $609,000 (2015) to $1,055,000 (mid-2023), roughly 73%, while incomes grew far less.'],
  ['Bigger payments', 'Higher prices and higher rates together push monthly payments out of reach for most workers.'],
  ['Renters stuck renting', 'Over half of OC renters are cost-burdened (paying more than 30% of income), which makes saving for a down payment harder.'],
  ['Crowded homes', 'Families double up. Habitat OC families describe four kids sharing a room, or a family of five renting one bedroom.'],
  ['Long commutes', 'Firefighters, nurses, and teachers often live far from the communities they serve.'],
  ['Bidding wars', 'Buyers with cash or big down payments win more often, which is why down payment help and below-market homes matter.'],
];

const SHOP_TIPS = [
  {
    title: 'Get at least 3 quotes in the same week',
    plain: 'Ask 3–5 lenders for an official Loan Estimate on the same day so rates are comparable. Credit scoring models count multiple mortgage checks within a short window (14–45 days) as one, so shopping barely affects your score.',
    eli5: 'Ask at least three banks for their price. Asking several in the same week doesn\'t hurt your report card.',
  },
  {
    title: 'Try different kinds of lenders',
    plain: 'Compare a credit union, a community bank or CDFI, a mortgage broker (who shops many lenders for you), and a CalHFA-approved lender. Credit unions and brokers often beat big banks.',
    eli5: 'Check different kinds of stores. Sometimes the small neighborhood one has the best price.',
  },
  {
    title: 'Compare the whole Loan Estimate, not just the rate',
    plain: 'Look at the rate, the APR, points and origination fees (page 2, Section A), lender credits, and cash to close. A low rate with high points can cost more if you sell or refinance in a few years.',
    eli5: 'A low price tag can hide extra fees. Look at the whole receipt.',
  },
  {
    title: 'Know what\'s normal for you',
    plain: 'Use the CFPB\'s free "Explore interest rates" tool to see typical rates for your credit score, state, and loan type before you talk to lenders.',
    eli5: 'Look up the usual price first, so you know if a deal is good.',
  },
  {
    title: 'Small credit jumps can lower your rate',
    plain: 'Conventional loan pricing improves at score steps such as 660, 680, 700, 720, and 740. Paying a card down before the statement date can move you up a step. Ask your lender about a "rapid rescore".',
    eli5: 'A slightly better report card can unlock a cheaper price.',
  },
  {
    title: 'Ask the seller to help',
    plain: 'Sellers can pay for a "rate buydown" (lowering your rate for the first years, or permanently) as part of the deal. FHA and VA loans can also be assumable: you might take over the seller\'s older, lower-rate loan.',
    eli5: 'Sometimes the person selling the house will help pay to make your loan cheaper.',
  },
  {
    title: 'Check the lender is licensed',
    plain: 'Look up the lender and loan officer on NMLS Consumer Access. Be careful with "lock now or lose it" pressure, teaser adjustable rates, and promises that you can "just refinance later." Rates may not drop.',
    eli5: 'Make sure the bank is a real, licensed bank. If someone rushes you, slow down.',
  },
];

function QuoteComparer() {
  const [loan, setLoan] = useState(400000);
  const [years, setYears] = useState(7);
  const [quotes, setQuotes] = useState([
    { name: 'Lender A', rate: 7.25, points: 0, fees: 2500 },
    { name: 'Lender B', rate: 6.99, points: 1, fees: 1800 },
    { name: 'Credit union', rate: 7.05, points: 0, fees: 1200 },
  ]);
  const update = (i, k, v) => setQuotes(quotes.map((q, j) => (j === i ? { ...q, [k]: v } : q)));

  const rows = quotes.map((q) => {
    const pay = calculateMonthlyPayment(loan, q.rate, 30);
    const upfront = (loan * q.points) / 100 + q.fees;
    return { ...q, pay, upfront, total: upfront + pay * years * 12 };
  });
  const best = rows.reduce((m, r) => (r.total < m.total ? r : m), rows[0]);

  return (
    <div className="panel">
      <h4 className="kicker mb-3">Compare your quotes</h4>
      <div className="grid sm:grid-cols-2 gap-4 mb-4 max-w-xl">
        <div>
          <label htmlFor="qc-loan" className="field-label">Loan amount</label>
          <input id="qc-loan" type="number" min={0} step={5000} className="field" value={loan} onChange={(e) => setLoan(Math.max(0, Number(e.target.value)))} />
        </div>
        <div>
          <label htmlFor="qc-years" className="field-label">Years you expect to keep this loan</label>
          <input id="qc-years" type="number" min={1} max={30} className="field" value={years} onChange={(e) => setYears(Math.min(30, Math.max(1, Number(e.target.value))))} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              {['Lender', 'Rate %', 'Points %', 'Lender fees', 'Monthly P&I', 'Upfront cost', `Cost over ${years} yrs`].map((h) => (
                <th key={h} className="py-2 pr-2 field-label !mb-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-rule ${r === best ? 'bg-gold/20' : ''}`}>
                <td className="py-1.5 pr-2"><input aria-label="Lender name" className="field !py-1" value={r.name} onChange={(e) => update(i, 'name', e.target.value)} /></td>
                <td className="py-1.5 pr-2"><input aria-label="Rate" type="number" step={0.01} className="field !py-1 w-20" value={r.rate} onChange={(e) => update(i, 'rate', Number(e.target.value))} /></td>
                <td className="py-1.5 pr-2"><input aria-label="Points" type="number" step={0.125} className="field !py-1 w-20" value={r.points} onChange={(e) => update(i, 'points', Number(e.target.value))} /></td>
                <td className="py-1.5 pr-2"><input aria-label="Lender fees" type="number" step={100} className="field !py-1 w-24" value={r.fees} onChange={(e) => update(i, 'fees', Number(e.target.value))} /></td>
                <td className="py-1.5 pr-2 num">{formatCurrency(r.pay)}</td>
                <td className="py-1.5 pr-2 num">{formatCurrency(r.upfront)}</td>
                <td className="py-1.5 num font-semibold">{formatCurrency(r.total)}{r === best && ' ★'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm mt-3">
        <strong>★ {best.name}</strong> costs the least if you keep the loan {years} years. Change the years: points only pay off if you keep the loan long enough.
      </p>
    </div>
  );
}

export default function RatesExplainer() {
  const loan = 400000;
  const payNow = calculateMonthlyPayment(loan, RATE_NOW, 30);
  const payThen = calculateMonthlyPayment(loan, RATE_YEAR_AGO, 30);
  const perPoint = calculateMonthlyPayment(loan, RATE_NOW, 30) - calculateMonthlyPayment(loan, RATE_NOW - 1, 30);
  const maxPrice = Math.max(...OC_PRICE_HISTORY.map((p) => p.price));

  return (
    <Section
      id="rates"
      kicker="Why is it so expensive?"
      title="High rates, too few homes: what it means for you"
      intro={
        <Explain
          plain="Two things make buying hard right now: the cost of borrowing (interest rates) and the price of homes (supply and demand). Neither is your fault, but understanding them helps you make smarter moves."
          eli5="Houses cost a lot for two reasons: borrowing money costs more, and there aren't enough houses for everyone. Here's how both work."
        />
      }
    >
      <div className="grid sm:grid-cols-3 border border-line rounded-2xl bg-card mb-8">
        <div className="p-4">
          <p className="field-label">30-yr rate, {RATE_INFO.asOf}</p>
          <p className="display text-3xl font-extrabold text-[var(--accent)]">{RATE_NOW}%</p>
          <p className="text-xs text-muted">vs {RATE_YEAR_AGO}% a year earlier (Freddie Mac)</p>
        </div>
        <div className="p-4 sm:border-l-[1.5px] border-t-[1.5px] sm:border-t-0 border-ink">
          <p className="field-label">On a $400,000 loan</p>
          <p className="display text-3xl font-extrabold">+{formatCurrency(payNow - payThen)}/mo</p>
          <p className="text-xs text-muted">{formatCurrency(payNow)} now vs {formatCurrency(payThen)} a year ago (principal & interest)</p>
        </div>
        <div className="p-4 sm:border-l-[1.5px] border-t-[1.5px] sm:border-t-0 border-ink">
          <p className="field-label">Each 1% of rate</p>
          <p className="display text-3xl font-extrabold">≈ {formatCurrency(perPoint)}/mo</p>
          <p className="text-xs text-muted">on a $400,000 loan, or about {formatCurrency(perPoint * 360)} over 30 years</p>
        </div>
      </div>

      <h3 className="display text-2xl font-semibold mb-4">Why are rates high?</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {WHY_RATES.map((w) => (
          <div key={w.title} className="bg-card border border-line rounded-2xl p-4">
            <h4 className="display text-lg font-semibold mb-1">{w.title}</h4>
            <Explain plain={w.plain} eli5={w.eli5} className="text-sm leading-relaxed" />
          </div>
        ))}
      </div>

      <h3 className="display text-2xl font-semibold mb-4">High demand, low supply</h3>
      <div className="grid lg:grid-cols-5 gap-6 mb-10">
        <div className="lg:col-span-3 grid gap-4">
          {SUPPLY_DEMAND.map((w) => (
            <div key={w.title} className="bg-card border border-line rounded-2xl p-4">
              <h4 className="display text-lg font-semibold mb-1">{w.title}</h4>
              <Explain plain={w.plain} eli5={w.eli5} className="text-sm leading-relaxed" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 panel !mb-0">
          <p className="field-label">Orange County median home price</p>
          <ul className="space-y-2 mt-2" aria-label="Median price by year">
            {OC_PRICE_HISTORY.map((p) => (
              <li key={p.year} className="grid grid-cols-[4.5rem_1fr_5.5rem] items-center gap-2 text-sm">
                <span>{p.year}</span>
                <span className="h-5 bg-paper border border-rule relative"><span className="absolute inset-y-0 left-0 bg-[var(--accent)]" style={{ width: `${(p.price / maxPrice) * 100}%` }} /></span>
                <span className="num text-right">{formatCurrency(p.price)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted mt-3">Source: County of Orange Housing Element (Feb 2025), Table 2-26. Habitat OC&rsquo;s 2025 Impact Report puts today&rsquo;s median above $1.3M.</p>
        </div>
      </div>

      <h3 className="display text-2xl font-semibold mb-4">What happens because of it</h3>
      <dl className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CONSEQUENCES.map(([t, d]) => (
          <div key={t} className="border-l-4 border-[var(--accent)] pl-3">
            <dt className="font-semibold">{t}</dt>
            <dd className="text-sm text-muted">{d}</dd>
          </div>
        ))}
      </dl>
      <div className="panel mb-10">
        <h4 className="kicker mb-2">In plain English: what this means for you</h4>
        <Explain
          className="leading-relaxed"
          plain="Don't wait for prices to fall. They rarely drop much in Orange County. Instead, focus on what you can control: your credit score (for a better rate), your debts (to qualify for more), and stacking help (down payment programs, below-market homes, Habitat). Buy a home you can afford at today's rate. If rates fall later, refinancing is a bonus, not a plan."
          eli5="You can't change the price of houses or the bank's rates. But you can make your report card better, pay down old bills, and get helpers on your side. Pick a house you can pay for today."
        />
      </div>

      <h3 className="display text-2xl font-semibold mb-4">How to find a lender with a lower rate</h3>
      <ol className="grid md:grid-cols-2 gap-4 mb-6">
        {SHOP_TIPS.map((t, i) => (
          <li key={t.title} className="bg-card border border-line rounded-2xl p-4">
            <p className="num text-xs text-muted">{i + 1}</p>
            <h4 className="display text-lg font-semibold mb-1">{t.title}</h4>
            <Explain plain={t.plain} eli5={t.eli5} className="text-sm leading-relaxed" />
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm">
        <a className="btn-link" href="https://www.consumerfinance.gov/owning-a-home/explore-rates/" target="_blank" rel="noreferrer">CFPB: Explore interest rates →</a>
        <a className="btn-link" href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noreferrer">CFPB: How to read a Loan Estimate →</a>
        <a className="btn-link" href="https://www.nmlsconsumeraccess.org/" target="_blank" rel="noreferrer">NMLS: check a lender&rsquo;s license →</a>
        <a className="btn-link" href="https://www.freddiemac.com/pmms" target="_blank" rel="noreferrer">Freddie Mac weekly rates →</a>
      </div>
      <QuoteComparer />
    </Section>
  );
}
