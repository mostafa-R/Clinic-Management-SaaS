/**
 * Email template wrapper
 * @param {String} content - Email content
 * @returns {String} HTML template
 */
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clinic Management</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🏥 Clinic Management
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} Clinic Management. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Button component for emails
 * @param {String} url - Button URL
 * @param {String} text - Button text
 * @returns {String} Button HTML
 */
const emailButton = (url, text) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
    <tr>
      <td align="center">
        <a href="${url}" 
           style="display: inline-block; padding: 14px 40px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`;

/**
 * Welcome Email Template
 * @param {String} name - User's first name
 * @returns {Object} Email subject and content
 */
export const welcomeEmailTemplate = (name) => {
  const content = `
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Welcome to Clinic Management! 🎉</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Thank you for joining our clinic management platform! We're excited to have you on board.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      You now have access to all features of our platform, including:
    </p>
    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 20px;">
      <li>Appointment management</li>
      <li>Patient records</li>
      <li>Medical documentation</li>
      <li>Billing and payments</li>
      <li>And much more!</li>
    </ul>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      If you have any questions or need assistance, feel free to reach out to our support team.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
      Best regards,<br>
      <strong>The Clinic Management Team</strong>
    </p>
  `;

  return {
    subject: "Welcome to Clinic Management! 🏥",
    html: emailWrapper(content),
    text: `Welcome to Clinic Management!\n\nHi ${name},\n\nThank you for joining our clinic management platform! You now have access to all features including appointment management, patient records, medical documentation, billing and payments, and much more.\n\nBest regards,\nThe Clinic Management Team`,
  };
};

/**
 * Email Verification Template
 * @param {String} name - User's first name
 * @param {String} verificationUrl - Verification URL
 * @returns {Object} Email subject and content
 */
export const verificationEmailTemplate = (name, verificationUrl) => {
  const content = `
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Verify Your Email Address ✉️</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Thank you for registering with Clinic Management! Please verify your email address to activate your account and get started.
    </p>
    ${emailButton(verificationUrl, "Verify Email")}
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 20px 0 15px 0;">
      Or copy and paste this link in your browser:
    </p>
    <p style="color: #2563eb; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 4px; margin: 0 0 15px 0;">
      ${verificationUrl}
    </p>
    <p style="color: #ef4444; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; padding: 12px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
      ⚠️ This link will expire in <strong>24 hours</strong>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  `;

  return {
    subject: "Verify Your Email Address - Clinic Management",
    html: emailWrapper(content),
    text: `Verify Your Email Address\n\nHi ${name},\n\nThank you for registering with Clinic Management! Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.\n\nBest regards,\nThe Clinic Management Team`,
  };
};

/**
 * Password Reset Email Template
 * @param {String} name - User's first name
 * @param {String} resetUrl - Password reset URL
 * @returns {Object} Email subject and content
 */
export const passwordResetEmailTemplate = (name, resetUrl) => {
  const content = `
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Reset Your Password 🔐</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    ${emailButton(resetUrl, "Reset Password")}
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 20px 0 15px 0;">
      Or copy and paste this link in your browser:
    </p>
    <p style="color: #2563eb; font-size: 14px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 4px; margin: 0 0 15px 0;">
      ${resetUrl}
    </p>
    <p style="color: #ef4444; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; padding: 12px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
      ⚠️ This link will expire in <strong>1 hour</strong>
    </p>
    <p style="color: #dc2626; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; font-weight: bold;">
      ⚠️ If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 15px 0 0 0;">
      For security reasons, this link can only be used once.
    </p>
  `;

  return {
    subject: "Password Reset Request - Clinic Management",
    html: emailWrapper(content),
    text: `Reset Your Password\n\nHi ${name},\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email or contact support if you have concerns.\n\nBest regards,\nThe Clinic Management Team`,
  };
};

/**
 * Password Changed Email Template
 * @param {String} name - User's first name
 * @returns {Object} Email subject and content
 */
export const passwordChangedEmailTemplate = (name) => {
  const content = `
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Password Changed Successfully ✅</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      This is a confirmation that your password has been changed successfully.
    </p>
    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="color: #065f46; font-size: 16px; line-height: 1.6; margin: 0;">
        ✅ Your password was changed on <strong>${new Date().toLocaleString()}</strong>
      </p>
    </div>
    <p style="color: #dc2626; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0; padding: 12px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px; font-weight: bold;">
      ⚠️ If you didn't make this change, please contact our support team immediately!
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      For your security, all active sessions have been logged out. Please log in again with your new password.
    </p>
  `;

  return {
    subject: "Password Changed Successfully - Clinic Management",
    html: emailWrapper(content),
    text: `Password Changed Successfully\n\nHi ${name},\n\nThis is a confirmation that your password has been changed successfully on ${new Date().toLocaleString()}.\n\nIf you didn't make this change, please contact our support team immediately!\n\nFor your security, all active sessions have been logged out.\n\nBest regards,\nThe Clinic Management Team`,
  };
};

/**
 * Appointment Reminder Email Template
 * @param {String} name - Patient's first name
 * @param {Object} appointment - Appointment details
 * @returns {Object} Email subject and content
 */
export const appointmentReminderTemplate = (name, appointment) => {
  const { date, time, doctorName, clinicName } = appointment;

  const content = `
    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Appointment Reminder 📅</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
      This is a friendly reminder about your upcoming appointment:
    </p>
    <div style="background-color: #eff6ff; border: 2px solid #2563eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #1f2937; font-weight: bold; font-size: 14px;">📍 Clinic:</td>
          <td style="color: #4b5563; font-size: 14px;">${clinicName}</td>
        </tr>
        <tr>
          <td style="color: #1f2937; font-weight: bold; font-size: 14px;">👨‍⚕️ Doctor:</td>
          <td style="color: #4b5563; font-size: 14px;">${doctorName}</td>
        </tr>
        <tr>
          <td style="color: #1f2937; font-weight: bold; font-size: 14px;">📅 Date:</td>
          <td style="color: #4b5563; font-size: 14px;">${date}</td>
        </tr>
        <tr>
          <td style="color: #1f2937; font-weight: bold; font-size: 14px;">🕐 Time:</td>
          <td style="color: #4b5563; font-size: 14px;">${time}</td>
        </tr>
      </table>
    </div>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
      Please arrive 10 minutes early. If you need to reschedule, please contact us as soon as possible.
    </p>
  `;

  return {
    subject: `Appointment Reminder - ${date} at ${time}`,
    html: emailWrapper(content),
    text: `Appointment Reminder\n\nHi ${name},\n\nThis is a friendly reminder about your upcoming appointment:\n\nClinic: ${clinicName}\nDoctor: ${doctorName}\nDate: ${date}\nTime: ${time}\n\nPlease arrive 10 minutes early.\n\nBest regards,\nThe Clinic Management Team`,
  };
};
