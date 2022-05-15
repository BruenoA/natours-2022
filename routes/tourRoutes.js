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
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages
} = require('../controllers/tourController');


// router.param('id', checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router.route('/tour-stats')
  .get(getTourStats);

router.route('/monthly-plan/:year')
  .get(protect, restrictTo(['admin', 'lead-guide', 'guide']), getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router.route('/:id')
  .get(getTour)
  .patch(protect, restrictTo(['admin', 'lead-guide']), uploadTourImages, resizeTourImages , editTour)
  .delete(protect, restrictTo(['admin', 'lead-guide']), deleteTour);

router.route('/')
  .get(getAllTours)
  .post(protect, restrictTo(['admin', 'lead-guide']), createTour);



module.exports = router;
