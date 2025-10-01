import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    isActive,
    isEmailVerified,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (isEmailVerified !== undefined)
    query.isEmailVerified = isEmailVerified === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select(
        "-password -refreshToken -emailVerificationToken -passwordResetToken"
      )
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    User.countDocuments(query),
  ]);

  successResponse(res, 200, "Users retrieved successfully", {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken -emailVerificationToken -passwordResetToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  successResponse(res, 200, "User retrieved successfully", { user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "gender",
    "address",
    "avatar",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;
  delete updatedUser.refreshToken;
  delete updatedUser.emailVerificationToken;
  delete updatedUser.passwordResetToken;

  successResponse(res, 200, "User updated successfully", { user: updatedUser });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  user.role = role;
  await user.save();

  successResponse(res, 200, "User role updated successfully", {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot deactivate your own account");
  }

  user.isActive = isActive;
  await user.save();

  successResponse(res, 200, "User status updated successfully", {
    user: {
      id: user._id,
      email: user.email,
      isActive: user.isActive,
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  user.isActive = false;
  await user.save();

  successResponse(res, 200, "User deactivated successfully");
});

export const getUserStats = asyncHandler(async (req, res) => {
  const [totalUsers, roleStats, statusStats] = await Promise.all([
    User.countDocuments(),
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
    User.aggregate([
      {
        $group: {
          _id: null,
          active: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
          inactive: {
            $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
          },
          emailVerified: {
            $sum: { $cond: [{ $eq: ["$isEmailVerified", true] }, 1, 0] },
          },
          emailUnverified: {
            $sum: { $cond: [{ $eq: ["$isEmailVerified", false] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const stats = {
    totalUsers,
    byRole: roleStats,
    byStatus: statusStats[0] || {
      active: 0,
      inactive: 0,
      emailVerified: 0,
      emailUnverified: 0,
    },
  };

  successResponse(res, 200, "User statistics retrieved successfully", {
    stats,
  });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { query, role } = req.query;

  if (!query || query.length < 2) {
    throw new ApiError(400, "Search query must be at least 2 characters");
  }

  const searchQuery = {
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
    isActive: true,
  };

  if (role) searchQuery.role = role;

  const users = await User.find(searchQuery)
    .select("firstName lastName email role avatar")
    .limit(10);

  successResponse(res, 200, "Users found successfully", { users });
});
