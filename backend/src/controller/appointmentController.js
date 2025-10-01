import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Appointment, Clinic, Patient, User } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";
import { sendAppointmentReminder } from "../utils/emailService.js";

/**
 * @desc    Create new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    clinicId,
    patientId,
    doctorId,
    scheduledDate,
    scheduledTime,
    duration,
    type,
    reason,
    symptoms,
    notes,
    bookingSource,
  } = req.body;

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  const patient = await Patient.findById(patientId).populate("user");
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(404, "Doctor not found");
  }

  const conflict = await Appointment.findOne({
    doctor: doctorId,
    scheduledDate: new Date(scheduledDate),
    status: { $nin: ["cancelled", "completed"] },
    $or: [
      {
        "scheduledTime.start": {
          $lte: scheduledTime.start,
        },
        "scheduledTime.end": {
          $gt: scheduledTime.start,
        },
      },
      {
        "scheduledTime.start": {
          $lt: scheduledTime.end,
        },
        "scheduledTime.end": {
          $gte: scheduledTime.end,
        },
      },
    ],
  });

  if (conflict) {
    throw new ApiError(
      409,
      "This time slot is already booked. Please choose another time."
    );
  }

  const appointment = await Appointment.create({
    clinic: clinicId,
    patient: patientId,
    doctor: doctorId,
    scheduledDate: new Date(scheduledDate),
    scheduledTime,
    duration,
    type,
    reason,
    symptoms,
    notes,
    bookedBy: req.user._id,
    bookingSource,
  });

  await appointment.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    },
    { path: "doctor", select: "firstName lastName email" },
    { path: "clinic", select: "name address" },
  ]);

  try {
    const patientUser = patient.user;
    await sendAppointmentReminder(patientUser.email, patientUser.firstName, {
      date: new Date(scheduledDate).toLocaleDateString(),
      time: scheduledTime.start,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      clinicName: clinic.name,
    });
  } catch (error) {
    console.error("Failed to send appointment confirmation:", error);
  }

  successResponse(res, 201, "Appointment created successfully", {
    appointment,
  });
});

/**
 * @desc    Get all appointments
 * @route   GET /api/appointments
 * @access  Private
 */
export const getAllAppointments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    clinicId,
    doctorId,
    patientId,
    startDate,
    endDate,
    type,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (clinicId) query.clinic = clinicId;
  if (doctorId) query.doctor = doctorId;
  if (patientId) query.patient = patientId;
  if (type) query.type = type;

  // Date range filter
  if (startDate || endDate) {
    query.scheduledDate = {};
    if (startDate) query.scheduledDate.$gte = new Date(startDate);
    if (endDate) query.scheduledDate.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate("patient", "patientId user")
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName email phone" },
      })
      .populate("doctor", "firstName lastName email")
      .populate("clinic", "name")
      .sort({ scheduledDate: -1, "scheduledTime.start": -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Appointment.countDocuments(query),
  ]);

  successResponse(res, 200, "Appointments retrieved successfully", {
    appointments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get single appointment
 * @route   GET /api/appointments/:id
 * @access  Private
 */
export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("doctor", "firstName lastName email phone")
    .populate("clinic", "name email phone address")
    .populate("bookedBy", "firstName lastName");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  successResponse(res, 200, "Appointment retrieved successfully", {
    appointment,
  });
});

