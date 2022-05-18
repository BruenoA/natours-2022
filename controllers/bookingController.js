const stripe = require('stripe')('sk_test_51L02RKDUB6UkDXCU1i0sDIZkoNNzT8axAKdW8kOLBzwe6i0Lv7ZppcmnDXCKBkQepD92H1dyzQlW3jOLjMOY4MYM00xXLcADdb');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const customizedAsync = require('../utils/customizedAsync');
const Factory = require('./controllerFactory');


exports.getCheckoutSession = customizedAsync(async (req, res, next)=> {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url : `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id : req.params.tourId,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100,
                currency: 'usd',
                quantity: 1 
            }
        ]
    });

    res.status(200).json({
        status: 'success',
        session
    });
});

exports.createBookingCheckout = customizedAsync(async (req, res, next) => {
    const {tour, user, price} = req.query;
    if(!tour && !user && !price) return next();
    await Booking.create({tour, user, price});

    res.redirect(req.originalUrl.split('?')[0]);
})

exports.getAllBookings = customizedAsync(async (req, res, next) => {
    const features = new ApiFeatures(Booking.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
    const bookings = await features.query;
  
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
      },
    });
  });
  


exports.createBooking = Factory.createOne(Booking);
exports.getBooking = Factory.getOne(Booking);
exports.updateBooking = Factory.updateOne(Booking);
exports.deleteBooking = Factory.deleteOne(Booking);