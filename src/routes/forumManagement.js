const express = require('express');
const forumManagementController = require('../controllers/forumManagementController');

const router = express.Router();

router.post('/createPost', forumManagementController.createForumPost);
router.post('/createReply', forumManagementController.createForumReply);

router.put('/editPost', forumManagementController.editForumPost);
router.put('/editReply', forumManagementController.editReply);

router.delete('/deletePost', forumManagementController.deleteForumPost);
router.delete('/deleteReply', forumManagementController.deleteReply);

router.get('/getPostDetails', forumManagementController.getForumPostDetails);
router.get('/getPostInteractions', forumManagementController.getPostInteractions);
router.get('/getReplyDetails', forumManagementController.getReplyDetails);
router.get('/getReplyInteractions', forumManagementController.getReplyInteractions);

module.exports = router;