/**
 * @desc    Update appointment
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Check if appointment can be updated
  if (
    appointment.status === "completed" ||
    appointment.status === "cancelled"
  ) {
    throw new ApiError(
      400,
      "Cannot update completed or cancelled appointments"
    );
  }

  // Update fields
  const allowedUpdates = [
    "scheduledDate",
    "scheduledTime",
    "duration",
    "type",
    "status",
    "reason",
    "symptoms",
    "notes",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      appointment[field] = req.body[field];
    }
  });

  await appointment.save();

  await appointment.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "doctor", select: "firstName lastName" },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 200, "Appointment updated successfully", {
    appointment,
  });
});

/**
 * @desc    Cancel appointment
 * @route   POST /api/appointments/:id/cancel
 * @access  Private
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (
    appointment.status === "completed" ||
    appointment.status === "cancelled"
  ) {
    throw new ApiError(400, "Appointment is already completed or cancelled");
  }

  appointment.status = "cancelled";
  appointment.cancelReason = cancelReason;
  appointment.cancelledBy = req.user._id;
  appointment.cancelledAt = new Date();

  await appointment.save();

  successResponse(res, 200, "Appointment cancelled successfully");
});

/**
 * @desc    Reschedule appointment
 * @route   POST /api/appointments/:id/reschedule
 * @access  Private
 */
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { newDate, newTime } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (
    appointment.status === "completed" ||
    appointment.status === "cancelled"
  ) {
    throw new ApiError(
      400,
      "Cannot reschedule completed or cancelled appointments"
    );
  }

  // Check for conflicts with the new time
  const conflict = await Appointment.findOne({
    doctor: appointment.doctor,
    scheduledDate: new Date(newDate),
    _id: { $ne: appointment._id },
    status: { $nin: ["cancelled", "completed"] },
    $or: [
      {
        "scheduledTime.start": { $lte: newTime.start },
        "scheduledTime.end": { $gt: newTime.start },
      },
      {
        "scheduledTime.start": { $lt: newTime.end },
        "scheduledTime.end": { $gte: newTime.end },
      },
    ],
  });

  if (conflict) {
    throw new ApiError(409, "The new time slot is already booked");
  }

  // Create reference to old appointment
  appointment.rescheduledFrom = appointment._id;
  appointment.scheduledDate = new Date(newDate);
  appointment.scheduledTime = newTime;
  appointment.status = "rescheduled";

  await appointment.save();

  successResponse(res, 200, "Appointment rescheduled successfully", {
    appointment,
  });
});

/**
 * @desc    Mark appointment as completed
 * @route   POST /api/appointments/:id/complete
 * @access  Private (Doctor, Admin)
 */
export const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.status === "cancelled") {
    throw new ApiError(400, "Cannot complete a cancelled appointment");
  }

  appointment.status = "completed";
  appointment.actualEndTime = new Date();

  await appointment.save();

  successResponse(res, 200, "Appointment marked as completed");
});

/**
 * @desc    Get today's appointments
 * @route   GET /api/appointments/today
 * @access  Private
 */
export const getTodayAppointments = asyncHandler(async (req, res) => {
  const { clinicId, doctorId } = req.query;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const query = {
    scheduledDate: {
      $gte: today,
      $lt: tomorrow,
    },
  };

  if (clinicId) query.clinic = clinicId;
  if (doctorId) query.doctor = doctorId;

  const appointments = await Appointment.find(query)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName phone" },
    })
    .populate("doctor", "firstName lastName")
    .sort({ "scheduledTime.start": 1 });

  successResponse(res, 200, "Today's appointments retrieved successfully", {
    appointments,
  });
});

/**
 * @desc    Get my appointments (for patients)
 * @route   GET /api/appointments/my-appointments
 * @access  Private (Patient)
 */
export const getMyAppointments = asyncHandler(async (req, res) => {
  const { status, upcoming } = req.query;

  const { default: Patient } = await import("../models/Patient.js");
  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const query = { patient: patient._id };

  if (status) {
    query.status = status;
  }

  if (upcoming === "true") {
    query.scheduledDate = { $gte: new Date() };
    query.status = { $in: ["scheduled", "confirmed"] };
  }

  const appointments = await Appointment.find(query)
    .populate("doctor", "firstName lastName email")
    .populate("clinic", "name address phone")
    .sort({ scheduledDate: 1, "scheduledTime.start": 1 });

  successResponse(res, 200, "Your appointments retrieved successfully", {
    appointments,
  });
});
