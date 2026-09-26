/**
 * Helper to generate deterministic mock data if no API Key is provided
 */
const getMockWeather = (city) => {
  const normalizedCity = city.trim();
  const hash = normalizedCity.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Clear', 'Windy'];
  
  const condition = conditions[hash % conditions.length];
  const temperature = Math.round(15 + (hash % 20)); // 15 to 34 C
  const humidity = Math.round(40 + (hash % 50));    // 40 to 89%
  const windSpeed = Math.round((3 + (hash % 15)) * 10) / 10; // 3 to 17 m/s
  
  return {
    city: normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1),
    temperature,
    humidity,
    windSpeed,
    condition,
    isMock: true
  };
};

/**
 * Fetch weather from OpenWeatherMap or return mock data as a fallback
 */
const fetchWeather = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Check if API Key is configured
  if (!apiKey || apiKey === 'your_openweathermap_api_key' || apiKey.trim() === '') {
    console.log(`[WeatherService] Using mock weather for city: ${city} (No API Key configured)`);
    return getMockWeather(city);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        console.warn('[WeatherService] OpenWeatherMap API Key is invalid. Falling back to mock weather data.');
        return getMockWeather(city);
      }
      if (response.status === 404) {
        throw new Error('City not found');
      }
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to fetch weather data');
    }

    const data = await response.json();
    return {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      isMock: false
    };
  } catch (error) {
    console.error(`[WeatherService] Error fetching weather for ${city}:`, error.message);
    if (error.message === 'City not found') {
      throw error;
    }
    console.log('[WeatherService] Gracefully falling back to mock weather data.');
    return getMockWeather(city);
  }
};

module.exports = {
  fetchWeather,
};
