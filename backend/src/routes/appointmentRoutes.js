import express from "express";
import {
  cancelAppointment,
  completeAppointment,
  createAppointment,
  getAllAppointments,
  getAppointment,
  getMyAppointments,
  getTodayAppointments,
  rescheduleAppointment,
  updateAppointment,
} from "../controller/appointmentController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  cancelAppointmentSchema,
  createAppointmentSchema,
  rescheduleAppointmentSchema,
  updateAppointmentSchema,
} from "../validations/appointmentValidation.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Patient routes
router.get("/my-appointments", getMyAppointments);

// Today's appointments
router.get("/today", getTodayAppointments);

// Create appointment
router.post(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin", "patient"),
  validate(createAppointmentSchema),
  createAppointment
);

// Get all appointments
router.get("/", getAllAppointments);

// Single appointment operations
router.get("/:id", getAppointment);

router.put(
  "/:id",
  authorize("doctor", "nurse", "receptionist", "admin"),
  validate(updateAppointmentSchema),
  updateAppointment
);

// Cancel appointment
router.post(
  "/:id/cancel",
  validate(cancelAppointmentSchema),
  cancelAppointment
);

// Reschedule appointment
router.post(
  "/:id/reschedule",
  validate(rescheduleAppointmentSchema),
  rescheduleAppointment
);

// Complete appointment (doctors only)
router.post("/:id/complete", authorize("doctor", "admin"), completeAppointment);

export default router;
