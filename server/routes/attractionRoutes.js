const express = require('express');
const router = express.Router();
const { getAttractions } = require('../controllers/attractionController');

router.get('/:city', getAttractions);

module.exports = router;
