const express = require('express');
const userAccountController = require('../controllers/userAccountController');
const auth = require('../models/auth');

const router = express.Router();
router.post('/signup', express.urlencoded({ extended: true }), userAccountController.signup); //Uses urlencoded middleware
router.post('/login', express.json(), userAccountController.login); //Uses json middleware
router.get('/grabUserId', auth.retrieveUserID)

module.exports = router;
