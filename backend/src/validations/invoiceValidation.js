import Joi from "joi";

export const createInvoiceSchema = Joi.object({
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
  invoiceDate: Joi.date().max("now").required().messages({
    "date.max": "Invoice date cannot be in the future",
    "any.required": "Invoice date is required",
  }),
  dueDate: Joi.date().min(Joi.ref("invoiceDate")).required().messages({
    "date.min": "Due date cannot be before invoice date",
    "any.required": "Due date is required",
  }),
  items: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required().messages({
          "any.required": "Item description is required",
        }),
        category: Joi.string()
          .valid(
            "consultation",
            "procedure",
            "medication",
            "lab-test",
            "imaging",
            "other"
          )
          .default("other")
          .messages({
            "any.only": "Invalid item category",
          }),
        quantity: Joi.number().min(1).required().messages({
          "number.min": "Quantity must be at least 1",
          "any.required": "Quantity is required",
        }),
        unitPrice: Joi.number().min(0).required().messages({
          "number.min": "Unit price cannot be negative",
          "any.required": "Unit price is required",
        }),
        discount: Joi.number().min(0).max(100).default(0).messages({
          "number.min": "Discount cannot be negative",
          "number.max": "Discount cannot exceed 100%",
        }),
        tax: Joi.number().min(0).max(100).default(0).messages({
          "number.min": "Tax cannot be negative",
          "number.max": "Tax cannot exceed 100%",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one item is required",
      "any.required": "Items are required",
    }),
  discount: Joi.number().min(0).default(0).messages({
    "number.min": "Discount cannot be negative",
  }),
  tax: Joi.number().min(0).default(0).messages({
    "number.min": "Tax cannot be negative",
  }),
  notes: Joi.string().allow(""),
  insuranceClaimNumber: Joi.string().allow(""),
});

export const updateInvoiceSchema = Joi.object({
  dueDate: Joi.date().messages({
    "date.base": "Invalid due date",
  }),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      category: Joi.string().valid(
        "consultation",
        "procedure",
        "medication",
        "lab-test",
        "imaging",
        "other"
      ),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
      discount: Joi.number().min(0).max(100).default(0),
      tax: Joi.number().min(0).max(100).default(0),
    })
  ),
  discount: Joi.number().min(0),
  tax: Joi.number().min(0),
  notes: Joi.string().allow(""),
  status: Joi.string().valid(
    "pending",
    "paid",
    "partially-paid",
    "cancelled",
    "overdue"
  ),
  insuranceClaimNumber: Joi.string().allow(""),
});

export const recordPaymentSchema = Joi.object({
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
  transactionId: Joi.string().allow(""),
  notes: Joi.string().allow(""),
});
