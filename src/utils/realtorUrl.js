/**
 * Construct Realtor.com search URLs.
 * Format: https://www.realtor.com/realestateandhomes-search/{City_ST}/price-{min}-{max}
 */

export function buildRealtorUrl(city, options = {}) {
  const { priceMin, priceMax, propertyType } = options;
  let url = `https://www.realtor.com/realestateandhomes-search/${city.realtorSlug}`;

  if (priceMin || priceMax) {
    const min = priceMin ? Math.round(priceMin) : 'na';
    const max = priceMax ? Math.round(priceMax) : 'na';
    url += `/price-${min}-${max}`;
  }

  if (propertyType) {
    url += `/type-${propertyType}`;
  }

  return url;
}

export function generateRealtorLinks(city, maxAffordablePrice) {
  if (!city) return [];

  const buffer = 0.1;
  const min = Math.round(maxAffordablePrice * (1 - buffer));
  const max = Math.round(maxAffordablePrice * (1 + buffer));

  return [
    {
      label: `All listings in ${city.name}`,
      url: buildRealtorUrl(city),
    },
    {
      label: `Homes in your budget ($${min.toLocaleString()} – $${max.toLocaleString()})`,
      url: buildRealtorUrl(city, { priceMin: min, priceMax: max }),
    },
    {
      label: `Condos in ${city.name}`,
      url: buildRealtorUrl(city, { priceMax: max, propertyType: 'condo' }),
    },
    {
      label: `Single-family homes in ${city.name}`,
      url: buildRealtorUrl(city, { priceMax: max, propertyType: 'single-family-home' }),
    },
  ];
}
