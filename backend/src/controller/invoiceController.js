import { ApiError, asyncHandler } from "../middlewares/errorHandler.js";
import {
  Appointment,
  Clinic,
  Invoice,
  Patient,
  Payment,
} from "../models/index.js";
import { successResponse } from "../utils/apiResponse.js";

export const createInvoice = asyncHandler(async (req, res) => {
  const {
    patientId,
    clinicId,
    appointmentId,
    invoiceDate,
    dueDate,
    items,
    discount,
    tax,
    notes,
    insuranceClaimNumber,
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

  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
  }

  let subtotal = 0;
  const processedItems = items.map((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemDiscount = (itemTotal * (item.discount || 0)) / 100;
    const itemTax = ((itemTotal - itemDiscount) * (item.tax || 0)) / 100;
    const total = itemTotal - itemDiscount + itemTax;

    subtotal += total;

    return {
      ...item,
      amount: total,
    };
  });

  const invoiceDiscount = (subtotal * (discount || 0)) / 100;
  const invoiceTax = ((subtotal - invoiceDiscount) * (tax || 0)) / 100;
  const totalAmount = subtotal - invoiceDiscount + invoiceTax;

  const invoice = await Invoice.create({
    patient: patientId,
    clinic: clinicId,
    appointment: appointmentId || null,
    invoiceDate,
    dueDate,
    items: processedItems,
    subtotal,
    discount: invoiceDiscount,
    tax: invoiceTax,
    totalAmount,
    amountPaid: 0,
    balanceDue: totalAmount,
    status: "pending",
    notes,
    insuranceClaimNumber,
    issuedBy: req.user._id,
  });

  await invoice.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName email" },
    },
    { path: "clinic", select: "name address email phone" },
    { path: "issuedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 201, "Invoice created successfully", { invoice });
});

export const getAllInvoices = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    clinicId,
    status,
    startDate,
    endDate,
    overdue,
  } = req.query;

  const query = {};

  if (patientId) query.patient = patientId;
  if (clinicId) query.clinic = clinicId;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.invoiceDate = {};
    if (startDate) query.invoiceDate.$gte = new Date(startDate);
    if (endDate) query.invoiceDate.$lte = new Date(endDate);
  }

  if (overdue === "true") {
    query.dueDate = { $lt: new Date() };
    query.status = { $in: ["pending", "partially-paid"] };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("clinic", "name")
      .populate("issuedBy", "firstName lastName")
      .sort({ invoiceDate: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    Invoice.countDocuments(query),
  ]);

  successResponse(res, 200, "Invoices retrieved successfully", {
    invoices,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate({
      path: "patient",
      populate: { path: "user", select: "firstName lastName email phone" },
    })
    .populate("clinic", "name address email phone")
    .populate("appointment")
    .populate("issuedBy", "firstName lastName email");

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const payments = await Payment.find({ invoice: req.params.id }).sort({
    paymentDate: -1,
  });

  successResponse(res, 200, "Invoice retrieved successfully", {
    invoice,
    payments,
  });
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "paid") {
    throw new ApiError(400, "Cannot update a paid invoice");
  }

  if (req.body.items) {
    let subtotal = 0;
    const processedItems = req.body.items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = (itemTotal * (item.discount || 0)) / 100;
      const itemTax = ((itemTotal - itemDiscount) * (item.tax || 0)) / 100;
      const total = itemTotal - itemDiscount + itemTax;

      subtotal += total;

      return {
        ...item,
        amount: total,
      };
    });

    const discount = req.body.discount || 0;
    const tax = req.body.tax || 0;
    const invoiceDiscount = (subtotal * discount) / 100;
    const invoiceTax = ((subtotal - invoiceDiscount) * tax) / 100;
    const totalAmount = subtotal - invoiceDiscount + invoiceTax;

    invoice.items = processedItems;
    invoice.subtotal = subtotal;
    invoice.discount = invoiceDiscount;
    invoice.tax = invoiceTax;
    invoice.totalAmount = totalAmount;
    invoice.balanceDue = totalAmount - invoice.amountPaid;
  }

  const allowedUpdates = ["dueDate", "notes", "status", "insuranceClaimNumber"];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      invoice[field] = req.body[field];
    }
  });

  await invoice.save();

  await invoice.populate([
    {
      path: "patient",
      populate: { path: "user", select: "firstName lastName" },
    },
    { path: "clinic", select: "name" },
  ]);

  successResponse(res, 200, "Invoice updated successfully", { invoice });
});

export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "paid" || invoice.status === "partially-paid") {
    throw new ApiError(
      400,
      "Cannot delete an invoice with payments. Please refund payments first."
    );
  }

  await invoice.deleteOne();

  successResponse(res, 200, "Invoice deleted successfully");
});

export const recordPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod, transactionId, notes } = req.body;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "paid") {
    throw new ApiError(400, "Invoice is already fully paid");
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
    invoice: id,
    patient: invoice.patient,
    clinic: invoice.clinic,
    amount,
    paymentMethod,
    paymentDate: new Date(),
    transactionId,
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
    { path: "receivedBy", select: "firstName lastName" },
  ]);

  successResponse(res, 200, "Payment recorded successfully", {
    payment,
    invoice: {
      totalAmount: invoice.totalAmount,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue,
      status: invoice.status,
    },
  });
});

export const cancelInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  if (invoice.status === "paid") {
    throw new ApiError(400, "Cannot cancel a paid invoice");
  }

  if (invoice.amountPaid > 0) {
    throw new ApiError(
      400,
      "Cannot cancel an invoice with payments. Please refund payments first."
    );
  }

  invoice.status = "cancelled";
  await invoice.save();

  successResponse(res, 200, "Invoice cancelled successfully");
});

export const getMyInvoices = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const patient = await Patient.findOne({ user: req.user._id });

  if (!patient) {
    throw new ApiError(404, "Patient profile not found");
  }

  const query = { patient: patient._id };
  if (status) query.status = status;

  const invoices = await Invoice.find(query)
    .populate("clinic", "name address phone")
    .sort({ invoiceDate: -1 });

  const summary = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalPaid: invoices.reduce((sum, inv) => sum + inv.amountPaid, 0),
    totalDue: invoices.reduce((sum, inv) => sum + inv.balanceDue, 0),
  };

  successResponse(res, 200, "Your invoices retrieved successfully", {
    summary,
    invoices,
  });
});

export const getInvoiceStats = asyncHandler(async (req, res) => {
  const { clinicId, startDate, endDate } = req.query;

  const query = {};
  if (clinicId) query.clinic = clinicId;

  if (startDate || endDate) {
    query.invoiceDate = {};
    if (startDate) query.invoiceDate.$gte = new Date(startDate);
    if (endDate) query.invoiceDate.$lte = new Date(endDate);
  }

  const [totalStats, statusStats, overdueCount] = await Promise.all([
    Invoice.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$amountPaid" },
          totalDue: { $sum: "$balanceDue" },
        },
      },
    ]),
    Invoice.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amount: { $sum: "$totalAmount" },
        },
      },
    ]),
    Invoice.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $in: ["pending", "partially-paid"] },
    }),
  ]);

  const stats = {
    overview: totalStats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
    },
    byStatus: statusStats,
    overdue: overdueCount,
  };

  successResponse(res, 200, "Invoice statistics retrieved successfully", {
    stats,
  });
});
