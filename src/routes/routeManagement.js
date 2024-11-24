const express = require('express');
const routeManagementController = require('../controllers/routeManagementController');

const router = express.Router();

router.post('/createRoute', routeManagementController.createRoute);
router.post('/archiveRoute', routeManagementController.archiveRoute);
router.post('/unarchiveRoute', routeManagementController.unarchiveRoute);

router.delete('/deleteLiveRoute', routeManagementController.deleteLiveRoute);
router.delete('/deleteArchiveRoute', routeManagementController.deleteArchiveRoute);

router.put('/editRouteDetails', routeManagementController.editRouteDetails);

router.get('/getLiveRoutes', routeManagementController.getLiveRoutes);
router.get('/getRouteDetails', routeManagementController.getRouteDetails);
router.get('/getRouteInfo', routeManagementController.getRouteInfo);
router.get('/getRouteMapData', routeManagementController.getRouteMapData);
router.get('/getAuthorRoutes', routeManagementController.getAuthorRoutes);

module.exports = router;