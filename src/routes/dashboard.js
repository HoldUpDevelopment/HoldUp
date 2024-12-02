const express = require('express');
const webRouteController = require('../controllers/webRouteController');

const router = express.Router();
router.get('/users.html', webRouteController.dashboard_usersView);

module.exports = router;