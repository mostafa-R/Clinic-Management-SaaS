/**
 * Base Storage Provider Interface
 * All storage providers must implement these methods
 */
class BaseStorageProvider {
  /**
   * Upload a file
   * @param {Buffer} fileBuffer - File buffer
   * @param {Object} fileInfo - File information (originalname, mimetype, size)
   * @param {String} folder - Folder/path to store the file
   * @returns {Promise<Object>} - Upload result {fileUrl, fileName, fileSize, mimeType}
   */
  async upload(fileBuffer, fileInfo, folder = "") {
    throw new Error("upload() must be implemented");
  }

  /**
   * Delete a file
   * @param {String} fileName - File name/key/public_id
   * @returns {Promise<Boolean>} - Success status
   */
  async delete(fileName) {
    throw new Error("delete() must be implemented");
  }

  /**
   * Get file URL
   * @param {String} fileName - File name/key/public_id
   * @param {Number} expiresIn - URL expiration time in seconds (for private files)
   * @returns {Promise<String>} - File URL
   */
  async getFileUrl(fileName, expiresIn = 3600) {
    throw new Error("getFileUrl() must be implemented");
  }

  /**
   * Check if file exists
   * @param {String} fileName - File name/key/public_id
   * @returns {Promise<Boolean>} - Exists status
   */
  async exists(fileName) {
    throw new Error("exists() must be implemented");
  }

  /**
   * Get provider name
   * @returns {String}
   */
  getProviderName() {
    return "base";
  }
}

export default BaseStorageProvider;
