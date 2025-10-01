import { User } from "../models/index.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "./errorHandler.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, no token provided");
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @param  {...String} roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};

/**
 * Check if email is verified
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(
      new ApiError(403, "Please verify your email to access this resource")
    );
  }
  next();
};

/**
 * Optional authentication - doesn't throw error if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
