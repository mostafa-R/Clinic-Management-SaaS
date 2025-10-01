import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
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
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    visitType: {
      type: String,
      enum: ["consultation", "follow-up", "emergency", "check-up"],
      default: "consultation",
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    symptoms: [
      {
        name: String,
        duration: String,
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
      },
    ],
    vitals: {
      temperature: {
        value: Number,
        unit: {
          type: String,
          default: "C",
        },
      },
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: {
        value: Number,
        unit: {
          type: String,
          default: "bpm",
        },
      },
      respiratoryRate: {
        value: Number,
        unit: {
          type: String,
          default: "breaths/min",
        },
      },
      oxygenSaturation: {
        value: Number,
        unit: {
          type: String,
          default: "%",
        },
      },
      weight: {
        value: Number,
        unit: {
          type: String,
          default: "kg",
        },
      },
      height: {
        value: Number,
        unit: {
          type: String,
          default: "cm",
        },
      },
      bmi: Number,
    },
    examination: {
      type: String,
    },
    diagnosis: [
      {
        code: String, // ICD-10 code
        name: String,
        type: {
          type: String,
          enum: ["primary", "secondary"],
        },
        notes: String,
      },
    ],
    investigations: [
      {
        type: String, // "Blood Test", "X-Ray", etc.
        orderedDate: Date,
        status: {
          type: String,
          enum: ["ordered", "completed", "pending", "cancelled"],
          default: "ordered",
        },
        results: String,
        document: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },
      },
    ],
    treatmentPlan: {
      type: String,
    },
    notes: {
      type: String,
    },
    followUpDate: {
      type: Date,
    },
    followUpInstructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ clinic: 1, visitDate: -1 });
medicalRecordSchema.index({ doctor: 1 });

export default mongoose.model("MedicalRecord", medicalRecordSchema);
