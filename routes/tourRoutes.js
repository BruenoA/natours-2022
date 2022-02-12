const router = require('express').Router();
const {
  getAllTours,
  createTour,
  getTour,
  editTour,
  deleteTour,
  checkID,
  checkData,
} = require('../controllers/tourController');

router.get('/', getAllTours);
router.post('/', checkData, createTour);

router.param('id', checkID);
router.get('/:id', getTour);
router.patch('/:id', editTour);
router.delete('/:id', deleteTour);

module.exports = router;
