const express = require('express');
const routeFeedbackController = require('../controllers/routeFeedbackController');

const router = express.Router();

router.post('/createReview', express.urlencoded({ extended: true }), routeFeedbackController.createReview);

router.put('/editReview', routeFeedbackController.editReview);

router.delete('/deleteReview', routeFeedbackController.deleteReview);

router.get('/getReviewDetails', routeFeedbackController.getReviewDetails);
router.get('/getReviewsOnRoute', routeFeedbackController.getReviewsOnRoute);
router.get('/getReviewCount', routeFeedbackController.getReviewCount);
router.get('/getRouteRating', routeFeedbackController.getRouteRating);
router.get('/getRatingDistribution', routeFeedbackController.getRatingDistribution);

module.exports = router;