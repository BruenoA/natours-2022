const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
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
  fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf8')
);

async function importData() {
  try {
    await Tour.create(tours);
    console.log('Data successfully seeded');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
}

async function deleteData() {
  try {
    await Tour.deleteMany();
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
