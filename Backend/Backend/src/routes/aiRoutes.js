const express = require('express');
const router = express.Router();
const { getWeatherSummary, getWeatherRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/weather-summary', getWeatherSummary);
router.post('/weather-recommendation', getWeatherRecommendation);

module.exports = router;
