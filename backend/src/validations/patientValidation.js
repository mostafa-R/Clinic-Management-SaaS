import Joi from "joi";
import { emailValidation, phoneValidation } from "./commonValidation.js";

/**
 * Create patient validation schema
 */
export const createPatientSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format",
      "any.required": "User ID is required",
    }),
  clinicId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid clinic ID format",
      "any.required": "Clinic ID is required",
    }),
  dateOfBirth: Joi.date().max("now").required().messages({
    "date.max": "Date of birth cannot be in the future",
    "any.required": "Date of birth is required",
  }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "Gender must be male, female, or other",
    "any.required": "Gender is required",
  }),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .messages({
      "any.only": "Invalid blood group",
    }),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: phoneValidation.required(),
    email: emailValidation,
  }),
  medicalHistory: Joi.object({
    allergies: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        severity: Joi.string().valid("mild", "moderate", "severe"),
        notes: Joi.string().allow(""),
      })
    ),
    chronicDiseases: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        diagnosedDate: Joi.date(),
        notes: Joi.string().allow(""),
      })
    ),
    surgeries: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        date: Joi.date(),
        hospital: Joi.string(),
        notes: Joi.string().allow(""),
      })
    ),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string(),
        frequency: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        prescribedBy: Joi.string(),
      })
    ),
    familyHistory: Joi.array().items(
      Joi.object({
        condition: Joi.string().required(),
        relationship: Joi.string(),
        notes: Joi.string().allow(""),
      })
    ),
  }),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    groupNumber: Joi.string(),
    expiryDate: Joi.date(),
    coverageDetails: Joi.string().allow(""),
  }),
  notes: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string()),
});

/**
 * Update patient validation schema
 */
export const updatePatientSchema = Joi.object({
  dateOfBirth: Joi.date().max("now").messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  gender: Joi.string().valid("male", "female", "other").messages({
    "any.only": "Gender must be male, female, or other",
  }),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .messages({
      "any.only": "Invalid blood group",
    }),
  emergencyContact: Joi.object({
    name: Joi.string(),
    relationship: Joi.string(),
    phone: phoneValidation,
    email: emailValidation,
  }),
  medicalHistory: Joi.object({
    allergies: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        severity: Joi.string().valid("mild", "moderate", "severe"),
        notes: Joi.string().allow(""),
      })
    ),
    chronicDiseases: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        diagnosedDate: Joi.date(),
        notes: Joi.string().allow(""),
      })
    ),
    surgeries: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        date: Joi.date(),
        hospital: Joi.string(),
        notes: Joi.string().allow(""),
      })
    ),
    medications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string(),
        frequency: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        prescribedBy: Joi.string(),
      })
    ),
    familyHistory: Joi.array().items(
      Joi.object({
        condition: Joi.string().required(),
        relationship: Joi.string(),
        notes: Joi.string().allow(""),
      })
    ),
  }),
  insurance: Joi.object({
    provider: Joi.string(),
    policyNumber: Joi.string(),
    groupNumber: Joi.string(),
    expiryDate: Joi.date(),
    coverageDetails: Joi.string().allow(""),
  }),
  notes: Joi.string().allow(""),
  tags: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
});
