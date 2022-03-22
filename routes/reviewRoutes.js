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

router.use(protect);

router.route('/')
  .get(getAllReviews)
  .post(restrictTo(['user']), createReviewUtil, createReview);

router.route('/:id')
  .get(getReview)
  .patch(restrictTo(['user', 'admin']), updateReview)
  .delete(restrictTo(['user', 'admin']), deleteReview);
  

module.exports = router;