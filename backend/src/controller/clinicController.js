import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Clinic, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

/**
 * @desc    Create new clinic
 * @route   POST /api/clinics
 * @access  Private (Admin only)
 */
export const createClinic = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    website,
    description,
    specializations,
    operatingHours,
    settings,
  } = req.body;

  // Check if clinic with same email already exists
  const existingClinic = await Clinic.findOne({ email });
  if (existingClinic) {
    throw new ApiError(400, "Clinic with this email already exists");
  }

  // Create clinic
  const clinic = await Clinic.create({
    name,
    email,
    phone,
    address,
    website,
    description,
    specializations,
    operatingHours,
    settings,
    owner: req.user._id,
  });

  successResponse(res, 201, "Clinic created successfully", { clinic });
});

/**
 * @desc    Get all clinics
 * @route   GET /api/clinics
 * @access  Private (Admin only)
 */
export const getAllClinics = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, isActive } = req.query;

  const query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { "address.city": { $regex: search, $options: "i" } },
    ];
  }

  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [clinics, total] = await Promise.all([
    Clinic.find(query)
      .populate("owner", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Clinic.countDocuments(query),
  ]);

  successResponse(res, 200, "Clinics retrieved successfully", {
    clinics,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single clinic
 * @route   GET /api/clinics/:id
 * @access  Private
 */
export const getClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id)
    .populate("owner", "firstName lastName email")
    .populate("staff.user", "firstName lastName email phone");

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  successResponse(res, 200, "Clinic retrieved successfully", { clinic });
});

/**
 * @desc    Update clinic
 * @route   PUT /api/clinics/:id
 * @access  Private (Admin or Clinic Owner)
 */
export const updateClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Check if user is owner or admin
  if (
    clinic.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this clinic");
  }

  // Update fields
  const allowedUpdates = [
    "name",
    "email",
    "phone",
    "address",
    "website",
    "description",
    "specializations",
    "logo",
    "operatingHours",
    "settings",
    "isActive",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      clinic[field] = req.body[field];
    }
  });

  await clinic.save();

  successResponse(res, 200, "Clinic updated successfully", { clinic });
});

/**
 * @desc    Delete clinic
 * @route   DELETE /api/clinics/:id
 * @access  Private (Admin only)
 */
export const deleteClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Soft delete
  clinic.isActive = false;
  await clinic.save();

  successResponse(res, 200, "Clinic deleted successfully");
});

/**
 * @desc    Add staff member to clinic
 * @route   POST /api/clinics/:id/staff
 * @access  Private (Admin or Clinic Owner)
 */
export const addStaffMember = asyncHandler(async (req, res) => {
  const { userId, role, specialization, licenseNumber } = req.body;

  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Check authorization
  if (
    clinic.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to add staff to this clinic");
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if user is already staff
  const existingStaff = clinic.staff.find((s) => s.user.toString() === userId);
  if (existingStaff) {
    throw new ApiError(400, "User is already a staff member");
  }

  // Add staff member
  clinic.staff.push({
    user: userId,
    role,
    specialization,
    licenseNumber,
    joinedDate: new Date(),
    isActive: true,
  });

  await clinic.save();

  // Populate the new staff member
  await clinic.populate("staff.user", "firstName lastName email phone");

  successResponse(res, 200, "Staff member added successfully", { clinic });
});

/**
 * @desc    Remove staff member from clinic
 * @route   DELETE /api/clinics/:id/staff/:staffId
 * @access  Private (Admin or Clinic Owner)
 */
export const removeStaffMember = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Check authorization
  if (
    clinic.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to remove staff from this clinic");
  }

  // Find and remove staff member
  const staffIndex = clinic.staff.findIndex(
    (s) => s.user.toString() === req.params.staffId
  );

  if (staffIndex === -1) {
    throw new ApiError(404, "Staff member not found");
  }

  clinic.staff.splice(staffIndex, 1);
  await clinic.save();

  successResponse(res, 200, "Staff member removed successfully");
});

/**
 * @desc    Get clinic statistics
 * @route   GET /api/clinics/:id/stats
 * @access  Private
 */
export const getClinicStats = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);

  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  // Import models dynamically to avoid circular dependencies
  const { default: Patient } = await import("../models/Patient.js");
  const { default: Appointment } = await import("../models/Appointment.js");
  const { default: Invoice } = await import("../models/Invoice.js");

  const [
    totalPatients,
    activePatients,
    todayAppointments,
    totalAppointments,
    pendingInvoices,
    totalRevenue,
  ] = await Promise.all([
    Patient.countDocuments({ clinic: req.params.id }),
    Patient.countDocuments({ clinic: req.params.id, isActive: true }),
    Appointment.countDocuments({
      clinic: req.params.id,
      scheduledDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    }),
    Appointment.countDocuments({ clinic: req.params.id }),
    Invoice.countDocuments({
      clinic: req.params.id,
      status: { $in: ["pending", "partially-paid"] },
    }),
    Invoice.aggregate([
      { $match: { clinic: clinic._id, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const stats = {
    patients: {
      total: totalPatients,
      active: activePatients,
    },
    appointments: {
      today: todayAppointments,
      total: totalAppointments,
    },
    invoices: {
      pending: pendingInvoices,
    },
    revenue: {
      total: totalRevenue[0]?.total || 0,
    },
    staff: {
      total: clinic.staff.length,
      active: clinic.staff.filter((s) => s.isActive).length,
    },
  };

  successResponse(res, 200, "Clinic statistics retrieved successfully", {
    stats,
  });
});

/**
 * @desc    Get my clinics (for clinic owners/staff)
 * @route   GET /api/clinics/my-clinics
 * @access  Private
 */
export const getMyClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find({
    $or: [
      { owner: req.user._id },
      { "staff.user": req.user._id, "staff.isActive": true },
    ],
    isActive: true,
  }).populate("owner", "firstName lastName email");

  successResponse(res, 200, "Your clinics retrieved successfully", {
    clinics,
  });
});
