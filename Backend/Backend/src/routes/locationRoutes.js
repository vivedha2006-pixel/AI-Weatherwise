const express = require('express');
const router = express.Router();
const {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes below this middleware
router.use(protect);

router.route('/')
  .post(addLocation)
  .get(getLocations);

router.route('/:id')
  .put(updateLocation)
  .delete(deleteLocation);

module.exports = router;
