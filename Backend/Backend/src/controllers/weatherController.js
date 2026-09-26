const { fetchWeather } = require('../services/weatherService');

// @desc    Get current weather for a city
// @route   GET /api/weather/:city
// @access  Public
const getWeather = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name'
      });
    }

    const weatherData = await fetchWeather(city);

    return res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Error in getWeather controller:', error.message);
    if (error.message === 'City not found') {
      return res.status(404).json({
        success: false,
        message: `City '${req.params.city}' not found`
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching weather info'
    });
  }
};

module.exports = {
  getWeather
};
