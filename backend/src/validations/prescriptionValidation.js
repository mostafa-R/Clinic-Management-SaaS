import Joi from "joi";

export const createPrescriptionSchema = Joi.object({
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
  medicalRecordId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid medical record ID format",
    }),
  prescriptionDate: Joi.date().max("now").required().messages({
    "date.max": "Prescription date cannot be in the future",
    "any.required": "Prescription date is required",
  }),
  medications: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "any.required": "Medication name is required",
        }),
        genericName: Joi.string().allow(""),
        dosage: Joi.string().required().messages({
          "any.required": "Dosage is required",
        }),
        frequency: Joi.string().required().messages({
          "any.required": "Frequency is required",
        }),
        duration: Joi.string().required().messages({
          "any.required": "Duration is required",
        }),
        route: Joi.string()
          .valid("oral", "topical", "injection", "inhalation", "other")
          .messages({
            "any.only": "Invalid route",
          }),
        instructions: Joi.string().allow(""),
        quantity: Joi.number().min(1).messages({
          "number.min": "Quantity must be at least 1",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one medication is required",
      "any.required": "Medications are required",
    }),
  diagnosis: Joi.string().required().messages({
    "any.required": "Diagnosis is required",
  }),
  notes: Joi.string().allow(""),
  validUntil: Joi.date().min("now").allow(null).messages({
    "date.min": "Valid until date cannot be in the past",
  }),
  refillsAllowed: Joi.number().min(0).max(10).default(0).messages({
    "number.min": "Refills cannot be negative",
    "number.max": "Maximum 10 refills allowed",
  }),
});

export const updatePrescriptionSchema = Joi.object({
  medications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      genericName: Joi.string().allow(""),
      dosage: Joi.string().required(),
      frequency: Joi.string().required(),
      duration: Joi.string().required(),
      route: Joi.string().valid(
        "oral",
        "topical",
        "injection",
        "inhalation",
        "other"
      ),
      instructions: Joi.string().allow(""),
      quantity: Joi.number().min(1),
    })
  ),
  diagnosis: Joi.string(),
  notes: Joi.string().allow(""),
  status: Joi.string().valid("active", "completed", "cancelled"),
  validUntil: Joi.date().min("now").allow(null).messages({
    "date.min": "Valid until date cannot be in the past",
  }),
  refillsAllowed: Joi.number().min(0).max(10).messages({
    "number.min": "Refills cannot be negative",
    "number.max": "Maximum 10 refills allowed",
  }),
});

export const refillPrescriptionSchema = Joi.object({
  reason: Joi.string().allow(""),
});
