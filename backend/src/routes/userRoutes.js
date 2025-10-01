import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserStats,
  searchUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../controller/userController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  updateUserRoleSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "../validations/userValidation.js";

const router = express.Router();

router.use(protect);

router.get("/search", searchUsers);

router.get("/", authorize("admin"), getAllUsers);

router.get("/stats", authorize("admin"), getUserStats);

router.get("/:id", getUser);

router.put("/:id", authorize("admin"), validate(updateUserSchema), updateUser);

router.put(
  "/:id/role",
  authorize("admin"),
  validate(updateUserRoleSchema),
  updateUserRole
);

router.put(
  "/:id/status",
  authorize("admin"),
  validate(updateUserStatusSchema),
  updateUserStatus
);

router.delete("/:id", authorize("admin"), deleteUser);

export default router;
