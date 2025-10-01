import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import {
  Clinic,
  MedicalRecord,
  Patient,
  Prescription,
} from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createPrescription = asyncHandler(async (req, res) => {
  const {
    patientId,
    clinicId,
    medicalRecordId,
    prescriptionDate,
    medications,
    diagnosis,
    notes,
    validUntil,
    refillsAllowed,
  } = req.body;

  const [patient, clinic] = await Promise.all([
    Patient.findById(patientId),
    Clinic.findById(clinicId),
  ]);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  if (medicalRecordId) {
    const medicalRecord = await MedicalRecord.findById(medicalRecordId);
    if (!medicalRecord) {
      throw new ApiError(404, "Medical record not found");
    }
  }

  const prescription = await Prescription.create({
    patient: patientId,
    clinic: clinicId,
    prescribedBy: req.user._id,
    medicalRecord: medicalRecordId || null,
    prescriptionDate,
    medications,
    diagnosis,
    notes,
    validUntil,
    refillsAllowed,
  });

  await prescription.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName email" },
    },
    { path: "prescribedBy", select: "firstName lastName" },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 201, "Prescription created successfully", {
    prescription,
  });
});

export const getAllPrescriptions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    clinicId,
    prescribedBy,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  if (patientId) query.patient = patientId;
  if (clinicId) query.clinic = clinicId;
  if (prescribedBy) query.prescribedBy = prescribedBy;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.prescriptionDate = {};
    if (startDate) query.prescriptionDate.$gte = new Date(startDate);
    if (endDate) query.prescriptionDate.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("prescribedBy", "firstName lastName")
      .populate("clinic", "name")
      .sort({ prescriptionDate: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Prescription.countDocuments(query),
  ]);

  successResponse(res, 200, "Prescriptions retrieved successfully", {
    prescriptions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("prescribedBy", "firstName lastName email phone")
    .populate("clinic", "name email phone address")
    .populate("medicalRecord");

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  successResponse(res, 200, "Prescription retrieved successfully", {
    prescription,
  });
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.prescribedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own prescriptions");
  }

  if (prescription.status === "completed") {
    throw new ApiError(400, "Cannot update completed prescription");
  }

  const allowedUpdates = [
    "medications",
    "diagnosis",
    "notes",
    "status",
    "validUntil",
    "refillsAllowed",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      prescription[field] = req.body[field];
    }
  });

  await prescription.save();

  await prescription.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "prescribedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 200, "Prescription updated successfully", {
    prescription,
  });
});

export const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (
    prescription.prescribedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this prescription");
  }

  await prescription.deleteOne();

  successResponse(res, 200, "Prescription deleted successfully");
});

export const refillPrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const prescription = await Prescription.findById(id).populate({
    path: "patient",
    populate: { path: "user", select: "firstName lastName email" },
  });

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.status !== "active") {
    throw new ApiError(400, "Prescription is not active");
  }

  if (prescription.refillCount >= prescription.refillsAllowed) {
    throw new ApiError(400, "No refills remaining");
  }

  if (prescription.validUntil && new Date() > prescription.validUntil) {
    throw new ApiError(400, "Prescription has expired");
  }

  prescription.refillCount += 1;
  prescription.refillHistory.push({
    date: new Date(),
    refillNumber: prescription.refillCount,
    reason: reason || "Regular refill",
  });

  if (prescription.refillCount >= prescription.refillsAllowed) {
    prescription.status = "completed";
  }

  await prescription.save();

  successResponse(res, 200, "Prescription refilled successfully", {
    prescription,
    remainingRefills: prescription.refillsAllowed - prescription.refillCount,
  });
});

export const cancelPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (prescription.prescribedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only cancel your own prescriptions");
  }

  if (prescription.status === "completed") {
    throw new ApiError(400, "Cannot cancel completed prescription");
  }

  prescription.status = "cancelled";
  await prescription.save();

  successResponse(res, 200, "Prescription cancelled successfully");
});

export const getMyPrescriptions = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const query = { patient: patient._id };
  if (status) query.status = status;

  const prescriptions = await Prescription.find(query)
    .populate("prescribedBy", "firstName lastName")
    .populate("clinic", "name address phone")
    .sort({ prescriptionDate: -1 });

  successResponse(res, 200, "Your prescriptions retrieved successfully", {
    prescriptions,
  });
});

export const getActivePrescriptions = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const prescriptions = await Prescription.find({
    patient: patientId,
    status: "active",
    $or: [{ validUntil: { $gte: new Date() } }, { validUntil: null }],
  })
    .populate("prescribedBy", "firstName lastName")
    .populate("clinic", "name")
    .sort({ prescriptionDate: -1 });

  successResponse(res, 200, "Active prescriptions retrieved successfully", {
    prescriptions,
  });
});
