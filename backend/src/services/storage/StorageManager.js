import sharp from "sharp";
import { storageConfig, validateStorageConfig } from "../../config/storage.js";
import CloudinaryStorageProvider from "./CloudinaryStorageProvider.js";
import LocalStorageProvider from "./LocalStorageProvider.js";
import S3StorageProvider from "./S3StorageProvider.js";

class StorageManager {
  constructor() {
    validateStorageConfig();
    this.provider = this.initializeProvider();
    console.log(
      `✅ Storage Provider Initialized: ${this.provider.getProviderName()}`
    );
  }

  /**
   * Initialize the appropriate storage provider
   */
  initializeProvider() {
    const { provider } = storageConfig;

    switch (provider) {
      case "cloudinary":
        return new CloudinaryStorageProvider();
      case "s3":
        return new S3StorageProvider();
      case "local":
      default:
        return new LocalStorageProvider();
    }
  }

  /**
   * Optimize image before upload
   */
  async optimizeImage(fileBuffer, options = {}) {
    try {
      const {
        width = 2000,
        height = 2000,
        quality = 85,
        format = "jpeg",
      } = options;

      const optimized = await sharp(fileBuffer)
        .resize(width, height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toFormat(format, { quality })
        .toBuffer();

      return optimized;
    } catch (error) {
      console.error("Image optimization error:", error);
      return fileBuffer; // Return original if optimization fails
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(fileBuffer, fileInfo, folder = "general", optimize = false) {
    try {
      let processedBuffer = fileBuffer;

      // Optimize images if requested
      if (optimize && fileInfo.mimetype.startsWith("image/")) {
        processedBuffer = await this.optimizeImage(fileBuffer);
      }

      const result = await this.provider.upload(
        processedBuffer,
        fileInfo,
        folder
      );

      console.log(`✅ File uploaded: ${result.fileName}`);
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  /**
   * Upload profile image (optimized)
   */
  async uploadProfileImage(fileBuffer, fileInfo, userId) {
    const folder = `profiles/${userId}`;
    const optimized = await this.optimizeImage(fileBuffer, {
      width: 500,
      height: 500,
      quality: 90,
    });

    return await this.uploadFile(optimized, fileInfo, folder, false);
  }

  /**
   * Upload medical document
   */
  async uploadMedicalDocument(fileBuffer, fileInfo, patientId, clinicId) {
    const folder = `clinics/${clinicId}/patients/${patientId}/documents`;

    // Optimize medical images, but keep documents as-is
    const optimize = fileInfo.mimetype.startsWith("image/");

    return await this.uploadFile(fileBuffer, fileInfo, folder, optimize);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileName) {
    try {
      const result = await this.provider.delete(fileName);
      if (result) {
        console.log(`✅ File deleted: ${fileName}`);
      }
      return result;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }

  /**
   * Get file URL
   */
  async getFileUrl(fileName, expiresIn = 3600) {
    return await this.provider.getFileUrl(fileName, expiresIn);
  }

  /**
   * Check if file exists
   */
  async fileExists(fileName) {
    return await this.provider.exists(fileName);
  }

  /**
   * Get active provider name
   */
  getProviderName() {
    return this.provider.getProviderName();
  }

  /**
   * Get storage info
   */
  getStorageInfo() {
    return {
      provider: this.provider.getProviderName(),
      config: storageConfig,
    };
  }
}

// Export singleton instance
export default new StorageManager();
