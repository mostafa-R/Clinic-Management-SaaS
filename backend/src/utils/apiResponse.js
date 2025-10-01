/**
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} data
 */
export const successResponse = (res, statusCode = 200, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} errors
 */
export const errorResponse = (
  res,
  statusCode = 500,
  message,
  errors = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * @param {Object} res
 * @param {Object} errors
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};
