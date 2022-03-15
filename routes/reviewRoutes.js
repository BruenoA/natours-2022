const router = require('express').Router();
const {
  getAllReviews, 
  getReview, 
  updateReview, 
  createReview, 
  deleteReview
} = require('../controllers/reviewController');

const { protect, restrictTo } = require('../controllers/authController');

router.route('/')
  .get(getAllReviews)
  .post(protect, restrictTo(['user']), createReview)

router.route('/:id')
  .get(getReview)
  .patch(protect, updateReview)
  .delete(protect, deleteReview)
  

module.exports = router;