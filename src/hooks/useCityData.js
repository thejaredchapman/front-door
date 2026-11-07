import { useState, useEffect } from 'react';
import { findOcCity } from '../data/ocCities';

export function useCityData(cityId) {
  const [cityData, setCityData] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    const city = findOcCity(cityId);
    setCityData(city || null);
    setLiveWeather(null);
  }, [cityId]);

  useEffect(() => {
    if (!cityData) return;
    let cancelled = false;

    const enrichWithWeather = async () => {
      setIsEnriching(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lng}&current_weather=true&temperature_unit=fahrenheit`
        );
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (!cancelled) {
          setLiveWeather({
            currentTemp: Math.round(data.current_weather.temperature),
            windSpeed: Math.round(data.current_weather.windspeed),
            isDay: data.current_weather.is_day === 1,
          });
        }
      } catch {
        // Graceful fallback to static data
      } finally {
        if (!cancelled) setIsEnriching(false);
      }
    };

    enrichWithWeather();
    return () => { cancelled = true; };
  }, [cityData]);

  return { city: cityData, liveWeather, isEnriching };
}
