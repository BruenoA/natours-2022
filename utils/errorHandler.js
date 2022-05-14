const AppError = require('./appError');

const sendErrorDev = (err,req, res) => {
  //API
  if(req.originalUrl.startsWith('./api')){
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  console.error('*** Occured error: ', err);
    //Rendered Website
  return res.status(err.statusCode).render('error',{
      title: 'Something went wrong!',
      msg: err.message
  });
};

const sendErorProd = (err,req, res) => {
  //API
  if(req.originalUrl.startsWith('./api')){
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    console.error('*** Occured error: ', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  //RENDER WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error',{
      title: 'Something went wrong!',
      msg: err.message
    });
  } 
  console.error('*** Occured error: ', err);
  return res.status(err.statusCode).render('error',{
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleFieldError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `Duplicate field value: ${value}. Consider use another!`,
    400
  );
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid token. Please login again!', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Token expired. Please login again!', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Unknown internal error';

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err,req, res);
  } else {
    let error =err;
    //error.message = err.message;
    switch (err.name) {
      case 'CastError':
        error = handleCastError(err);
        break;
      case 'ValidationError':
        error = handleValidationError(err);
        break;
      case 'JsonWebTokenError':
        error = handleJsonWebTokenError();
        break;
      case 'TokenExpiredError':
        error = handleTokenExpiredError();
        break;
      default:
        break;
    }

    if (err.code === 11000) {
      error = handleFieldError(err);
    }

    sendErorProd(error,req, res);
  }
};
