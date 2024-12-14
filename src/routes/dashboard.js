const express = require('express');
const webRouteController = require('../controllers/webRouteController');

const router = express.Router();
router.get('/users.html', webRouteController.dashboard_usersView);
router.get('/routes.html', webRouteController.dashboard_routesView);
router.get('/archive.html', webRouteController.dashboard_archiveView);
router.get('/posts.html', webRouteController.dashboard_postsView);

module.exports = router;