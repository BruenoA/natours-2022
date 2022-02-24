const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name can not be empty'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'Duration can not be empty'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Max group size can not be empty'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty can not be empty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 2.5,
      min: [1.0, 'Minimum rating is 1.0'],
      max: [5.0, 'Maximum rating is 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price can not be empty'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) can not exceed origin price',
      },
      summary: {
        type: String,
        trim: true,
        required: [true, 'Summary can not be empty'],
      },
      description: {
        type: String,
        trim: true,
      },
      imageCover: {
        type: String,
        required: [true, 'Image can not be empty'],
      },
      images: [String],
      createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
      },
      startDates: [Date],
      secretTour: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {

//   next()
// })

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Tour', tourSchema);
