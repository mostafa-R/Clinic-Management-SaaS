import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import { Clinic, Invoice, Patient, Payment } from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createPayment = asyncHandler(async (req, res) => {
  const {
    invoiceId,
    patientId,
    clinicId,
    amount,
    paymentMethod,
    paymentDate,
    transactionId,
    cardDetails,
    notes,
  } = req.body;

  const [invoice, patient, clinic] = await Promise.all([
    Invoice.findById(invoiceId),
    Patient.findById(patientId),
    Clinic.findById(clinicId),
  ]);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }
  if (!clinic) {
    throw new ApiError(404, "Clinic not found");
  }

  if (invoice.status === "cancelled") {
    throw new ApiError(400, "Cannot add payment to a cancelled invoice");
  }

  if (amount > invoice.balanceDue) {
    throw new ApiError(
      400,
      `Payment amount exceeds balance due. Balance: ${invoice.balanceDue}`
    );
  }

  const payment = await Payment.create({
    invoice: invoiceId,
    patient: patientId,
    clinic: clinicId,
    amount,
    paymentMethod,
    paymentDate,
    transactionId,
    cardDetails,
    notes,
    receivedBy: req.user._id,
    status: "completed",
  });

  invoice.amountPaid += amount;
  invoice.balanceDue -= amount;

  if (invoice.balanceDue === 0) {
    invoice.status = "paid";
  } else if (invoice.amountPaid > 0) {
    invoice.status = "partially-paid";
  }

  await invoice.save();

  await payment.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
    { path: "receivedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 201, "Payment created successfully", {
    payment,
    invoice: {
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue,
      status: invoice.status,
    },
  });
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    clinicId,
    invoiceId,
    paymentMethod,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};

  if (patientId) query.patient = patientId;
  if (clinicId) query.clinic = clinicId;
  if (invoiceId) query.invoice = invoiceId;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("clinic", "name")
      .populate("invoice", "invoiceNumber totalAmount")
      .populate("receivedBy", "firstName lastName")
      .sort({ paymentDate: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Payment.countDocuments(query),
  ]);

  successResponse(res, 200, "Payments retrieved successfully", {
    payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("clinic", "name address email phone")
    .populate("invoice")
    .populate("receivedBy", "firstName lastName email")
    .populate("refundedBy", "firstName lastName");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  successResponse(res, 200, "Payment retrieved successfully", { payment });
});

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "refunded") {
    throw new ApiError(400, "Cannot update a refunded payment");
  }

  const allowedUpdates = ["paymentMethod", "transactionId", "status", "notes"];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      payment[field] = req.body[field];
    }
  });

  if (req.body.amount && req.body.amount !== payment.amount) {
    const invoice = await Invoice.findById(payment.invoice);
    const amountDifference = req.body.amount - payment.amount;

    invoice.amountPaid += amountDifference;
    invoice.balanceDue -= amountDifference;

    if (invoice.balanceDue === 0) {
      invoice.status = "paid";
    } else if (invoice.balanceDue > 0 && invoice.amountPaid > 0) {
      invoice.status = "partially-paid";
    } else if (invoice.amountPaid === 0) {
      invoice.status = "pending";
    }

    await invoice.save();
    payment.amount = req.body.amount;
  }

  await payment.save();

  await payment.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 200, "Payment updated successfully", { payment });
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "refunded") {
    throw new ApiError(400, "Cannot delete a refunded payment");
  }

  const invoice = await Invoice.findById(payment.invoice);

  if (invoice) {
    invoice.amountPaid -= payment.amount;
    invoice.balanceDue += payment.amount;

    if (invoice.amountPaid === 0) {
      invoice.status = "pending";
    } else if (invoice.balanceDue > 0) {
      invoice.status = "partially-paid";
    }

    await invoice.save();
  }

  await payment.deleteOne();

  successResponse(res, 200, "Payment deleted successfully");
});

export const refundPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, reason, notes } = req.body;

  const payment = await Payment.findById(id);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (payment.status === "refunded") {
    throw new ApiError(400, "Payment has already been refunded");
  }

  if (amount > payment.amount) {
    throw new ApiError(400, "Refund amount cannot exceed payment amount");
  }

  const invoice = await Invoice.findById(payment.invoice);

  payment.status = "refunded";
  payment.refundAmount = amount;
  payment.refundReason = reason;
  payment.refundDate = new Date();
  payment.refundedBy = req.user._id;
  payment.notes = notes || payment.notes;

  invoice.amountPaid -= amount;
  invoice.balanceDue += amount;

  if (invoice.amountPaid === 0) {
    invoice.status = "pending";
  } else if (invoice.balanceDue > 0) {
    invoice.status = "partially-paid";
  }

  await Promise.all([payment.save(), invoice.save()]);

  await payment.populate([
    { path: "refundedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 200, "Payment refunded successfully", {
    payment,
    invoice: {
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue,
      status: invoice.status,
    },
  });
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const payments = await Payment.find({ patient: patient._id })
    .populate("clinic", "name")
    .populate("invoice", "invoiceNumber totalAmount")
    .sort({ paymentDate: -1 });

  const summary = {
    totalPayments: payments.length,
    totalAmount: payments
      .filter((p) => p.status !== "refunded")
      .reduce((sum, p) => sum + p.amount, 0),
    totalRefunded: payments
      .filter((p) => p.status === "refunded")
      .reduce((sum, p) => sum + (p.refundAmount || 0), 0),
  };

  successResponse(res, 200, "Your payments retrieved successfully", {
    summary,
    payments,
  });
});

export const getPaymentStats = asyncHandler(async (req, res) => {
  const { clinicId, startDate, endDate } = req.query;

  const query = { status: "completed" };
  if (clinicId) query.clinic = clinicId;

  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  const [totalStats, methodStats, refundStats] = await Promise.all([
    Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
    Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ]),
    Payment.aggregate([
      { $match: { ...query, status: "refunded" } },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: 1 },
          totalRefundAmount: { $sum: "$refundAmount" },
        },
      },
    ]),
  ]);

  const stats = {
    overview: totalStats[0] || { totalPayments: 0, totalAmount: 0 },
    byMethod: methodStats,
    refunds: refundStats[0] || { totalRefunds: 0, totalRefundAmount: 0 },
  };

  successResponse(res, 200, "Payment statistics retrieved successfully", {
    stats,
  });
});
