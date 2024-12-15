const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/ascend.png', imageController.ascendView);
router.get('/icon.svg', imageController.iconView);
router.get('/placeholder.png', imageController.phView);

module.exports = router;