import crypto from "crypto";

/**
 * @param {Number} length
 * @returns {String}
 */
export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * @param {String} token
 * @returns {String}
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * @returns {Object}
 */
export const createPasswordResetToken = () => {
  const resetToken = generateRandomToken();
  const hashedToken = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    token: resetToken,
    hashedToken,
    expiresAt,
  };
};

/**
 * @returns {Object}
 */
export const createEmailVerificationToken = () => {
  const verificationToken = generateRandomToken();
  const hashedToken = hashToken(verificationToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    token: verificationToken,
    hashedToken,
    expiresAt,
  };
};
