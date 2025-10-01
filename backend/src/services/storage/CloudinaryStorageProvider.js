import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { storageConfig } from "../../config/storage.js";
import BaseStorageProvider from "./BaseStorageProvider.js";

class CloudinaryStorageProvider extends BaseStorageProvider {
  constructor() {
    super();
    this.configure();
    this.baseFolder = storageConfig.cloudinary.folder;
  }

  configure() {
    cloudinary.config({
      cloud_name: storageConfig.cloudinary.cloudName,
      api_key: storageConfig.cloudinary.apiKey,
      api_secret: storageConfig.cloudinary.apiSecret,
    });
  }

  async upload(fileBuffer, fileInfo, folder = "general") {
    return new Promise((resolve, reject) => {
      const uploadPath = `${this.baseFolder}/${folder}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: uploadPath,
          resource_type: "auto",
          allowed_formats: ["jpg", "png", "pdf", "doc", "docx", "gif", "webp"],
          transformation: fileInfo.mimetype.startsWith("image/")
            ? [{ width: 2000, crop: "limit" }]
            : null,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              fileName: result.public_id,
              fileUrl: result.secure_url,
              fileSize: result.bytes,
              mimeType: fileInfo.mimetype,
              provider: "cloudinary",
            });
          }
        }
      );

      const bufferStream = Readable.from(fileBuffer);
      bufferStream.pipe(uploadStream);
    });
  }

  async delete(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
      return false;
    }
  }

  async getFileUrl(publicId, expiresIn = 3600) {
    // Cloudinary URLs are always accessible, but we can generate signed URLs
    try {
      const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
      const signature = cloudinary.utils.api_sign_request(
        { public_id: publicId, timestamp },
        storageConfig.cloudinary.apiSecret
      );

      return cloudinary.url(publicId, {
        sign_url: true,
        timestamp,
        signature,
      });
    } catch (error) {
      // Fallback to regular URL
      return cloudinary.url(publicId);
    }
  }

  async exists(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId);
      return !!result;
    } catch {
      return false;
    }
  }

  getProviderName() {
    return "cloudinary";
  }
}

export default CloudinaryStorageProvider;
