import Joi from "joi";

export const createNotificationSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid user ID format",
      "any.required": "User ID is required",
    }),
  title: Joi.string().min(2).max(200).required().messages({
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 200 characters",
    "any.required": "Title is required",
  }),
  message: Joi.string().min(2).max(1000).required().messages({
    "string.min": "Message must be at least 2 characters",
    "string.max": "Message cannot exceed 1000 characters",
    "any.required": "Message is required",
  }),
  type: Joi.string()
    .valid(
      "appointment",
      "prescription",
      "payment",
      "document",
      "system",
      "reminder",
      "alert"
    )
    .required()
    .messages({
      "any.only": "Invalid notification type",
      "any.required": "Type is required",
    }),
  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .default("medium")
    .messages({
      "any.only": "Invalid priority level",
    }),
  relatedId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      "string.pattern.base": "Invalid related ID format",
    }),
  relatedModel: Joi.string()
    .valid(
      "Appointment",
      "Prescription",
      "Invoice",
      "Payment",
      "Document",
      "MedicalRecord"
    )
    .allow(null)
    .messages({
      "any.only": "Invalid related model",
    }),
  actionUrl: Joi.string().allow(""),
  expiresAt: Joi.date().min("now").allow(null).messages({
    "date.min": "Expiry date cannot be in the past",
  }),
});

export const markAsReadSchema = Joi.object({
  notificationIds: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base": "Invalid notification ID format",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one notification ID is required",
      "any.required": "Notification IDs are required",
    }),
});
