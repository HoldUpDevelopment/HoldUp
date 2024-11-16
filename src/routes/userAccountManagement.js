const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();
router.post('/createAccount', userAccountController.createAccount); //Deprecated
router.post('/signup', userAccountController.signup); //Uses urlencoded middleware
router.post('/login', express.json(), userAccountController.login); //Uses json middleware
router.delete('/deleteAccount', userAccountController.deleteAccount);
router.put('/editAccountDetails', userAccountController.editAccountDetails);
router.get('/getUserIdFromUserName', userAccountController.getUserIdFromUserName);
router.get('/getUserIdFromEmail', userAccountController.getUserIdFromEmail);
router.get('/getRoutePacketFromID', userAccountController.getRoutePacketFromID);
router.get('/getForumPacketFromID', userAccountController.getForumPacketFromID);
router.get('/getSettingsFromID', userAccountController.getSettingsFromID);
router.get('/getEmailFromID', userAccountController.getEmailFromID);

module.exports = router;
