const { generateSummary, generateRecommendation } = require('../services/aiService');


const getWeatherSummary = async (req, res) => {
  try {
    const { city, temperature, humidity, condition } = req.body;

    if (!city || temperature === undefined || humidity === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: city, temperature, humidity, and condition'
      });
    }

    const summary = await generateSummary(city, Number(temperature), Number(humidity), condition);

    return res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error in getWeatherSummary:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating weather summary'
    });
  }
};


const getWeatherRecommendation = async (req, res) => {
  try {
    const { temperature, condition } = req.body;

    if (temperature === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: temperature and condition'
      });
    }

    const recommendation = await generateRecommendation(Number(temperature), condition);

    return res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('Error in getWeatherRecommendation:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating weather recommendations'
    });
  }
};

module.exports = {
  getWeatherSummary,
  getWeatherRecommendation
};
