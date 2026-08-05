import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to format and handle express-validator errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  // Extract error messages
  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  // Create an ApiError with the validation errors
  const error = new ApiError(400, 'Validation Error', extractedErrors);
  next(error);
};
