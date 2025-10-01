import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import Clinic from "../models/Clinic.js";
import Document from "../models/Document.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import StorageManager from "../services/storage/StorageManager.js";

/**
 * Upload profile image
 * @route POST /api/upload/profile
 */
export const uploadProfile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const userId = req.user._id;

  const uploadResult = await StorageManager.uploadProfileImage(
    req.file.buffer,
    req.file,
    userId
  );

  await User.updateOne(
    { _id: userId },
    { $set: { avatar: uploadResult.fileUrl } }
  );

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    data: {
      fileUrl: uploadResult.fileUrl,
      fileName: uploadResult.fileName,
      provider: uploadResult.provider,
    },
  });
});

/**
 * Upload medical document
 * @route POST /api/upload/document
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const {
    patientId,
    clinicId,
    appointmentId,
    medicalRecordId,
    title,
    description,
    type,
    category,
    tags,
    isPublic,
  } = req.body;

  const [patient, clinic] = await Promise.all([
    Patient.findById(patientId),
    Clinic.findById(clinicId),
  ]);

  if (!patient) throw new ApiError(404, "Patient not found");
  if (!clinic) throw new ApiError(404, "Clinic not found");

  const uploadResult = await StorageManager.uploadMedicalDocument(
    req.file.buffer,
    req.file,
    patientId,
    clinicId
  );

  const document = await Document.create({
    patient: patientId,
    clinic: clinicId,
    appointment: appointmentId || null,
    medicalRecord: medicalRecordId || null,
    title: title || req.file.originalname,
    description,
    type,
    category,
    fileUrl: uploadResult.fileUrl,
    fileName: uploadResult.fileName,
    fileSize: uploadResult.fileSize,
    mimeType: uploadResult.mimeType,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    isPublic: isPublic === "true",
    uploadedBy: req.user._id,
  });

  await document.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
    { path: "uploadedBy", select: "firstName lastName" },
  ]);

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully",
    data: { document },
  });
});

/**
 * Upload multiple documents
 * @route POST /api/upload/documents
 */
export const uploadMultipleDocuments = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const { patientId, clinicId, type } = req.body;

  const [patient, clinic] = await Promise.all([
    Patient.findById(patientId),
    Clinic.findById(clinicId),
  ]);

  if (!patient) throw new ApiError(404, "Patient not found");
  if (!clinic) throw new ApiError(404, "Clinic not found");

  const uploadPromises = req.files.map((file) =>
    StorageManager.uploadMedicalDocument(file.buffer, file, patientId, clinicId)
  );

  const uploadResults = await Promise.all(uploadPromises);

  const documents = await Document.insertMany(
    uploadResults.map((result, index) => ({
      patient: patientId,
      clinic: clinicId,
      title: req.files[index].originalname,
      type,
      fileUrl: result.fileUrl,
      fileName: result.fileName,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
      uploadedBy: req.user._id,
    }))
  );

  res.status(201).json({
    success: true,
    message: `${documents.length} documents uploaded successfully`,
    data: { documents },
  });
});

/**
 * Delete uploaded file
 * @route DELETE /api/upload/:documentId
 */
export const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  const document = await Document.findById(documentId);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  await StorageManager.deleteFile(document.fileName);

  await document.deleteOne();

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
  });
});

/**
 * Get file URL (for private files)
 * @route GET /api/upload/:documentId/url
 */
export const getFileUrl = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { expiresIn = 3600 } = req.query;

  const document = await Document.findById(documentId);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const fileUrl = await StorageManager.getFileUrl(
    document.fileName,
    parseInt(expiresIn)
  );

  res.status(200).json({
    success: true,
    message: "File URL generated",
    data: {
      fileUrl,
      expiresIn: parseInt(expiresIn),
    },
  });
});

/**
 * Get storage info
 * @route GET /api/upload/info
 */
export const getStorageInfo = asyncHandler(async (req, res) => {
  const info = StorageManager.getStorageInfo();

  res.status(200).json({
    success: true,
    message: "Storage information",
    data: info,
  });
});
