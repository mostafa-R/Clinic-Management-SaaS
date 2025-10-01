import Joi from "joi";

export const objectIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid ID format",
  });

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  sort: Joi.string()
    .valid(
      "createdAt",
      "-createdAt",
      "updatedAt",
      "-updatedAt",
      "name",
      "-name"
    )
    .default("-createdAt")
    .messages({
      "any.only": "Invalid sort field",
    }),
});

export const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).messages({
    "string.min": "Search query must be at least 1 character",
    "string.max": "Search query cannot exceed 100 characters",
  }),
  field: Joi.string().messages({
    "string.base": "Field must be a string",
  }),
});

export const dateRangeSchema = Joi.object({
  startDate: Joi.date().iso().messages({
    "date.base": "Start date must be a valid date",
    "date.format": "Start date must be in ISO format",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).messages({
    "date.base": "End date must be a valid date",
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),
});

export const emailValidation = Joi.string().email().messages({
  "string.email": "Please provide a valid email address",
});

export const phoneValidation = Joi.string()
  .pattern(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{4,10}$/
  )
  .messages({
    "string.pattern.base": "Please provide a valid phone number",
  });

export const urlValidation = Joi.string().uri().messages({
  "string.uri": "Please provide a valid URL",
});

export const passwordValidation = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  });

export const fileUploadSchema = Joi.object({
  mimetype: Joi.string()
    .valid("image/jpeg", "image/png", "image/jpg", "application/pdf")
    .required()
    .messages({
      "any.only": "File must be JPEG, PNG, or PDF",
      "any.required": "File type is required",
    }),
  size: Joi.number()
    .max(10 * 1024 * 1024)
    .messages({
      "number.max": "File size cannot exceed 10MB",
    }),
});

export const statusValidation = Joi.string()
  .valid("active", "inactive", "pending", "completed", "cancelled")
  .messages({
    "any.only": "Invalid status value",
  });

export const booleanValidation = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});
