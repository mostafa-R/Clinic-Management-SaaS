import Joi from "joi";

/**
 * Create appointment validation schema
 */
export const createAppointmentSchema = Joi.object({
  clinicId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid clinic ID format",
      "any.required": "Clinic ID is required",
    }),
  patientId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid patient ID format",
      "any.required": "Patient ID is required",
    }),
  doctorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid doctor ID format",
      "any.required": "Doctor ID is required",
    }),
  scheduledDate: Joi.date().min("now").required().messages({
    "date.min": "Scheduled date cannot be in the past",
    "any.required": "Scheduled date is required",
  }),
  scheduledTime: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format",
        "any.required": "Start time is required",
      }),
    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "End time must be in HH:MM format",
        "any.required": "End time is required",
      }),
  }).required(),
  duration: Joi.number().min(5).max(180).default(30).messages({
    "number.min": "Duration must be at least 5 minutes",
    "number.max": "Duration cannot exceed 180 minutes",
  }),
  type: Joi.string()
    .valid("consultation", "follow-up", "emergency", "check-up", "telemedicine")
    .default("consultation")
    .messages({
      "any.only": "Invalid appointment type",
    }),
  reason: Joi.string().required().messages({
    "any.required": "Reason for appointment is required",
  }),
  symptoms: Joi.array().items(Joi.string()),
  notes: Joi.string().allow(""),
  bookingSource: Joi.string()
    .valid("online", "phone", "walk-in", "staff")
    .default("staff")
    .messages({
      "any.only": "Invalid booking source",
    }),
});

/**
 * Update appointment validation schema
 */
export const updateAppointmentSchema = Joi.object({
  scheduledDate: Joi.date().min("now").messages({
    "date.min": "Scheduled date cannot be in the past",
  }),
  scheduledTime: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format",
      }),
    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "End time must be in HH:MM format",
      }),
  }),
  duration: Joi.number().min(5).max(180).messages({
    "number.min": "Duration must be at least 5 minutes",
    "number.max": "Duration cannot exceed 180 minutes",
  }),
  type: Joi.string()
    .valid("consultation", "follow-up", "emergency", "check-up", "telemedicine")
    .messages({
      "any.only": "Invalid appointment type",
    }),
  status: Joi.string()
    .valid(
      "scheduled",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
      "rescheduled"
    )
    .messages({
      "any.only": "Invalid status",
    }),
  reason: Joi.string(),
  symptoms: Joi.array().items(Joi.string()),
  notes: Joi.string().allow(""),
});

/**
 * Cancel appointment validation schema
 */
export const cancelAppointmentSchema = Joi.object({
  cancelReason: Joi.string().required().messages({
    "any.required": "Cancel reason is required",
  }),
});

/**
 * Reschedule appointment validation schema
 */
export const rescheduleAppointmentSchema = Joi.object({
  newDate: Joi.date().min("now").required().messages({
    "date.min": "New date cannot be in the past",
    "any.required": "New date is required",
  }),
  newTime: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format",
        "any.required": "Start time is required",
      }),
    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "End time must be in HH:MM format",
        "any.required": "End time is required",
      }),
  }).required(),
});
