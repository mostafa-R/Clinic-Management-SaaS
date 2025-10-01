import Joi from "joi";

export const createMedicalRecordSchema = Joi.object({
  appointmentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid appointment ID format",
      "any.required": "Appointment ID is required",
    }),
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
  doctorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid doctor ID format",
      "any.required": "Doctor ID is required",
    }),
  visitDate: Joi.date().max("now").required().messages({
    "date.max": "Visit date cannot be in the future",
    "any.required": "Visit date is required",
  }),
  chiefComplaint: Joi.string().required().messages({
    "any.required": "Chief complaint is required",
  }),
  presentIllness: Joi.string().allow(""),
  vitalSigns: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(50).max(250),
      diastolic: Joi.number().min(30).max(150),
    }),
    temperature: Joi.number().min(30).max(45),
    heartRate: Joi.number().min(30).max(200),
    respiratoryRate: Joi.number().min(8).max(50),
    oxygenSaturation: Joi.number().min(0).max(100),
    weight: Joi.number().min(0).max(500),
    height: Joi.number().min(0).max(300),
    bmi: Joi.number().min(0).max(100),
  }),
  physicalExamination: Joi.string().allow(""),
  diagnosis: Joi.array()
    .items(
      Joi.object({
        code: Joi.string(),
        name: Joi.string().required(),
        type: Joi.string().valid("primary", "secondary"),
        notes: Joi.string().allow(""),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one diagnosis is required",
      "any.required": "Diagnosis is required",
    }),
  treatment: Joi.object({
    medications: Joi.array().items(Joi.string()),
    procedures: Joi.array().items(Joi.string()),
    instructions: Joi.string().allow(""),
  }),
  labTests: Joi.array().items(
    Joi.object({
      testName: Joi.string().required(),
      result: Joi.string().allow(""),
      normalRange: Joi.string().allow(""),
      status: Joi.string().valid("pending", "completed", "cancelled"),
      notes: Joi.string().allow(""),
    })
  ),
  notes: Joi.string().allow(""),
  followUpDate: Joi.date().min("now").allow(null).messages({
    "date.min": "Follow-up date cannot be in the past",
  }),
  followUpInstructions: Joi.string().allow(""),
  referrals: Joi.array().items(
    Joi.object({
      speciality: Joi.string().required(),
      doctorName: Joi.string(),
      reason: Joi.string().required(),
      notes: Joi.string().allow(""),
    })
  ),
});

export const updateMedicalRecordSchema = Joi.object({
  chiefComplaint: Joi.string(),
  presentIllness: Joi.string().allow(""),
  vitalSigns: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(50).max(250),
      diastolic: Joi.number().min(30).max(150),
    }),
    temperature: Joi.number().min(30).max(45),
    heartRate: Joi.number().min(30).max(200),
    respiratoryRate: Joi.number().min(8).max(50),
    oxygenSaturation: Joi.number().min(0).max(100),
    weight: Joi.number().min(0).max(500),
    height: Joi.number().min(0).max(300),
    bmi: Joi.number().min(0).max(100),
  }),
  physicalExamination: Joi.string().allow(""),
  diagnosis: Joi.array().items(
    Joi.object({
      code: Joi.string(),
      name: Joi.string().required(),
      type: Joi.string().valid("primary", "secondary"),
      notes: Joi.string().allow(""),
    })
  ),
  treatment: Joi.object({
    medications: Joi.array().items(Joi.string()),
    procedures: Joi.array().items(Joi.string()),
    instructions: Joi.string().allow(""),
  }),
  labTests: Joi.array().items(
    Joi.object({
      testName: Joi.string().required(),
      result: Joi.string().allow(""),
      normalRange: Joi.string().allow(""),
      status: Joi.string().valid("pending", "completed", "cancelled"),
      notes: Joi.string().allow(""),
    })
  ),
  notes: Joi.string().allow(""),
  followUpDate: Joi.date().min("now").allow(null).messages({
    "date.min": "Follow-up date cannot be in the past",
  }),
  followUpInstructions: Joi.string().allow(""),
  referrals: Joi.array().items(
    Joi.object({
      speciality: Joi.string().required(),
      doctorName: Joi.string(),
      reason: Joi.string().required(),
      notes: Joi.string().allow(""),
    })
  ),
});
