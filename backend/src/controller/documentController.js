import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Clinic, Document, Patient } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createDocument = asyncHandler(async (req, res) => {
  const {
    patientId,
    clinicId,
    appointmentId,
    medicalRecordId,
    title,
    description,
    category,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    tags,
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

  const document = await Document.create({
    patient: patientId,
    clinic: clinicId,
    appointment: appointmentId || null,
    medicalRecord: medicalRecordId || null,
    title,
    description,
    category,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    tags,
    uploadedBy: req.user._id,
  });

  await document.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
    { path: "uploadedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 201, "Document uploaded successfully", { document });
});

export const getAllDocuments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    clinicId,
    category,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  if (patientId) query.patient = patientId;
  if (clinicId) query.clinic = clinicId;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [documents, total] = await Promise.all([
    Document.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("clinic", "name")
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Document.countDocuments(query),
  ]);

  successResponse(res, 200, "Documents retrieved successfully", {
    documents,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("clinic", "name address")
    .populate("appointment")
    .populate("medicalRecord")
    .populate("uploadedBy", "firstName lastName email");

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  successResponse(res, 200, "Document retrieved successfully", { document });
});

export const updateDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const allowedUpdates = ["title", "description", "category", "tags"];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      document[field] = req.body[field];
    }
  });

  await document.save();

  await document.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 200, "Document updated successfully", { document });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  await document.deleteOne();

  successResponse(res, 200, "Document deleted successfully");
});

export const getMyDocuments = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const query = { patient: patient._id };
  if (category) query.category = category;

  const documents = await Document.find(query)
    .populate("clinic", "name")
    .populate("uploadedBy", "firstName lastName")
    .sort({ createdAt: -1 });

  successResponse(res, 200, "Your documents retrieved successfully", {
    documents,
  });
});

export const getDocumentsByCategory = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const documents = await Document.aggregate([
    { $match: { patient: patient._id } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalSize: { $sum: "$fileSize" },
        documents: { $push: "$$ROOT" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  successResponse(res, 200, "Documents by category retrieved successfully", {
    documents,
  });
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  document.downloadCount += 1;
  document.lastDownloaded = new Date();
  await document.save();

  successResponse(res, 200, "Document download link retrieved successfully", {
    fileUrl: document.fileUrl,
    fileName: document.fileName,
    mimeType: document.mimeType,
  });
});
