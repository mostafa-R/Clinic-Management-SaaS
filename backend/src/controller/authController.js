import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/emailService.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import {
  createEmailVerificationToken,
  createPasswordResetToken,
  hashToken,
} from "../utils/tokenHelper.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || "patient",
  });

  const {
    token: verificationToken,
    hashedToken,
    expiresAt,
  } = createEmailVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  await user.save();

  try {
    await sendVerificationEmail(email, firstName, verificationToken);
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;
  delete userResponse.emailVerificationToken;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  successResponse(res, 201, "User registered successfully", {
    user: userResponse,
    accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  successResponse(res, 200, "Login successful", {
    user: userResponse,
    accessToken,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: null,
  });

  res.clearCookie("refreshToken");

  successResponse(res, 200, "Logout successful");
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  successResponse(res, 200, "User retrieved successfully", { user });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.cookies;

  if (!token) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const decoded = verifyRefreshToken(token);

  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: token,
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  successResponse(res, 200, "Token refreshed successfully", {
    accessToken,
  });
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  try {
    await sendWelcomeEmail(user.email, user.firstName);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }

  successResponse(res, 200, "Email verified successfully");
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Private
 */
export const resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  const {
    token: verificationToken,
    hashedToken,
    expiresAt,
  } = createEmailVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  await user.save();

  await sendVerificationEmail(user.email, user.firstName, verificationToken);

  successResponse(res, 200, "Verification email sent successfully");
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return successResponse(
      res,
      200,
      "If an account exists, password reset email has been sent"
    );
  }

  const {
    token: resetToken,
    hashedToken,
    expiresAt,
  } = createPasswordResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, user.firstName, resetToken);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new ApiError(500, "Failed to send password reset email");
  }

  successResponse(
    res,
    200,
    "If an account exists, password reset email has been sent"
  );
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null;
  await user.save();

  try {
    await sendPasswordChangedEmail(user.email, user.firstName);
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }

  successResponse(res, 200, "Password reset successful");
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.refreshToken = null;
  await user.save();

  try {
    await sendPasswordChangedEmail(user.email, user.firstName);
  } catch (error) {
    console.error("Failed to send password changed email:", error);
  }

  successResponse(res, 200, "Password changed successfully");
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  successResponse(res, 200, "Profile updated successfully", {
    user: userResponse,
  });
});
