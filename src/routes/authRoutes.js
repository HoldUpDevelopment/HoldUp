const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();
router.post('/signup', express.urlencoded({ extended: true }), userAccountController.signup); //Uses urlencoded middleware
router.post('/login', express.json(), userAccountController.login); //Uses json middleware

module.exports = router;
