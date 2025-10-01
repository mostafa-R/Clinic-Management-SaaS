import multer from "multer";
import { storageConfig } from "../config/storage.js";
import { ApiError } from "./errorHandler.js";

/**
 * File filter for validation
 */
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
      ),
      false
    );
  }
};

/**
 * Multer configuration (memory storage for processing)
 */
const createMulterUpload = (options = {}) => {
  const {
    allowedTypes = [
      ...storageConfig.allowedTypes.images,
      ...storageConfig.allowedTypes.documents,
    ],
    maxSize = storageConfig.limits.fileSize,
    maxFiles = storageConfig.limits.maxFiles,
  } = options;

  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxSize,
      files: maxFiles,
    },
    fileFilter: fileFilter(allowedTypes),
  });
};

/**
 * Profile image upload (single image)
 */
export const uploadProfileImage = createMulterUpload({
  allowedTypes: storageConfig.allowedTypes.images,
  maxSize: 5 * 1024 * 1024,
  maxFiles: 1,
}).single("avatar");

/**
 * Medical document upload (single file)
 */
export const uploadMedicalDocument = createMulterUpload({
  allowedTypes: [
    ...storageConfig.allowedTypes.images,
    ...storageConfig.allowedTypes.documents,
  ],
  maxSize: 10 * 1024 * 1024,
  maxFiles: 1,
}).single("document");

/**
 * Multiple medical documents upload
 */
export const uploadMultipleMedicalDocuments = createMulterUpload({
  allowedTypes: [...storageConfig.allowedTypes.medical],
  maxSize: 10 * 1024 * 1024,
  maxFiles: 5,
}).array("documents", 5);

/**
 * General file upload (single)
 */
export const uploadSingleFile = createMulterUpload({
  maxFiles: 1,
}).single("file");

/**
 * Multiple files upload
 */
export const uploadMultipleFiles = createMulterUpload().array("files", 5);

/**
 * Error handling middleware for multer
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new ApiError(
          400,
          `File size too large. Maximum size is ${
            storageConfig.limits.fileSize / 1024 / 1024
          }MB.`
        )
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(new ApiError(400, "Too many files uploaded."));
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return next(
        new ApiError(
          400,
          `Maximum ${storageConfig.limits.maxFiles} files allowed.`
        )
      );
    }
    return next(new ApiError(400, err.message));
  }
  next(err);
};
