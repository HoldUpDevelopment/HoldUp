const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/ascend.png', imageController.ascendView);
router.get('/placeholder.png', imageController.phView);
router.get('/icon.svg', imageController.iconView);
router.get('/stars.svg', imageController.starsView);

module.exports = router;