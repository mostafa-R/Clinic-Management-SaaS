import express from "express";
import {
  createPatient,
  deletePatient,
  getAllPatients,
  getMyPatientProfile,
  getPatient,
  getPatientAppointments,
  getPatientMedicalHistory,
  updatePatient,
} from "../controller/patientController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../validations/patientValidation.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Patient's own profile
router.get("/my-profile", getMyPatientProfile);

// Staff routes (Doctor, Nurse, Receptionist, Admin)
router.post(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  validate(createPatientSchema),
  createPatient
);

router.get(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  getAllPatients
);

router.get("/:id", getPatient);

router.put(
  "/:id",
  authorize("doctor", "nurse", "receptionist", "admin"),
  validate(updatePatientSchema),
  updatePatient
);

router.delete("/:id", authorize("admin"), deletePatient);

// Medical history and appointments
router.get("/:id/medical-history", getPatientMedicalHistory);
router.get("/:id/appointments", getPatientAppointments);

export default router;
