const router = require('express').Router();
const {protect, restrictTo} = require('../controllers/authController');
const {
  aliasTopTours,
  getAllTours,
  checkBody,
  getTour,
  createTour,
  editTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');


// router.param('id', checkID);

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
