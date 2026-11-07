import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_ANSWERS } from '../data/plans';
import RATE_INFO from '../data/rate.json';
import { OC_CITIES } from '../data/ocCities';

const OC_CITY_IDS = new Set(OC_CITIES.map((c) => c.id));

export const useStore = create(
  persist(
    (set) => ({

      searchMode: 'property',
      setSearchMode: (mode) => set({ searchMode: mode }),

      selectedCityId: 'santa-ana',
      setSelectedCity: (cityId) => set({ selectedCityId: cityId }),

      propertyPrice: 350000,
      downPaymentPercent: 3.5,
      interestRate: RATE_INFO.value,
      loanTerm: 30,
      setPropertyPrice: (val) => set({ propertyPrice: val }),
      setDownPaymentPercent: (val) => set({ downPaymentPercent: val }),
      setInterestRate: (val) => set({ interestRate: val }),
      setLoanTerm: (val) => set({ loanTerm: val }),

      annualSalary: 75000,
      // Share of gross income for the house payment (30–35%), used everywhere
      housingRatio: 30,
      setAnnualSalary: (val) => set({ annualSalary: val }),
      setHousingRatio: (val) => set({ housingRatio: Math.min(35, Math.max(30, val)) }),

      // Language
      lang: 'en',
      setLang: (val) => set({ lang: val }),

      // Path to Home (funding guide)
      eli5: false,
      setEli5: (val) => set({ eli5: val }),
      county: 'Orange',
      setCounty: (val) => set({ county: val }),
      householdSize: 4,
      householdIncome: 85000,
      occupation: 'any',
      isFirstTimeBuyer: true,
      isVeteran: false,
      setHouseholdSize: (val) => set({ householdSize: val }),
      setHouseholdIncome: (val) => set({ householdIncome: val }),
      setOccupation: (val) => set({ occupation: val }),
      setIsFirstTimeBuyer: (val) => set({ isFirstTimeBuyer: val }),
      setIsVeteran: (val) => set({ isVeteran: val }),

      // Find my plan questionnaire
      planAnswers: DEFAULT_ANSWERS,
      planTouched: [],
      planSubmitted: false,
      setPlanAnswer: (key, val) => set((s) => ({
        planAnswers: { ...s.planAnswers, [key]: val },
        planTouched: s.planTouched.includes(key) ? s.planTouched : [...s.planTouched, key],
      })),
      markPlanTouched: (key) => set((s) => ({ planTouched: s.planTouched.includes(key) ? s.planTouched : [...s.planTouched, key] })),
      setPlanSubmitted: (val) => set({ planSubmitted: val }),
      resetPlanAnswers: () => set({ planAnswers: DEFAULT_ANSWERS, planTouched: [], planSubmitted: false }),
    }),
    {
      name: 'amortization-prefs-v3',
      version: 3,
      // v1: Front Door became mortgage-only. Reset settings saved while on auto/personal/student loans.
      migrate: (state, version) => {
        // v3: the calculator switched from 50 US cities to Orange County cities.
        const ocCity = (id) => (OC_CITY_IDS.has(id) ? id : 'santa-ana');
        if (version >= 2) return { ...state, selectedCityId: ocCity(state.selectedCityId) };
        if (version >= 1) {
          // v2: free-form DTI (often 28%) replaced by a 30–35% housing-payment slider
          const { dtiRatio: _dti, ...v1 } = state;
          return { ...v1, housingRatio: 30, selectedCityId: ocCity(v1.selectedCityId) };
        }
        const wasOtherLoan = state.loanProductId && state.loanProductId !== 'home';
        const { loanProductId: _old, dtiRatio: _dti, ...rest } = state;
        return {
          ...rest,
          loanTerm: [15, 20, 30].includes(rest.loanTerm) ? rest.loanTerm : 30,
          interestRate: wasOtherLoan ? RATE_INFO.value : rest.interestRate,
          downPaymentPercent: wasOtherLoan ? 3.5 : rest.downPaymentPercent,
          housingRatio: 30,
          selectedCityId: ocCity(rest.selectedCityId),
        };
      },
    }
  )
);
