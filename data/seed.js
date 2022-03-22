const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: './.env' });

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected for seeding data');
  });

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours.json'), 'utf8')
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8')
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'reviews.json'), 'utf8')
);

async function importData() {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully seeded');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}

async function deleteData() {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
