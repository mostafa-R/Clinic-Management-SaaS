import express from "express";
import {
  createNotification,
  deleteAllNotifications,
  deleteNotification,
  getAllNotifications,
  getMyNotifications,
  getNotification,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  sendBulkNotifications,
} from "../controller/notificationController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createNotificationSchema,
  markAsReadSchema,
} from "../validations/notificationValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-notifications", getMyNotifications);

router.get("/unread-count", getUnreadCount);

router.post(
  "/",
  authorize("admin"),
  validate(createNotificationSchema),
  createNotification
);

router.post("/bulk", authorize("admin"), sendBulkNotifications);

router.get("/", authorize("admin"), getAllNotifications);

router.get("/:id", getNotification);

router.put("/mark-as-read", validate(markAsReadSchema), markAsRead);

router.put("/mark-all-as-read", markAllAsRead);

router.delete("/delete-all", deleteAllNotifications);

router.delete("/:id", deleteNotification);

export default router;
