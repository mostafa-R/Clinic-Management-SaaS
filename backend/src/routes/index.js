import express from "express";
import appointmentRoutes from "./appointmentRoutes.js";
import authRoutes from "./authRoutes.js";
import clinicRoutes from "./clinicRoutes.js";
import documentRoutes from "./documentRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import medicalRecordRoutes from "./medicalRecordRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import patientRoutes from "./patientRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// Health check for API routes
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/clinics", clinicRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/documents", documentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;
