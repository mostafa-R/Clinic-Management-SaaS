import express from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getMyPayments,
  getPayment,
  getPaymentStats,
  refundPayment,
  updatePayment,
} from "../controller/paymentController.js";
import { authorize, protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validator.js";
import {
  createPaymentSchema,
  refundPaymentSchema,
  updatePaymentSchema,
} from "../validations/paymentValidation.js";

const router = express.Router();

router.use(protect);

router.get("/my-payments", getMyPayments);

router.post(
  "/",
  authorize("receptionist", "accountant", "admin"),
  validate(createPaymentSchema),
  createPayment
);

router.get(
  "/",
  authorize("receptionist", "accountant", "admin"),
  getAllPayments
);

router.get("/stats", authorize("accountant", "admin"), getPaymentStats);

router.get("/:id", getPayment);

router.put(
  "/:id",
  authorize("accountant", "admin"),
  validate(updatePaymentSchema),
  updatePayment
);

router.delete("/:id", authorize("accountant", "admin"), deletePayment);

router.post(
  "/:id/refund",
  authorize("accountant", "admin"),
  validate(refundPaymentSchema),
  refundPayment
);

export default router;
