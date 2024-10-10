const express = require('express');
const imageController = require('../controllers/imageController');

const router = express.Router();
router.get('/ascend.png', imageController.ascendView);

module.exports = router;