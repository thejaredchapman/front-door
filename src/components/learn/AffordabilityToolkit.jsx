import { useT } from '../../i18n';
import Explain from '../funding/Explain';
import HousingRatioSlider from '../HousingRatioSlider';
import RATE_INFO from '../../data/rate.json';
import { calculateMonthlyPayment } from '../../utils/amortization';
import { formatCurrency } from '../../utils/formatters';

// Worked examples on a $400,000 loan at today's rate (computed, not quoted).
const LOAN = 400000;
const payAt = (rate) => calculateMonthlyPayment(LOAN, rate, 30);
const rateSave = payAt(RATE_INFO.value) - payAt(RATE_INFO.value - 0.5);
const pmiMonthly = (LOAN * 0.55) / 100 / 12;

const GROUPS = [
  {
    icon: '🏷️', title: 'Lower the price',
    items: [
      { title: 'Below-market-rate homes', plain: 'Some new homes are sold far below market to income-qualified buyers by lottery (Irvine, Huntington Beach, Tustin, Brea). Join every interest list.', eli5: 'Some houses have a special low price. Put your name in.', href: '#/learn/programs' },
      { title: 'Habitat for Humanity', plain: 'Homes sold at cost, with a payment kept to about 30–35% of income, in exchange for sweat-equity hours.', eli5: 'Help build, then buy at a fair price.', href: '#/learn/habitat' },
      { title: 'Condos, townhomes, and manufactured homes', plain: 'Smaller homes cost less. Manufactured homes in parks cost far less to buy, but add monthly space rent.', eli5: 'A smaller home costs less.', href: '#/learn/loan-types' },
    ],
  },
  {
    icon: '💵', title: 'Lower the cash you need',
    items: [
      { title: 'Down payment help', plain: 'CalHFA MyHome (up to 3.5%), city loans (Garden Grove up to $110,000, Santa Ana up to $120,000), the County MAP (up to $80,000 in eligible cities), WISH matching grants (up to $32,837), and bank grants.', eli5: 'Helpers pay part of the first big chunk.', href: '#/learn/programs' },
      { title: 'Closing-cost help and gifts', plain: 'CalHFA ZIP (0% for closing costs), seller credits, and family gifts with a gift letter can cover most of the cash at closing.', eli5: 'Family and helpers can pay the fees at the end.', href: '#/learn/private' },
      { title: 'Save your tax refund', plain: 'Send part of your EITC or CalEITC refund straight to savings with IRS Form 8888.', eli5: 'Put some tax-time money in your house jar.', href: '#/give/taxes' },
    ],
  },
  {
    icon: '📉', title: 'Lower the monthly payment',
    items: [
      { title: 'Shop for a lower rate', plain: `Get 3 Loan Estimates in the same week; credit unions often cost less. A rate just 0.5% lower saves about ${formatCurrency(rateSave)} a month on a $400,000 loan.`, eli5: 'Ask three banks for their price; small differences add up.', href: '#/learn/lenders' },
      { title: 'Skip or drop mortgage insurance', plain: `Mortgage insurance can cost around ${formatCurrency(pmiMonthly)} a month on a $400,000 FHA loan. Some credit unions offer no-PMI loans with 3% down, and conventional PMI comes off at 78% of the original value.`, eli5: 'Some loans skip the extra seatbelt fee.', href: '#/learn/interest' },
      { title: 'Raise your credit score', plain: 'Better scores unlock lower rates and cheaper mortgage insurance. Paying on time and keeping cards under 30% helps most.', eli5: 'A better money report card means a cheaper loan.', href: '#/learn/words' },
      { title: 'Tax credits and rent help', plain: 'A Mortgage Credit Certificate returns part of your interest at tax time. A 2–4 unit home with FHA lets tenants help pay the mortgage.', eli5: 'Get money back at tax time, or let renters help pay.', href: '#/learn/programs' },
      { title: 'Watch the hidden monthly costs', plain: 'Mello-Roos taxes, HOA dues, insurance, and utilities can add hundreds a month. Newer, energy-efficient homes often have lower utility bills.', eli5: 'Check the extra bills before you pick a house.', href: '#/learn/new' },
    ],
  },
  {
    icon: '⏳', title: 'Lower the total cost',
    items: [
      { title: 'Pay less interest over time', plain: 'Small extra payments, paying every two weeks, and putting refunds toward principal can save tens of thousands and years of payments.', eli5: 'Pay a little extra and the loan costs less.', href: '#/learn/interest' },
    ],
  },
  {
    icon: '🛡️', title: 'Keep it affordable',
    items: [
      { title: 'Protect your home', plain: 'Keep 3 months of payments saved, avoid lenders who call you out of the blue, and use Habitat\'s Home Preservation Program for critical repairs. New laws protect wildfire victims\' insurance.', eli5: 'Save for surprises and stay away from tricky lenders.', href: '#/learn/laws' },
    ],
  },
];

export default function AffordabilityToolkit() {
  const t = useT();
  return (
    <div>
      <div className="card mb-8"><HousingRatioSlider id="ratio-toolkit" /></div>
      <div className="space-y-10">
        {GROUPS.map((g) => (
          <section key={g.title} aria-labelledby={`aff-${g.title}`}>
            <h2 id={`aff-${g.title}`} className="display text-2xl font-bold mb-3"><span aria-hidden="true">{g.icon}</span> {t(g.title)}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {g.items.map((it) => (
                <article key={it.title} className="card">
                  <h3 className="font-bold text-lg">{t(it.title)}</h3>
                  <Explain plain={it.plain} eli5={it.eli5} className="text-sm mt-1" />
                  <a href={it.href} className="btn-link inline-block mt-2">{t('Learn how')} →</a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <a href="#/plan" className="cta-band mt-12">
        <span className="display text-2xl font-bold">{t('See which of these fit your family')}</span>
        <span>{t('Take the check-in: see what you can afford')} <span className="flip-rtl" aria-hidden="true">→</span></span>
      </a>
    </div>
  );
}
