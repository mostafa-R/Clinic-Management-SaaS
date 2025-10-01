import Joi from "joi";

export const createDocumentSchema = Joi.object({
  patientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid patient ID format",
      "any.required": "Patient ID is required",
    }),
  clinicId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid clinic ID format",
      "any.required": "Clinic ID is required",
    }),
  appointmentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid appointment ID format",
    }),
  medicalRecordId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid medical record ID format",
    }),
  title: Joi.string().min(2).max(200).required().messages({
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  category: Joi.string()
    .valid(
      "lab-result",
      "imaging",
      "prescription",
      "insurance",
      "consent-form",
      "report",
      "other"
    )
    .required()
    .messages({
      "any.only": "Invalid category",
      "any.required": "Category is required",
    }),
  fileUrl: Joi.string().uri().required().messages({
    "string.uri": "Please provide a valid file URL",
    "any.required": "File URL is required",
  }),
  fileName: Joi.string().required().messages({
    "any.required": "File name is required",
  }),
  fileSize: Joi.number().min(0).required().messages({
    "number.min": "File size cannot be negative",
    "any.required": "File size is required",
  }),
  mimeType: Joi.string().required().messages({
    "any.required": "File type is required",
  }),
  tags: Joi.array().items(Joi.string()),
});

export const updateDocumentSchema = Joi.object({
  title: Joi.string().min(2).max(200).messages({
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 200 characters",
  }),
  description: Joi.string().max(500).allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  category: Joi.string().valid(
    "lab-result",
    "imaging",
    "prescription",
    "insurance",
    "consent-form",
    "report",
    "other"
  ),
  tags: Joi.array().items(Joi.string()),
});
