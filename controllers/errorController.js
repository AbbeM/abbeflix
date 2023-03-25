const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Dublicate field value: '${value}'. Please use another value!`;

  return new AppError(message, 400);
};

const handleVlidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Ogiltig indata. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invaled token! Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has been expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  // A) RENDERED WEBSITE
  console.error('ERROR 💥', err);

  return res.status(err.statusCode).render('error', {
    title: 'Somthing wenth wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // B) Programming or unknown error: don't leak error details
    // Log the error
    console.error('ERROR 💥', err);

    // Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Något gick fel 💥',
    });
  }

  // A) RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somthing wenth wrong',
      msg: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  // Log the error
  console.error('ERROR 💥', err);

  // Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Somthing wenth wrong',
    msg: 'Vänligen försök igen senare',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleVlidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
