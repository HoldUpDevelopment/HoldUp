const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/ascend.png', imageController.ascendView);
router.get('/icon.svg', imageController.iconView);

module.exports = router;