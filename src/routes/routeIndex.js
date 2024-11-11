const express = require('express');
const homePageController = require('../controllers/homePageController');
const loginFormController = require('../controllers/loginFormController');

const router = express.Router();
router.get('/', homePageController.homepageView);
router.get('/styles.css', homePageController.stylesheet);
router.get('/account/login', loginFormController.loginView);
router.get('/account/signup', loginFormController.signupView);


module.exports = router;