/**
 * Storage Configuration
 *
 * Supported providers:
 * - 'local': Store files on the server
 * - 'cloudinary': Store files on Cloudinary
 * - 's3': Store files on AWS S3
 */

export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || "local",

  local: {
    uploadDir: "./uploads",
    publicUrl: `${process.env.PUBLIC_URL}/uploads`,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || "clinic-management",
  },

  s3: {
    region: process.env.AWS_REGION || "us-east-1",
    bucket: process.env.AWS_S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    maxFiles: 5,
  },

  allowedTypes: {
    images: ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    medical: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/dicom",
    ],
  },
};

export const validateStorageConfig = () => {
  const { provider } = storageConfig;

  if (!["local", "cloudinary", "s3"].includes(provider)) {
    throw new Error(`Invalid storage provider: ${provider}`);
  }

  if (provider === "cloudinary") {
    const { cloudName, apiKey, apiSecret } = storageConfig.cloudinary;
    if (!cloudName || !apiKey || !apiSecret) {
      console.warn(
        "⚠️  Cloudinary is selected but not fully configured. Falling back to local storage."
      );
      storageConfig.provider = "local";
    }
  }

  if (provider === "s3") {
    const { bucket, accessKeyId, secretAccessKey } = storageConfig.s3;
    if (!bucket || !accessKeyId || !secretAccessKey) {
      console.warn(
        "⚠️  AWS S3 is selected but not fully configured. Falling back to local storage."
      );
      storageConfig.provider = "local";
    }
  }

  console.log(`📦 Storage Provider: ${storageConfig.provider}`);
};
