import express from "express";
import {
  deleteUploadedFile,
  getFileUrl,
  getStorageInfo,
  uploadDocument,
  uploadMultipleDocuments,
  uploadProfile,
} from "../controller/uploadController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { uploadLimiter } from "../middlewares/rateLimiter.js";
import {
  handleUploadError,
  uploadMedicalDocument,
  uploadMultipleMedicalDocuments,
  uploadProfileImage,
} from "../middlewares/upload.js";

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Apply upload rate limiting
router.use(uploadLimiter);

/**
 * @route   POST /api/upload/profile
 * @desc    Upload profile image
 * @access  Private
 */
router.post("/profile", uploadProfileImage, handleUploadError, uploadProfile);

/**
 * @route   POST /api/upload/document
 * @desc    Upload single medical document
 * @access  Private (Doctor, Nurse, Receptionist, Admin)
 */
router.post(
  "/document",
  authorize("doctor", "nurse", "receptionist", "admin"),
  uploadMedicalDocument,
  handleUploadError,
  uploadDocument
);

/**
 * @route   POST /api/upload/documents
 * @desc    Upload multiple medical documents
 * @access  Private (Doctor, Nurse, Receptionist, Admin)
 */
router.post(
  "/documents",
  authorize("doctor", "nurse", "receptionist", "admin"),
  uploadMultipleMedicalDocuments,
  handleUploadError,
  uploadMultipleDocuments
);

/**
 * @route   DELETE /api/upload/:documentId
 * @desc    Delete uploaded file
 * @access  Private (Doctor, Admin)
 */
router.delete("/:documentId", authorize("doctor", "admin"), deleteUploadedFile);

/**
 * @route   GET /api/upload/:documentId/url
 * @desc    Get signed URL for file access
 * @access  Private
 */
router.get("/:documentId/url", getFileUrl);

/**
 * @route   GET /api/upload/info
 * @desc    Get storage configuration info
 * @access  Private (Admin)
 */
router.get("/info", authorize("admin"), getStorageInfo);

export default router;
