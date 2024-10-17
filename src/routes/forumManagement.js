const express = require('express');
const forumManagementController = require('../controllers/forumManagementController');

const router = express.Router();

router.post('/createForumPost', forumManagementController.createForumPost);
router.post('/createForumReply', forumManagementController.createForumReply);

router.put('/editForumPost', forumManagementController.editForumPost);
router.put('/editReply', forumManagementController.editReply);

router.delete('/deleteForumPost', forumManagementController.deleteForumPost);
router.delete('/deleteReply', forumManagementController.deleteReply);

router.get('/getForumPostDetails', forumManagementController.getForumPostDetails);
router.get('/getPostInteractions', forumManagementController.getPostInteractions);
router.get('/getReplyDetails', forumManagementController.getReplyDetails);
router.get('/getReplyInteractions', forumManagementController.getReplyInteractions);

module.exports = router;