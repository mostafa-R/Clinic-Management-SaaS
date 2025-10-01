import Joi from "joi";
import { emailValidation, phoneValidation } from "./commonValidation.js";

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  email: emailValidation,
  phone: phoneValidation,
  dateOfBirth: Joi.date().max("now").messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  gender: Joi.string().valid("male", "female", "other").messages({
    "any.only": "Gender must be male, female, or other",
  }),
  address: Joi.object({
    street: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    country: Joi.string().allow(""),
    zipCode: Joi.string().allow(""),
  }),
  avatar: Joi.string().uri().allow("").messages({
    "string.uri": "Please provide a valid avatar URL",
  }),
});

export const updateUserRoleSchema = Joi.object({
  role: Joi.string()
    .valid("patient", "doctor", "nurse", "receptionist", "accountant", "admin")
    .required()
    .messages({
      "any.only": "Invalid role",
      "any.required": "Role is required",
    }),
});

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "any.required": "Status is required",
  }),
});
