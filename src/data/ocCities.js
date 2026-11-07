/**
 * Orange County's 34 cities plus unincorporated areas, for the calculator and the quiz.
 *
 * Cost assumptions are ESTIMATES used for every city (shown as such in the app):
 *   - property tax ≈ 1.1% of price (California's 1% base + typical local voter-approved debt;
 *     newer neighborhoods may add Mello-Roos / special assessments)
 *   - home insurance ≈ $1,800/yr (get real quotes; wildfire areas can cost more)
 * Local programs: docs/research/down-payment-subsidies.json (checked 2026-11-07).
 * County MAP eligibility: unincorporated OC + the 14 participating cities in the county's
 * May 2026 application package.
 * Coordinates are approximate city centers (used for live weather only).
 */
export const OC_PROPERTY_TAX_ESTIMATE = 1.1;
export const OC_INSURANCE_ESTIMATE = 1800;

const MAP_CITIES = new Set([
  'brea', 'cypress', 'dana-point', 'la-palma', 'laguna-beach', 'laguna-hills', 'laguna-woods',
  'los-alamitos', 'placentia', 'san-juan-capistrano', 'seal-beach', 'stanton', 'villa-park', 'yorba-linda', 'unincorporated',
]);

// City-specific programs (ids from src/data/programs.js)
const CITY_PROGRAMS = {
  'santa-ana': ['santa-ana'],
  'garden-grove': ['garden-grove'],
  anaheim: ['anaheim', 'anaheim-hotel'],
  irvine: ['inclusionary', 'irvine-clt'],
  'huntington-beach': ['inclusionary'],
  tustin: ['inclusionary'],
  brea: ['inclusionary'],
};

const RAW = [
  ['aliso-viejo', 'Aliso Viejo', 33.5685, -117.7256],
  ['anaheim', 'Anaheim', 33.8366, -117.9143],
  ['brea', 'Brea', 33.9167, -117.9001],
  ['buena-park', 'Buena Park', 33.8675, -117.9981],
  ['costa-mesa', 'Costa Mesa', 33.6411, -117.9187],
  ['cypress', 'Cypress', 33.817, -118.0373],
  ['dana-point', 'Dana Point', 33.4672, -117.6981],
  ['fountain-valley', 'Fountain Valley', 33.7092, -117.9537],
  ['fullerton', 'Fullerton', 33.8704, -117.9242],
  ['garden-grove', 'Garden Grove', 33.7743, -117.938],
  ['huntington-beach', 'Huntington Beach', 33.6603, -117.9992],
  ['irvine', 'Irvine', 33.6846, -117.8265],
  ['la-habra', 'La Habra', 33.9319, -117.9462],
  ['la-palma', 'La Palma', 33.8464, -118.0467],
  ['laguna-beach', 'Laguna Beach', 33.5427, -117.7854],
  ['laguna-hills', 'Laguna Hills', 33.5977, -117.6992],
  ['laguna-niguel', 'Laguna Niguel', 33.5225, -117.7076],
  ['laguna-woods', 'Laguna Woods', 33.6103, -117.7253],
  ['lake-forest', 'Lake Forest', 33.647, -117.6892],
  ['los-alamitos', 'Los Alamitos', 33.8031, -118.0726],
  ['mission-viejo', 'Mission Viejo', 33.6, -117.672],
  ['newport-beach', 'Newport Beach', 33.6189, -117.9298],
  ['orange', 'Orange', 33.7879, -117.8531],
  ['placentia', 'Placentia', 33.8722, -117.8703],
  ['rancho-santa-margarita', 'Rancho Santa Margarita', 33.6409, -117.6031],
  ['san-clemente', 'San Clemente', 33.427, -117.612],
  ['san-juan-capistrano', 'San Juan Capistrano', 33.5017, -117.6625],
  ['santa-ana', 'Santa Ana', 33.7455, -117.8677],
  ['seal-beach', 'Seal Beach', 33.7414, -118.1048],
  ['stanton', 'Stanton', 33.8025, -117.9931],
  ['tustin', 'Tustin', 33.7458, -117.8261],
  ['villa-park', 'Villa Park', 33.8145, -117.8131],
  ['westminster', 'Westminster', 33.7592, -117.989],
  ['yorba-linda', 'Yorba Linda', 33.8886, -117.8131],
  ['unincorporated', 'Unincorporated Orange County', 33.7, -117.76],
];

export const OC_CITIES = RAW.map(([id, name, lat, lng]) => ({
  id,
  name,
  state: 'CA',
  lat,
  lng,
  propertyTaxRate: OC_PROPERTY_TAX_ESTIMATE,
  avgHomeInsuranceAnnual: OC_INSURANCE_ESTIMATE,
  mapEligible: MAP_CITIES.has(id),
  programIds: CITY_PROGRAMS[id] || [],
  realtorSlug: id === 'unincorporated' ? 'Orange-County_CA' : `${name.replace(/ /g, '-')}_CA`,
  note: id === 'unincorporated' ? 'Areas such as Ladera Ranch, Rossmoor, Midway City, Coto de Caza, and North Tustin.' : '',
}));

export const DEFAULT_OC_CITY = 'santa-ana';

export function findOcCity(id) {
  return OC_CITIES.find((c) => c.id === id) || null;
}
