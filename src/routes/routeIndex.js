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
router.get('/archive', webRouteController.archiveView);
router.get('/account/login', loginFormController.loginView);
router.get('/account/signup', loginFormController.signupView);
router.get('/js/signup.js', loginFormController.signupJS);
router.get('/js/login.js', loginFormController.loginJS);
router.get('/js/settingsPage.js', settingsController.settingsJS);
router.get('/js/dashboard.js', webRouteController.dashboardJS);
router.get('/js/mainHeader.js', webRouteController.mainHeaderJS);
router.get('/js/buildLiveRouteList.js', webRouteController.buildLiveRouteListJS);
router.get('/js/buildArchiveRouteList.js', webRouteController.buildArchiveRouteListJS);
router.get('/js/buildAnnouncementList.js', webRouteController.buildAnnouncementListJS);
router.get('/js/announcementForm.js', webRouteController.announcementFormJS);
router.get('/js/buildUserDash.js', webRouteController.buildUserDashJS);
router.get('/js/buildRouteDash.js', webRouteController.buildRouteDashJS);
router.get('/js/buildArchiveDash.js', webRouteController.buildArchiveDashJS);
router.get('/js/buildAnnouncementDash.js', webRouteController.buildAnnouncementDashJS)
router.get('/js/reviewForm.js',  webRouteController.reviewFormJS)
module.exports = router;