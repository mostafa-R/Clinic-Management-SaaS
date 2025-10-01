import express from "express";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecord,
  getMyMedicalRecords,
  getPatientMedicalHistory,
  updateMedicalRecord,
} from "../controller/medicalRecordController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "../validations/medicalRecordValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-records", getMyMedicalRecords);

router.post(
  "/",
  authorize("doctor", "admin"),
  validate(createMedicalRecordSchema),
  createMedicalRecord
);

router.get(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  getAllMedicalRecords
);

router.get("/patient/:patientId/history", getPatientMedicalHistory);

router.get("/:id", getMedicalRecord);

router.put(
  "/:id",
  authorize("doctor", "admin"),
  validate(updateMedicalRecordSchema),
  updateMedicalRecord
);

router.delete("/:id", authorize("doctor", "admin"), deleteMedicalRecord);

export default router;
