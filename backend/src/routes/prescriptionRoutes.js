import express from "express";
import {
  cancelPrescription,
  createPrescription,
  deletePrescription,
  getActivePrescriptions,
  getAllPrescriptions,
  getMyPrescriptions,
  getPrescription,
  refillPrescription,
  updatePrescription,
} from "../controller/prescriptionController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createPrescriptionSchema,
  refillPrescriptionSchema,
  updatePrescriptionSchema,
} from "../validations/prescriptionValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-prescriptions", getMyPrescriptions);

router.post(
  "/",
  authorize("doctor", "admin"),
  validate(createPrescriptionSchema),
  createPrescription
);

router.get(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  getAllPrescriptions
);

router.get("/patient/:patientId/active", getActivePrescriptions);

router.get("/:id", getPrescription);

router.put(
  "/:id",
  authorize("doctor", "admin"),
  validate(updatePrescriptionSchema),
  updatePrescription
);

router.delete("/:id", authorize("doctor", "admin"), deletePrescription);

router.post(
  "/:id/refill",
  authorize("doctor", "admin"),
  validate(refillPrescriptionSchema),
  refillPrescription
);

router.post("/:id/cancel", authorize("doctor", "admin"), cancelPrescription);

export default router;
