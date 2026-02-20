const express = require('express');
const router = express.Router();
const { optimizeTrip, getTrips, saveTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/optimize', optimizeTrip);
router.get('/', protect, getTrips);
router.post('/', protect, saveTrip);

module.exports = router;
