const router = require('express').Router();

const {
  protect, 
  restrictTo
} = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  editTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');


// router.param('id', checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router.route('/tour-stats')
  .get(getTourStats);

router.route('/monthly-plan/:year')
  .get(getMonthlyPlan);

router.route('/')
  .get(protect, getAllTours)
  .post(createTour);

router.route('/:id')
  .get(getTour)
  .patch(editTour)
  .delete(protect, restrictTo(['admin', 'lead-guide']), deleteTour);

module.exports = router;
