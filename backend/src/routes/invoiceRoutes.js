import express from "express";
import {
  cancelInvoice,
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoice,
  getInvoiceStats,
  getMyInvoices,
  recordPayment,
  updateInvoice,
} from "../controller/invoiceController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createInvoiceSchema,
  recordPaymentSchema,
  updateInvoiceSchema,
} from "../validations/invoiceValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-invoices", getMyInvoices);

router.post(
  "/",
  authorize("doctor", "receptionist", "accountant", "admin"),
  validate(createInvoiceSchema),
  createInvoice
);

router.get(
  "/",
  authorize("doctor", "receptionist", "accountant", "admin"),
  getAllInvoices
);

router.get("/stats", authorize("accountant", "admin"), getInvoiceStats);

router.get("/:id", getInvoice);

router.put(
  "/:id",
  authorize("receptionist", "accountant", "admin"),
  validate(updateInvoiceSchema),
  updateInvoice
);

router.delete("/:id", authorize("accountant", "admin"), deleteInvoice);

router.post(
  "/:id/payment",
  authorize("receptionist", "accountant", "admin"),
  validate(recordPaymentSchema),
  recordPayment
);

router.post("/:id/cancel", authorize("accountant", "admin"), cancelInvoice);

export default router;
