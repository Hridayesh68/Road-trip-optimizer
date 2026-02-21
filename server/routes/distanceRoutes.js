const express = require('express');
const router = express.Router();
const { calculateDistance } = require('../controllers/distanceController');

router.post('/', calculateDistance);

module.exports = router;
