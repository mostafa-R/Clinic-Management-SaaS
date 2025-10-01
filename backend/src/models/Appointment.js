import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    appointmentNumber: {
      type: String,
      unique: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      start: {
        type: String,
        required: true, 
      },
      end: {
        type: String,
        required: true, 
      },
    },
    duration: {
      type: Number,
      default: 30,
    },
    type: {
      type: String,
      enum: [
        "consultation",
        "follow-up",
        "emergency",
        "check-up",
        "telemedicine",
      ],
      default: "consultation",
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
        "rescheduled",
      ],
      default: "scheduled",
    },
    reason: {
      type: String,
      trim: true,
    },
    symptoms: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
    },
    cancelReason: {
      type: String,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledAt: {
      type: Date,
    },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookingSource: {
      type: String,
      enum: ["online", "phone", "walk-in", "staff"],
      default: "online",
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "sms", "whatsapp", "push"],
        },
        sentAt: Date,
        status: {
          type: String,
          enum: ["pending", "sent", "failed"],
        },
      },
    ],
    actualStartTime: {
      type: Date,
    },
    actualEndTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate appointment number
appointmentSchema.pre("save", async function (next) {
  if (!this.appointmentNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    this.appointmentNumber = `APT-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${(count + 1).toString().padStart(6, "0")}`;
  }
  next();
});

// Indexes
appointmentSchema.index({ clinic: 1, scheduledDate: 1 });
appointmentSchema.index({ doctor: 1, scheduledDate: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model("Appointment", appointmentSchema);
