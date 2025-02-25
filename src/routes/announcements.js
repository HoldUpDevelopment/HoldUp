const express = require('express');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

router.post('/createAnnouncement', express.urlencoded({ extended: true }), announcementController.createAnnouncement);

router.put('/editAnnouncement', express.urlencoded({ extended: true }), announcementController.editAnnouncement);

router.delete('/deleteAnnouncement', announcementController.deleteAnnouncement);

router.get('/getAnnouncementDetails', announcementController.getAnnouncementDetails);

router.get('/getAnnouncementList', announcementController.getAnnouncementList);

module.exports = router;