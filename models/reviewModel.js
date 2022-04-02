const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* Index for avoiding duplicate reviews */
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

/* Populate review referential data */
reviewSchema.pre(/^find/, function (next) {
  this.find().populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

/* Static function to calculate average rating*/
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 0,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.preUpdatedReview = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  /* At this time, the review is updated but not saved */
  await this.preUpdatedReview.constructor.calcAverageRatings(
    this.preUpdatedReview.tour
  );
});

module.exports = mongoose.model('Review', reviewSchema);
