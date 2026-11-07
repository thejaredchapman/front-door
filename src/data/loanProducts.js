import RATE_INFO from './rate.json';

/** Front Door is mortgage-only: one home loan product with its defaults. */
export const MORTGAGE = {
  id: 'home',
  name: 'Home Mortgage',
  icon: '01',
  description: 'Finance your dream home with competitive fixed-rate mortgage options.',
  defaultRate: RATE_INFO.value,
  rateRange: { min: 3.0, max: 12.0 },
  terms: [15, 20, 30],
  defaultTerm: 30,
  defaultDownPaymentPercent: 3.5,
  minDownPaymentPercent: 3,
  includesTax: true,
  includesInsurance: true,
  includesPMI: true,
  pmiRate: 0.5,
  maxDTI: 30, // default; the user's 30–35% slider (store.housingRatio) is what the calculator uses
  theme: {
    primary: '#1F5C45',
    secondary: '#2F7D5F',
    accent: '#1F5C45',
    particleColor: 'rgba(59, 130, 246, 0.15)',
    label: 'blue',
  },
};
