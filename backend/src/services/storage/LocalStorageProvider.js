import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { storageConfig } from "../../config/storage.js";
import BaseStorageProvider from "./BaseStorageProvider.js";

class LocalStorageProvider extends BaseStorageProvider {
  constructor() {
    super();
    this.uploadDir = storageConfig.local.uploadDir;
    this.publicUrl = storageConfig.local.publicUrl;
    this.ensureUploadDirExists();
  }

  async ensureUploadDirExists() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      console.log(`📁 Created upload directory: ${this.uploadDir}`);
    }
  }

  async upload(fileBuffer, fileInfo, folder = "general") {
    try {
      const ext = path.extname(fileInfo.originalname);
      const fileName = `${folder}/${crypto
        .randomBytes(16)
        .toString("hex")}${ext}`;
      const folderPath = path.join(this.uploadDir, folder);
      const filePath = path.join(this.uploadDir, fileName);

      // Ensure folder exists
      await fs.mkdir(folderPath, { recursive: true });

      // Write file
      await fs.writeFile(filePath, fileBuffer);

      return {
        fileName,
        fileUrl: `${this.publicUrl}/${fileName}`,
        fileSize: fileBuffer.length,
        mimeType: fileInfo.mimetype,
        provider: "local",
      };
    } catch (error) {
      console.error("Local Storage Upload Error:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async delete(fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error("Local Storage Delete Error:", error);
      return false;
    }
  }

  async getFileUrl(fileName, expiresIn = 3600) {
    // Local files are always public, ignore expiresIn
    return `${this.publicUrl}/${fileName}`;
  }

  async exists(fileName) {
    try {
      const filePath = path.join(this.uploadDir, fileName);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getProviderName() {
    return "local";
  }
}

export default LocalStorageProvider;
