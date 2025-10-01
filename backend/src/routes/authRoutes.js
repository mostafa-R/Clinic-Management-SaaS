import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationEmail,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../controller/authController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validations/authValidation.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword
);

// Protected routes (require authentication)
router.use(protect);

router.get("/me", getMe);
router.post("/logout", logout);
router.post("/resend-verification", resendVerificationEmail);
router.put("/change-password", validate(changePasswordSchema), changePassword);
router.put("/profile", validate(updateProfileSchema), updateProfile);

export default router;
