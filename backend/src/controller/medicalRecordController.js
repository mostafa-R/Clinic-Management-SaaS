import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import {
  Appointment,
  Clinic,
  MedicalRecord,
  Patient,
  User,
} from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createMedicalRecord = asyncHandler(async (req, res) => {
  const {
    appointmentId,
    patientId,
    clinicId,
    doctorId,
    visitDate,
    chiefComplaint,
    presentIllness,
    vitalSigns,
    physicalExamination,
    diagnosis,
    treatment,
    labTests,
    notes,
    followUpDate,
    followUpInstructions,
    referrals,
  } = req.body;

  const [appointment, patient, clinic, doctor] = await Promise.all([
    Appointment.findById(appointmentId),
    Patient.findById(patientId),
    Clinic.findById(clinicId),
    User.findById(doctorId),
  ]);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }
  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(404, "Doctor not found");
  }

  const medicalRecord = await MedicalRecord.create({
    appointment: appointmentId,
    patient: patientId,
    clinic: clinicId,
    doctor: doctorId,
    visitDate,
    chiefComplaint,
    presentIllness,
    vitalSigns,
    physicalExamination,
    diagnosis,
    treatment,
    labTests,
    notes,
    followUpDate,
    followUpInstructions,
    referrals,
  });

  await medicalRecord.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "doctor", select: "firstName lastName" },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 201, "Medical record created successfully", {
    medicalRecord,
  });
});

export const getAllMedicalRecords = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    clinicId,
    doctorId,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  if (patientId) query.patient = patientId;
  if (clinicId) query.clinic = clinicId;
  if (doctorId) query.doctor = doctorId;

  if (startDate || endDate) {
    query.visitDate = {};
    if (startDate) query.visitDate.$gte = new Date(startDate);
    if (endDate) query.visitDate.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [medicalRecords, total] = await Promise.all([
    MedicalRecord.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("doctor", "firstName lastName")
      .populate("clinic", "name")
      .sort({ visitDate: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    MedicalRecord.countDocuments(query),
  ]);

  successResponse(res, 200, "Medical records retrieved successfully", {
    medicalRecords,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getMedicalRecord = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("doctor", "firstName lastName email phone")
    .populate("clinic", "name email phone address")
    .populate("appointment");

  if (!medicalRecord) {
    throw new ApiError(404, "Medical record not found");
  }

  successResponse(res, 200, "Medical record retrieved successfully", {
    medicalRecord,
  });
});

export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    throw new ApiError(404, "Medical record not found");
  }

  if (medicalRecord.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own medical records");
  }

  const allowedUpdates = [
    "chiefComplaint",
    "presentIllness",
    "vitalSigns",
    "physicalExamination",
    "diagnosis",
    "treatment",
    "labTests",
    "notes",
    "followUpDate",
    "followUpInstructions",
    "referrals",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      medicalRecord[field] = req.body[field];
    }
  });

  await medicalRecord.save();

  await medicalRecord.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "doctor", select: "firstName lastName" },
  ]);

  successResponse(res, 200, "Medical record updated successfully", {
    medicalRecord,
  });
});

export const deleteMedicalRecord = asyncHandler(async (req, res) => {
  const medicalRecord = await MedicalRecord.findById(req.params.id);

  if (!medicalRecord) {
    throw new ApiError(404, "Medical record not found");
  }

  if (
    medicalRecord.doctor.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this record");
  }

  await medicalRecord.deleteOne();

  successResponse(res, 200, "Medical record deleted successfully");
});

export const getPatientMedicalHistory = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const medicalRecords = await MedicalRecord.find({ patient: patientId })
    .populate("doctor", "firstName lastName")
    .populate("clinic", "name")
    .sort({ visitDate: -1 });

  const summary = {
    totalVisits: medicalRecords.length,
    lastVisit: medicalRecords[0]?.visitDate || null,
    commonDiagnoses: [],
    recentVitalSigns: medicalRecords[0]?.vitalSigns || null,
  };

  const diagnosisMap = {};
  medicalRecords.forEach((record) => {
    record.diagnosis?.forEach((diag) => {
      diagnosisMap[diag.name] = (diagnosisMap[diag.name] || 0) + 1;
    });
  });

  summary.commonDiagnoses = Object.entries(diagnosisMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  successResponse(res, 200, "Patient medical history retrieved successfully", {
    summary,
    records: medicalRecords,
  });
});

export const getMyMedicalRecords = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const medicalRecords = await MedicalRecord.find({ patient: patient._id })
    .populate("doctor", "firstName lastName")
    .populate("clinic", "name address")
    .sort({ visitDate: -1 });

  successResponse(res, 200, "Your medical records retrieved successfully", {
    medicalRecords,
  });
});
