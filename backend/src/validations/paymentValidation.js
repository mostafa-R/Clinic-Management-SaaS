import Joi from "joi";

export const createPaymentSchema = Joi.object({
  invoiceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid invoice ID format",
      "any.required": "Invoice ID is required",
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
  amount: Joi.number().min(0.01).required().messages({
    "number.min": "Payment amount must be greater than 0",
    "any.required": "Payment amount is required",
  }),
  paymentMethod: Joi.string()
    .valid("cash", "card", "bank-transfer", "insurance", "cheque", "other")
    .required()
    .messages({
      "any.only": "Invalid payment method",
      "any.required": "Payment method is required",
    }),
  paymentDate: Joi.date().max("now").required().messages({
    "date.max": "Payment date cannot be in the future",
    "any.required": "Payment date is required",
  }),
  transactionId: Joi.string().allow(""),
  cardDetails: Joi.object({
    last4Digits: Joi.string().pattern(/^\d{4}$/),
    cardType: Joi.string().valid("visa", "mastercard", "amex", "other"),
  }).when("paymentMethod", {
    is: "card",
    then: Joi.object({
      last4Digits: Joi.required(),
    }),
  }),
  notes: Joi.string().allow(""),
});

export const updatePaymentSchema = Joi.object({
  amount: Joi.number().min(0.01).messages({
    "number.min": "Payment amount must be greater than 0",
  }),
  paymentMethod: Joi.string().valid(
    "cash",
    "card",
    "bank-transfer",
    "insurance",
    "cheque",
    "other"
  ),
  transactionId: Joi.string().allow(""),
  status: Joi.string().valid("completed", "pending", "failed", "refunded"),
  notes: Joi.string().allow(""),
});

export const refundPaymentSchema = Joi.object({
  amount: Joi.number().min(0.01).required().messages({
    "number.min": "Refund amount must be greater than 0",
    "any.required": "Refund amount is required",
  }),
  reason: Joi.string().required().messages({
    "any.required": "Refund reason is required",
  }),
  notes: Joi.string().allow(""),
});
