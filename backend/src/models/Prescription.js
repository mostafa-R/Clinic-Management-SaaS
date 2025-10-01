import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
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
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicalRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
    },
    prescriptionNumber: {
      type: String,
      unique: true,
    },
    prescriptionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        genericName: String,
        dosage: {
          type: String,
          required: true,
        },
        form: {
          type: String,
          enum: [
            "tablet",
            "capsule",
            "syrup",
            "injection",
            "drops",
            "cream",
            "inhaler",
            "other",
          ],
        },
        route: {
          type: String,
          enum: [
            "oral",
            "topical",
            "intravenous",
            "intramuscular",
            "subcutaneous",
            "inhalation",
            "other",
          ],
        },
        frequency: {
          type: String,
          required: true, // "3 times daily", "twice daily", etc.
        },
        duration: {
          value: Number,
          unit: {
            type: String,
            enum: ["days", "weeks", "months"],
          },
        },
        quantity: Number,
        instructions: String,
        beforeFood: {
          type: Boolean,
          default: false,
        },
      },
    ],
    diagnosis: {
      type: String,
    },
    instructions: {
      type: String,
    },
    validUntil: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    pharmacyDispensed: {
      pharmacyName: String,
      dispensedDate: Date,
      dispensedBy: String,
    },
    refills: {
      allowed: {
        type: Number,
        default: 0,
      },
      remaining: {
        type: Number,
        default: 0,
      },
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate prescription number
prescriptionSchema.pre("save", async function (next) {
  if (!this.prescriptionNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    this.prescriptionNumber = `RX-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

// Indexes
prescriptionSchema.index({ patient: 1, prescriptionDate: -1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ clinic: 1 });

export default mongoose.model("Prescription", prescriptionSchema);
