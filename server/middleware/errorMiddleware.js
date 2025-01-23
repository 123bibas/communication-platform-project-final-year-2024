const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  //Mongoose bad  ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with the id ofn ${error.value}`
    error = new ErrorResponse(message, 404)
  }
  //Mongoose Duplicate key
  if (err.code === 11000) {
    // handle the duplicate key error
    const { keyValue } = error;
    const fields = Object.keys(keyValue).join(', ');
    const message = `Duplicate : ${fields}`;
    error = new ErrorResponse(message, 400)
  }
  if (err.name == 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message)
    error = new ErrorResponse(message, 400)
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  })
}
module.exports = errorHandler