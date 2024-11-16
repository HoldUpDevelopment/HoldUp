const express = require('express');
const homePageController = require('../controllers/homePageController');
const loginFormController = require('../controllers/loginFormController');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();
router.get('/', homePageController.homepageView);
router.get('/styles.css', homePageController.stylesheet);
router.get('/dashboard', homePageController.dashboardView);
router.get('/account/login', loginFormController.loginView);
router.get('/account/signup', loginFormController.signupView);
router.get('/js/signup.js', loginFormController.signupJS);
router.get('/js/login.js', loginFormController.loginJS);
router.get('/js/dashboard.js', dashboardController.dashboardJS);


module.exports = router;