const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name can not be empty'],
    unique: true,
    trim: true,
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
  },
  ratingsAverage: {
    type: Number,
    default: 2.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Price can not be empty'],
  },
  priceDiscount: Number,
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
});

module.exports = mongoose.model('Tour', tourSchema);
