const router = require('express').Router( { mergeParams: true } );
const {
  getAllReviews, 
  getReview, 
  updateReview, 
  createReview, 
  deleteReview,
  createReviewUtil
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router.route('/')
  .get(getAllReviews)
  .post(protect, restrictTo(['user']), createReviewUtil, createReview)

router.route('/:id')
  .get(getReview)
  .patch(protect, updateReview)
  .delete(protect, restrictTo(['user', 'admin']), deleteReview)
  

module.exports = router;