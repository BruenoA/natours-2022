const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const toursRouter = require('./routes/tourRoutes');
const morgan = require('morgan');

require('dotenv').config({ path: './.env' });
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected');
  });

app.use('/api/v1/tours', toursRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `${process.env.NODE_ENV} server started on port ${process.env.PORT || 3000}`
  );
});
