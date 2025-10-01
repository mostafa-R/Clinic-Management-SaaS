import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Clinic, Patient, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

/**
 * @desc    Create new patient
 * @route   POST /api/patients
 * @access  Private (Doctor, Nurse, Receptionist, Admin)
 */
export const createPatient = asyncHandler(async (req, res) => {
  const {
    userId,
    clinicId,
    dateOfBirth,
    gender,
    bloodGroup,
    emergencyContact,
    medicalHistory,
    insurance,
    notes,
    tags,
  } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if clinic exists
  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Check if patient already exists for this user in this clinic
  const existingPatient = await Patient.findOne({
    user: userId,
    clinic: clinicId,
  });
  if (existingPatient) {
    throw new ApiError(400, "Patient record already exists for this user");
  }

  // Create patient
  const patient = await Patient.create({
    user: userId,
    clinic: clinicId,
    dateOfBirth,
    gender,
    bloodGroup,
    emergencyContact,
    medicalHistory,
    insurance,
    notes,
    tags,
  });

  await patient.populate("user", "firstName lastName email phone");
  await patient.populate("clinic", "name");

  successResponse(res, 201, "Patient created successfully", { patient });
});

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private
 */
export const getAllPatients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, clinicId, isActive } = req.query;

  const query = {};

  // Filter by clinic
  if (clinicId) {
    query.clinic = clinicId;
  }

  // Search filter
  if (search) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((u) => u._id);
    query.$or = [
      { user: { $in: userIds } },
      { patientId: { $regex: search, $options: "i" } },
    ];
  }

  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate("user", "firstName lastName email phone")
      .populate("clinic", "name")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Patient.countDocuments(query),
  ]);

  successResponse(res, 200, "Patients retrieved successfully", {
    patients,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single patient
 * @route   GET /api/patients/:id
 * @access  Private
 */
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate("user", "firstName lastName email phone avatar")
    .populate("clinic", "name email phone address");

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  successResponse(res, 200, "Patient retrieved successfully", { patient });
});

/**
 * @desc    Update patient
 * @route   PUT /api/patients/:id
 * @access  Private
 */
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Update fields
  const allowedUpdates = [
    "dateOfBirth",
    "gender",
    "bloodGroup",
    "emergencyContact",
    "medicalHistory",
    "insurance",
    "notes",
    "tags",
    "isActive",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      patient[field] = req.body[field];
    }
  });

  // Update last visit
  patient.lastVisit = new Date();

  await patient.save();

  await patient.populate("user", "firstName lastName email phone");
  await patient.populate("clinic", "name");

  successResponse(res, 200, "Patient updated successfully", { patient });
});

/**
 * @desc    Delete patient
 * @route   DELETE /api/patients/:id
 * @access  Private (Admin only)
 */
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Soft delete
  patient.isActive = false;
  await patient.save();

  successResponse(res, 200, "Patient deleted successfully");
});

/**
 * @desc    Get patient medical history
 * @route   GET /api/patients/:id/medical-history
 * @access  Private
 */
export const getPatientMedicalHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).select(
    "medicalHistory user clinic"
  );

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Import dynamically to avoid circular dependencies
  const { default: MedicalRecord } = await import("../models/MedicalRecord.js");
  const { default: Prescription } = await import("../models/Prescription.js");

  const [medicalRecords, prescriptions] = await Promise.all([
    MedicalRecord.find({ patient: req.params.id })
      .populate("doctor", "firstName lastName")
      .sort({ visitDate: -1 })
      .limit(10),
    Prescription.find({ patient: req.params.id })
      .populate("prescribedBy", "firstName lastName")
      .sort({ prescriptionDate: -1 })
      .limit(10),
  ]);

  successResponse(res, 200, "Medical history retrieved successfully", {
    patientHistory: patient.medicalHistory,
    recentRecords: medicalRecords,
    recentPrescriptions: prescriptions,
  });
});

/**
 * @desc    Get patient appointments
 * @route   GET /api/patients/:id/appointments
 * @access  Private
 */
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;

  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Import dynamically
  const { default: Appointment } = await import("../models/Appointment.js");

  const query = { patient: req.params.id };

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.scheduledDate = {};
    if (startDate) query.scheduledDate.$gte = new Date(startDate);
    if (endDate) query.scheduledDate.$lte = new Date(endDate);
  }

  const appointments = await Appointment.find(query)
    .populate("doctor", "firstName lastName")
    .populate("clinic", "name")
    .sort({ scheduledDate: -1 });

  successResponse(res, 200, "Patient appointments retrieved successfully", {
    appointments,
  });
});

/**
 * @desc    Get my patient profile
 * @route   GET /api/patients/my-profile
 * @access  Private (Patient)
 */
export const getMyPatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id })
    .populate("user", "firstName lastName email phone avatar")
    .populate("clinic", "name email phone address");

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  successResponse(res, 200, "Your patient profile retrieved successfully", {
    patient,
  });
});
