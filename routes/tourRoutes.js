const router = require('express').Router();
const {
  aliasTopTours,
  getAllTours,
  checkBody,
  getTour,
  createTour,
  editTour,
  deleteTour,
  getTourStats
} = require('../controllers/tourController');

// router.param('id', checkID);

router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router.route('/tour-stats')
  .get(getTourStats);

router.route('/')
  .get(getAllTours)
  .post(checkBody, createTour);

router.route('/:id')
  .get(getTour)
  .patch(editTour)
  .delete(deleteTour);

module.exports = router;
