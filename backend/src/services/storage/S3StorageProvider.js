import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { storageConfig } from "../../config/storage.js";
import BaseStorageProvider from "./BaseStorageProvider.js";

class S3StorageProvider extends BaseStorageProvider {
  constructor() {
    super();
    this.client = new S3Client({
      region: storageConfig.s3.region,
      credentials: {
        accessKeyId: storageConfig.s3.accessKeyId,
        secretAccessKey: storageConfig.s3.secretAccessKey,
      },
    });
    this.bucket = storageConfig.s3.bucket;
  }

  async upload(fileBuffer, fileInfo, folder = "general") {
    try {
      const ext = path.extname(fileInfo.originalname);
      const fileName = `${folder}/${crypto
        .randomBytes(16)
        .toString("hex")}${ext}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: fileInfo.mimetype,
        ACL: "private", // Files are private by default
      });

      await this.client.send(command);

      return {
        fileName,
        fileUrl: `https://${this.bucket}.s3.${storageConfig.s3.region}.amazonaws.com/${fileName}`,
        fileSize: fileBuffer.length,
        mimeType: fileInfo.mimetype,
        provider: "s3",
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async delete(fileName) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error("S3 Delete Error:", error);
      return false;
    }
  }

  async getFileUrl(fileName, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error("S3 Signed URL Error:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  async exists(fileName) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });

      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  getProviderName() {
    return "s3";
  }
}

export default S3StorageProvider;
