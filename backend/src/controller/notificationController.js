import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Notification, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createNotification = asyncHandler(async (req, res) => {
  const {
    userId,
    title,
    message,
    type,
    priority,
    relatedId,
    relatedModel,
    actionUrl,
    expiresAt,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    priority,
    relatedId,
    relatedModel,
    actionUrl,
    expiresAt,
  });

  successResponse(res, 201, "Notification created successfully", {
    notification,
  });
});

export const getAllNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, userId, type, isRead, priority } = req.query;

  const query = {};

  if (userId) query.user = userId;
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead === "true";
  if (priority) query.priority = priority;

  query.$or = [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }];

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Notification.countDocuments(query),
  ]);

  successResponse(res, 200, "Notifications retrieved successfully", {
    notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, isRead } = req.query;

  const query = {
    user: req.user._id,
    $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
  };

  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead === "true";

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Notification.countDocuments(query),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  successResponse(res, 200, "Your notifications retrieved successfully", {
    notifications,
    unreadCount,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate(
    "user",
    "firstName lastName email"
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  successResponse(res, 200, "Notification retrieved successfully", {
    notification,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;

  await Notification.updateMany(
    {
      _id: { $in: notificationIds },
      user: req.user._id,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  successResponse(res, 200, "Notifications marked as read");
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      user: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  successResponse(res, 200, "All notifications marked as read");
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own notifications");
  }

  await notification.deleteOne();

  successResponse(res, 200, "Notification deleted successfully");
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    user: req.user._id,
    isRead: true,
  });

  successResponse(res, 200, "All read notifications deleted successfully");
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
    $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
  });

  successResponse(res, 200, "Unread count retrieved successfully", {
    unreadCount: count,
  });
});

export const sendBulkNotifications = asyncHandler(async (req, res) => {
  const { userIds, title, message, type, priority, actionUrl } = req.body;

  if (!userIds || userIds.length === 0) {
    throw new ApiError(400, "At least one user ID is required");
  }

  const notifications = userIds.map((userId) => ({
    user: userId,
    title,
    message,
    type,
    priority: priority || "medium",
    actionUrl,
  }));

  await Notification.insertMany(notifications);

  successResponse(res, 201, "Bulk notifications sent successfully", {
    count: notifications.length,
  });
});
