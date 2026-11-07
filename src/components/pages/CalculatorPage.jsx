import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { useCityData } from '../../hooks/useCityData';
import { MORTGAGE } from '../../data/loanProducts';
import { calculatePITI, generateAmortizationSchedule } from '../../utils/amortization';
import { calculateRequiredSalary, calculateMaxAffordablePrice } from '../../utils/affordability';

import SearchModeToggle from '../SearchModeToggle';
import PropertySearchForm from '../PropertySearchForm';
import SalarySearchForm from '../SalarySearchForm';
import AmortizationResults from '../AmortizationResults';
import PaymentBreakdownChart from '../PaymentBreakdownChart';
import AmortizationExplorer from '../AmortizationExplorer';
import SalaryRequirement from '../SalaryRequirement';
import AffordabilityResult from '../AffordabilityResult';
import CityInfoPanel from '../CityInfoPanel';
import JobListings from '../JobListings';
import RealtorListings from '../RealtorListings';
import FundingCallout from '../funding/FundingCallout';

import InterestSaver from '../learn/InterestSaver';
import PageHeader from '../shell/PageHeader';
import { useT } from '../../i18n';

export default function CalculatorPage() {
  const t = useT();
  const {
    searchMode, selectedCityId,
    propertyPrice, downPaymentPercent, interestRate, loanTerm,
    annualSalary, housingRatio,
  } = useStore();

  const product = MORTGAGE;
  const { city, liveWeather, isEnriching } = useCityData(selectedCityId);

  // Property search mode calculations
  const piti = useMemo(() => {
    if (searchMode !== 'property' || !propertyPrice || propertyPrice <= 0) return null;
    return calculatePITI({
      propertyPrice,
      downPaymentPercent,
      annualRate: interestRate,
      termYears: loanTerm,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, propertyPrice, downPaymentPercent, interestRate, loanTerm, city, product]);

  const schedule = useMemo(() => {
    if (!piti) return [];
    return generateAmortizationSchedule(piti.loanAmount, interestRate, loanTerm);
  }, [piti, interestRate, loanTerm]);

  const requiredSalary = useMemo(() => {
    if (!piti) return 0;
    return calculateRequiredSalary(piti.totalMonthly, housingRatio);
  }, [piti, housingRatio]);

  // Salary search mode calculations
  const maxAffordable = useMemo(() => {
    if (searchMode !== 'salary' || !annualSalary || annualSalary <= 0) return 0;
    return calculateMaxAffordablePrice({
      annualSalary,
      maxDTIPercent: housingRatio,
      annualRate: interestRate,
      termYears: loanTerm,
      downPaymentPercent,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, annualSalary, housingRatio, interestRate, loanTerm, downPaymentPercent, city, product]);

  const salaryPiti = useMemo(() => {
    if (searchMode !== 'salary' || !maxAffordable || maxAffordable <= 0) return null;
    return calculatePITI({
      propertyPrice: maxAffordable,
      downPaymentPercent,
      annualRate: interestRate,
      termYears: loanTerm,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, maxAffordable, downPaymentPercent, interestRate, loanTerm, city, product]);

  const salarySchedule = useMemo(() => {
    if (!salaryPiti) return [];
    return generateAmortizationSchedule(salaryPiti.loanAmount, interestRate, loanTerm);
  }, [salaryPiti, interestRate, loanTerm]);

  // Determine target salary and price for shared components
  const targetSalary = searchMode === 'property' ? requiredSalary : annualSalary;
  const targetPrice = searchMode === 'property' ? propertyPrice : maxAffordable;
  const activePiti = searchMode === 'property' ? piti : salaryPiti;
  const activeSchedule = searchMode === 'property' ? schedule : salarySchedule;

  const showCityInfo = product.id === 'home' && city;

  return (
  <div className="page">
    <PageHeader kicker="Calculator" title="What will a loan really cost?" plain="Enter a price or your salary. See the monthly payment, the full schedule, and how to pay less interest." eli5="Type in a house price. We show what you pay each month and how to pay less overall." />
    <SearchModeToggle />

    {product.id === 'home' && <FundingCallout />}

    {searchMode === 'property' ? <PropertySearchForm /> : <SalarySearchForm />}

    {searchMode === 'salary' && (
      <AffordabilityResult
        annualSalary={annualSalary}
        dtiRatio={housingRatio}
        interestRate={interestRate}
        loanTerm={loanTerm}
        downPaymentPercent={downPaymentPercent}
        city={city}
        product={product}
      />
    )}

    {activePiti && (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8">
          <AmortizationResults piti={activePiti} product={product} />
          <PaymentBreakdownChart piti={activePiti} product={product} />
        </div>

        {searchMode === 'property' && (
          <SalaryRequirement totalMonthly={activePiti.totalMonthly} maxDTI={housingRatio} />
        )}

        <AmortizationExplorer key={`${activePiti.loanAmount}-${interestRate}-${loanTerm}`} schedule={activeSchedule} piti={activePiti} propertyPrice={searchMode === 'property' ? propertyPrice : maxAffordable} downPaymentPercent={downPaymentPercent} />
        {product.id === 'home' && (
          <section className="mt-12" aria-labelledby="saver-title">
            <p className="kicker mb-2">{t('Pay less interest')}</p>
            <h2 id="saver-title" className="display text-3xl font-extrabold mb-5">{t('Cut the interest on this loan')}</h2>
            <InterestSaver key={`${activePiti.loanAmount}-${interestRate}-${loanTerm}`} defaultLoan={Math.round(activePiti.loanAmount)} defaultRate={interestRate} defaultTerm={loanTerm} compact />
            <a href="#/learn/interest" className="btn-link inline-block mt-4">{t('8 ways to pay less interest')} →</a>
          </section>
        )}
      </>
    )}

    {showCityInfo && (
      <CityInfoPanel city={city} liveWeather={liveWeather} isEnriching={isEnriching} />
    )}

    <JobListings targetSalary={targetSalary} />

    {showCityInfo && (
      <RealtorListings city={city} maxAffordablePrice={targetPrice} />
    )}

  </div>
  );
}
