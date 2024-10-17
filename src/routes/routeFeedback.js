const express = require('express');
const routeFeedbackController = require('../controllers/routeFeedbackController');

const router = express.Router();

router.post('/createReview', routeFeedbackController.createReview);

router.put('/editReview', routeFeedbackController.editReview);

router.delete('/deleteReview', routeFeedbackController.deleteReview);

router.get('/getReviewDetails', routeFeedbackController.getReviewDetails);

module.exports = router;