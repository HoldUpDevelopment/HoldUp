const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/images/okayufull.png', imageController.okayuView);
router.get('/images/ascend.png', imageController.ascendView);

module.exports = router;