const express = require('express');
const userAccountController = require('../controllers/routeManagementController');

const router = express.Router();

router.post('/createRoute', userAccountController.createRoute);
router.post('/archiveRoute', userAccountController.archiveRoute);
router.post('/unarchiveRoute', userAccountController.unarchiveRoute);

router.delete('/deleteLiveRoute', userAccountController.deleteLiveRoute);
router.delete('/deleteArchiveRoute', userAccountController.deleteArchiveRoute);
router.delete('/deleteRoute', userAccountController.deleteRoute);

router.put('/editRouteDetails', userAccountController.editRouteDetails);

router.get('/getRouteDetails', userAccountController.getRouteDetails);
router.get('/getRouteInfo', userAccountController.getRouteInfo);
router.get('/getRouteMapInfo', userAccountController.getRouteMapData);
router.get('/getAuthorRoutes', userAccountController.getAuthorRoutes);

module.exports = router;