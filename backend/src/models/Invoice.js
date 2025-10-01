import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: [
            "consultation",
            "procedure",
            "medication",
            "lab-test",
            "imaging",
            "other",
          ],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
        tax: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "partially-paid",
        "paid",
        "overdue",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially-paid", "paid"],
      default: "unpaid",
    },
    notes: {
      type: String,
    },
    terms: {
      type: String,
    },
    currency: {
      type: String,
      default: "USD",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments({
      clinic: this.clinic,
    });
    const date = new Date();
    this.invoiceNumber = `INV-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

// Calculate balance before save
invoiceSchema.pre("save", function (next) {
  this.balance = this.totalAmount - this.paidAmount;

  // Update payment status
  if (this.paidAmount === 0) {
    this.paymentStatus = "unpaid";
    if (this.status === "paid") this.status = "pending";
  } else if (this.paidAmount >= this.totalAmount) {
    this.paymentStatus = "paid";
    this.status = "paid";
  } else {
    this.paymentStatus = "partially-paid";
    this.status = "partially-paid";
  }

  next();
});

// Indexes
invoiceSchema.index({ clinic: 1, invoiceDate: -1 });
invoiceSchema.index({ patient: 1 });
invoiceSchema.index({ status: 1 });

export default mongoose.model("Invoice", invoiceSchema);
