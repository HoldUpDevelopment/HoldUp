const express = require('express');
const announcementController = require('../controllers/announcementController');

const router = express.Router();

router.post('/createAnnouncement', announcementController.createAnnouncement);

router.put('/editAnnouncement', announcementController.editAnnouncement);

router.delete('/deleteAnnouncement', announcementController.deleteAnnouncement);

router.get('/getAnnouncementDetails', announcementController.getAnnouncementDetails);

module.exports = router;