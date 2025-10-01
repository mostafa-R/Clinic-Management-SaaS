import nodemailer from "nodemailer";
import {
  appointmentReminderTemplate,
  passwordChangedEmailTemplate,
  passwordResetEmailTemplate,
  verificationEmailTemplate,
  welcomeEmailTemplate,
} from "./templates/emailTemplates.js";

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send email
 * @param {Object} options
 * @param {String} options.to
 * @param {String} options.subject
 * @param {String} options.text
 * @param {String} options.html
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "Clinic Management"} <${
        process.env.EMAIL_FROM
      }>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send welcome email
 * @param {String} email
 * @param {String} name
 */
export const sendWelcomeEmail = async (email, name) => {
  const template = welcomeEmailTemplate(name);
  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Send email verification
 * @param {String} email
 * @param {String} name
 * @param {String} token
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const template = verificationEmailTemplate(name, verificationUrl);

  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Send password reset email
 * @param {String} email
 * @param {String} name
 * @param {String} token
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const template = passwordResetEmailTemplate(name, resetUrl);

  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Send password changed notification
 * @param {String} email
 * @param {String} name
 */
export const sendPasswordChangedEmail = async (email, name) => {
  const template = passwordChangedEmailTemplate(name);

  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

/**
 * Send appointment reminder
 * @param {String} email
 * @param {String} name
 * @param {Object} appointment
 */
export const sendAppointmentReminder = async (email, name, appointment) => {
  const template = appointmentReminderTemplate(name, appointment);

  await sendEmail({
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};
