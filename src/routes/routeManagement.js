const express = require('express');
const routeManagementController = require('../controllers/routeManagementController');

const router = express.Router();

router.post('/createRoute', express.urlencoded({ extended: true }), routeManagementController.createRoute);
router.post('/archiveRoute', express.json(), routeManagementController.archiveRoute);
router.post('/unarchiveRoute', express.json(), routeManagementController.unarchiveRoute);

router.delete('/deleteLiveRoute', routeManagementController.deleteLiveRoute);
router.delete('/deleteArchivedRoute', routeManagementController.deleteArchivedRoute);

router.put('/editRouteDetails', express.urlencoded({ extended: true }), routeManagementController.editRouteDetails);

router.get('/getLiveRoutes', routeManagementController.getLiveRoutes);
router.get('/getArchivedRoutes', routeManagementController.getArchiveRoutes);
router.get('/getRouteDetails', routeManagementController.getRouteDetails);
router.get('/getRouteInfo', routeManagementController.getRouteInfo);
router.get('/getRouteMapData', routeManagementController.getRouteMapData);
router.get('/getAuthorRoutes', routeManagementController.getAuthorRoutes);

module.exports = router;