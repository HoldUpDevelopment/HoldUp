const express = require('express');
const homePageController = require('../controllers/homePageController');
const loginFormController = require('../controllers/loginFormController');
const loginFormController = require('../controllers/loginFormController');

const router = express.Router();
router.get('/', homePageController.homepageView);
router.get('/styles.css', homePageController.stylesheet);
router.get('/dashboard', homePageController.dashboardView);
router.get('/login', loginFormController.loginView);


module.exports = router;