import express from "express";
import {
  createDocument,
  deleteDocument,
  downloadDocument,
  getAllDocuments,
  getDocument,
  getDocumentsByCategory,
  getMyDocuments,
  updateDocument,
} from "../controller/documentController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createDocumentSchema,
  updateDocumentSchema,
} from "../validations/documentValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-documents", getMyDocuments);

router.post(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  validate(createDocumentSchema),
  createDocument
);

router.get(
  "/",
  authorize("doctor", "nurse", "receptionist", "admin"),
  getAllDocuments
);

router.get("/patient/:patientId/by-category", getDocumentsByCategory);

router.get("/:id", getDocument);

router.put(
  "/:id",
  authorize("doctor", "nurse", "receptionist", "admin"),
  validate(updateDocumentSchema),
  updateDocument
);

router.delete("/:id", authorize("doctor", "admin"), deleteDocument);

router.get("/:id/download", downloadDocument);

export default router;
