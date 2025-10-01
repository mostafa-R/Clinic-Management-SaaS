import { validationErrorResponse } from "../utils/apiResponse.js";

/**
 * Validation middleware
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Request property to validate (body, params, query)
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return validationErrorResponse(res, errors);
    }

    req[property] = value;
    next();
  };
};

/**
 * Multi-source validation middleware
 * Validates multiple request properties at once
 * @param {Object} schemas - Object with schemas for different properties
 * @example validateMultiple({ body: registerSchema, query: paginationSchema })
 */
export const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = {};

    for (const [property, schema] of Object.entries(schemas)) {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors[`${property}.${detail.path[0]}`] = detail.message;
        });
      } else {
        req[property] = value;
      }
    }

    if (Object.keys(errors).length > 0) {
      return validationErrorResponse(res, errors);
    }

    next();
  };
};
