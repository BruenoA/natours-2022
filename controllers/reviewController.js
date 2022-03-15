const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const customizedAsync = require('../utils/customizedAsync');

exports.getAllReviews = customizedAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = customizedAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError(`Review ID ${req.params.id} not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = customizedAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateReview = customizedAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = customizedAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError(`Review ID ${req.params.id} not found`, 404));
  }
  res.status(204).json({
    status: 'success',
  });
});
