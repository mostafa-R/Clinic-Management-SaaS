import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    paymentNumber: {
      type: String,
      unique: true,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "credit-card",
        "debit-card",
        "bank-transfer",
        "online",
        "insurance",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "completed",
    },
    transactionId: {
      type: String,
    },
    paymentGateway: {
      type: String,
      enum: ["stripe", "paypal", "square", "razorpay", "other"],
    },
    cardDetails: {
      last4Digits: String,
      cardType: String,
      cardHolderName: String,
    },
    checkDetails: {
      checkNumber: String,
      bankName: String,
      checkDate: Date,
    },
    onlinePaymentDetails: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    insuranceDetails: {
      provider: String,
      claimNumber: String,
      approvalCode: String,
      claimedAmount: Number,
      approvedAmount: Number,
    },
    refund: {
      amount: Number,
      reason: String,
      refundDate: Date,
      refundMethod: String,
      refundTransactionId: String,
    },
    notes: {
      type: String,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    currency: {
      type: String,
      default: "USD",
    },
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate payment number
paymentSchema.pre("save", async function (next) {
  if (!this.paymentNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    this.paymentNumber = `PAY-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

// Update invoice paid amount after payment is saved
paymentSchema.post("save", async function (doc) {
  if (doc.status === "completed") {
    const Invoice = mongoose.model("Invoice");
    const invoice = await Invoice.findById(doc.invoice);
    if (invoice) {
      invoice.paidAmount += doc.amount;
      await invoice.save();
    }
  }
});

// Indexes
paymentSchema.index({ clinic: 1, paymentDate: -1 });
paymentSchema.index({ invoice: 1 });
paymentSchema.index({ patient: 1 });

export default mongoose.model("Payment", paymentSchema);
