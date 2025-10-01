import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },
    medicalHistory: {
      allergies: [
        {
          name: String,
          severity: {
            type: String,
            enum: ["mild", "moderate", "severe"],
          },
          notes: String,
        },
      ],
      chronicDiseases: [
        {
          name: String,
          diagnosedDate: Date,
          notes: String,
        },
      ],
      surgeries: [
        {
          name: String,
          date: Date,
          hospital: String,
          notes: String,
        },
      ],
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
          startDate: Date,
          endDate: Date,
          prescribedBy: String,
        },
      ],
      familyHistory: [
        {
          condition: String,
          relationship: String,
          notes: String,
        },
      ],
    },
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      expiryDate: Date,
      coverageDetails: String,
    },
    notes: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastVisit: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate patient ID
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    const count = await this.constructor.countDocuments({
      clinic: this.clinic,
    });
    this.patientId = `PAT-${this.clinic.toString().slice(-6)}-${(count + 1)
      .toString()
      .padStart(5, "0")}`;
  }
  next();
});

// Indexes
patientSchema.index({ clinic: 1, user: 1 });

export default mongoose.model("Patient", patientSchema);
