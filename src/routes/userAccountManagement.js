const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();

router.post('/createAccount', userAccountController.createAccount); //Deprecated

router.delete('/deleteAccount', userAccountController.deleteAccount);

router.put('/editAccountDetails', express.json(), userAccountController.editAccountDetails);

router.get('/getUserIdFromUserName', userAccountController.getUserIdFromUserName);
router.get('/getUserIdFromEmail', userAccountController.getUserIdFromEmail);
router.get('/getRoutePacketFromID', userAccountController.getRoutePacketFromID);
router.get('/getForumPacketFromID', userAccountController.getForumPacketFromID);
router.get('/getUserSettings', userAccountController.getUserSettings);
router.get('/getEmailFromID', userAccountController.getEmailFromID);

module.exports = router;
