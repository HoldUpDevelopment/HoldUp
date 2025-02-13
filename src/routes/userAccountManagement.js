const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();
router.post('/createAccount', userAccountController.createAccount); //Deprecated
router.delete('/deleteAccount', express.json(), userAccountController.deleteAccount);
router.put('/editAccountDetails', express.json(), userAccountController.editAccountDetails);
router.put('/editUserRole', express.json(), userAccountController.editUserRole);
router.get('/getUserIdFromUserName', userAccountController.getUserIdFromUserName);
router.get('/getUserIdFromEmail', userAccountController.getUserIdFromEmail);
router.get('/getRoutePacketFromID', userAccountController.getRoutePacketFromID);
router.get('/getForumPacketFromID', userAccountController.getForumPacketFromID);
router.get('/getUserSettings', userAccountController.getUserSettings);
router.get('/getEmailFromID', userAccountController.getEmailFromID);
router.get('/getActiveUserRole', userAccountController.getActiveUserRole);
router.get('/getUsers', userAccountController.getUsers);

module.exports = router;
