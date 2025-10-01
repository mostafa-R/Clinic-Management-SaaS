import express from "express";
import {
  addStaffMember,
  createClinic,
  deleteClinic,
  getAllClinics,
  getClinic,
  getClinicStats,
  getMyClinics,
  removeStaffMember,
  updateClinic,
} from "../controller/clinicController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  addStaffSchema,
  createClinicSchema,
  updateClinicSchema,
} from "../validations/clinicValidation.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get my clinics (for owners/staff)
router.get("/my-clinics", getMyClinics);

// Admin only routes
router.post(
  "/",
  authorize("admin"),
  validate(createClinicSchema),
  createClinic
);
router.get("/", authorize("admin"), getAllClinics);
router.delete("/:id", authorize("admin"), deleteClinic);

// Clinic owner or admin routes
router.get("/:id", getClinic);
router.put("/:id", validate(updateClinicSchema), updateClinic);
router.get("/:id/stats", getClinicStats);

// Staff management
router.post("/:id/staff", validate(addStaffSchema), addStaffMember);
router.delete("/:id/staff/:staffId", removeStaffMember);

export default router;
