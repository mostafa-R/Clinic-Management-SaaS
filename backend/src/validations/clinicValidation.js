import Joi from "joi";
import { emailValidation, phoneValidation } from "./commonValidation.js";

/**
 * Create clinic validation schema
 */
export const createClinicSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Clinic name must be at least 2 characters",
    "string.max": "Clinic name cannot exceed 100 characters",
    "any.required": "Clinic name is required",
  }),
  email: emailValidation.required(),
  phone: phoneValidation.required(),
  address: Joi.object({
    street: Joi.string().required().messages({
      "any.required": "Street address is required",
    }),
    city: Joi.string().required().messages({
      "any.required": "City is required",
    }),
    state: Joi.string().required().messages({
      "any.required": "State is required",
    }),
    country: Joi.string().required().messages({
      "any.required": "Country is required",
    }),
    zipCode: Joi.string().required().messages({
      "any.required": "Zip code is required",
    }),
  }).required(),
  website: Joi.string().uri().allow("", null).messages({
    "string.uri": "Please provide a valid website URL",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  specializations: Joi.array().items(Joi.string()).messages({
    "array.base": "Specializations must be an array",
  }),
  operatingHours: Joi.object({
    monday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    friday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    sunday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
  }),
  settings: Joi.object({
    appointmentDuration: Joi.number().min(5).max(180),
    currency: Joi.string().length(3),
    timezone: Joi.string(),
    language: Joi.string(),
  }),
});

/**
 * Update clinic validation schema
 */
export const updateClinicSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.min": "Clinic name must be at least 2 characters",
    "string.max": "Clinic name cannot exceed 100 characters",
  }),
  email: emailValidation,
  phone: phoneValidation,
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string(),
    zipCode: Joi.string(),
  }),
  website: Joi.string().uri().allow("", null).messages({
    "string.uri": "Please provide a valid website URL",
  }),
  description: Joi.string().max(500).allow("", null).messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  specializations: Joi.array().items(Joi.string()),
  logo: Joi.string().uri().allow("", null),
  operatingHours: Joi.object({
    monday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    tuesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    wednesday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    thursday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    friday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    saturday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
    sunday: Joi.object({
      open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      closed: Joi.boolean(),
    }),
  }),
  settings: Joi.object({
    appointmentDuration: Joi.number().min(5).max(180),
    currency: Joi.string().length(3),
    timezone: Joi.string(),
    language: Joi.string(),
  }),
  isActive: Joi.boolean(),
});

/**
 * Add staff member validation schema
 */
export const addStaffSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format",
      "any.required": "User ID is required",
    }),
  role: Joi.string()
    .valid("doctor", "nurse", "receptionist", "accountant")
    .required()
    .messages({
      "any.only": "Invalid role",
      "any.required": "Role is required",
    }),
  specialization: Joi.string().when("role", {
    is: "doctor",
    then: Joi.string().required(),
  }),
  licenseNumber: Joi.string().when("role", {
    is: "doctor",
    then: Joi.string().required(),
  }),
});
