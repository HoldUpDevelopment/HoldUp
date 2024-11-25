const express = require('express');
const webRouteController = require('../controllers/webRouteController');
const loginFormController = require('../controllers/loginFormController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();
router.get('/', webRouteController.homepageView);
router.get('/styles.css', webRouteController.stylesheet);
router.get('/settings', webRouteController.settingsView);
router.get('/dashboard', webRouteController.dashboardView);
router.get('/news', webRouteController.announcementView);
router.get('/routes', webRouteController.routeListView);
router.get('/account/login', loginFormController.loginView);
router.get('/account/signup', loginFormController.signupView);
router.get('/js/signup.js', loginFormController.signupJS);
router.get('/js/login.js', loginFormController.loginJS);
router.get('/js/settingsPage.js', settingsController.settingsJS);
router.get('/js/dashboard.js', webRouteController.dashboardJS);
router.get('/js/mainHeader.js', webRouteController.mainHeaderJS);
router.get('/js/buildRouteList.js', webRouteController.buildRouteListJS);
router.get('/js/buildAnnouncementList.js', webRouteController.buildAnnouncementListJS);
router.get('/js/announcementForm.js', webRouteController.announcementFormJS);

module.exports = router;