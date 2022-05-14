const express = require('express');
const multer = require('multer')
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoSanitizer = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const toursRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const ErrorHandler = require('./utils/errorHandler');

/* Config */
require('dotenv').config({ path: './.env' });

/* App */
const app = express();

app.set('view engine', 'pug');
app.set('views' , path.join(__dirname, 'views'));

/* Logging */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

/* Request limit */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again later',
});

/* Cross origin resource sharing */
app.use(cors());

/* Set secure http headers */
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js","js.stripe.com/v3/",'unsafe-inline','unsafe-eval'],
      "style-src": ["'self'","fonts.googleapis.com/css",'unsafe-inline','unsafe-eval'],
    },
  })
);

/* Server static files */
app.use(express.static(path.join(__dirname, 'public')));

/* Parse post data to body */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit:'10kb' }));
app.use(cookieParser());

/* Database connection */
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

/* Data sanitizer */
app.use(mongoSanitizer());
app.use(xss());

/* Parameter pollution prevention */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

/* Routing */
app.use('/api', limiter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', userRouter);

/* Error handling */
app.all('*', (req, res, next) => {
  next(new AppError('Invalid page requested', 404));
});
app.use(ErrorHandler);

/* Server */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`${process.env.NODE_ENV} server started on port ${PORT}`);
});

/* Unhandled rejection handling */
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Shutting down due to unhandledRejection...');
  server.close(() => {
    process.exit(1);
  });
});

//CSP
