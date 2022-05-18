const router = require('express').Router( { mergeParams: true } );
const {
    getCheckoutSession,
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');

const { protect, restrictTo } = require('../controllers/authController');


router.get('/checkout-session/:tourId', protect, getCheckoutSession)

router.route('/')
          .get(getAllBookings)
          .post(protect, restrictTo(['admin', 'lead-guide']), createBooking);

router.route('/:id')
          .get(getBooking)
          .patch(protect, restrictTo(['admin', 'lead-guide']), updateBooking)
          .delete(protect, restrictTo(['admin', 'lead-guide']), deleteBooking);

module.exports = router;