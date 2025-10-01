import Joi from "joi";

const commonRules = {
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),

  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
    "string.empty": "First name cannot be empty",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
    "string.empty": "Last name cannot be empty",
  }),

  phone: Joi.string()
    .pattern(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{4,10}$/
    )
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "any.required": "Phone number is required",
      "string.empty": "Phone number cannot be empty",
    }),

  role: Joi.string()
    .valid("admin", "doctor", "receptionist", "accountant", "nurse", "patient")
    .default("patient")
    .messages({
      "any.only":
        "Invalid role. Must be one of: admin, doctor, receptionist, accountant, nurse, patient",
    }),

  avatar: Joi.string().uri().messages({
    "string.uri": "Avatar must be a valid URL",
  }),
};

export const registerSchema = Joi.object({
  email: commonRules.email,
  password: commonRules.password,
  firstName: commonRules.firstName,
  lastName: commonRules.lastName,
  phone: commonRules.phone,
  role: commonRules.role,
});

export const loginSchema = Joi.object({
  email: commonRules.email,
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: commonRules.email,
});

export const resetPasswordSchema = Joi.object({
  password: commonRules.password,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
    "string.empty": "Password confirmation cannot be empty",
  }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
    "string.empty": "Current password cannot be empty",
  }),
  newPassword: commonRules.password,
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
      "string.empty": "Password confirmation cannot be empty",
    }),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).messages({
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).messages({
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{4,10}$/
    )
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  avatar: commonRules.avatar,
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Verification token is required",
    "string.empty": "Verification token cannot be empty",
  }),
});

export const resetPasswordTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
    "string.empty": "Reset token cannot be empty",
  }),
});
