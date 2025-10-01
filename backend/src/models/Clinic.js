import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: String,
      website: String,
    },
    workingHours: [
      {
        day: {
          type: String,
          enum: [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        },
        isOpen: {
          type: Boolean,
          default: true,
        },
        shifts: [
          {
            start: String, // "09:00"
            end: String, // "17:00"
          },
        ],
      },
    ],
    specialties: [
      {
        type: String,
        trim: true,
      },
    ],
    settings: {
      appointmentDuration: {
        type: Number,
        default: 30, // minutes
      },
      allowOnlineBooking: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      sendReminders: {
        type: Boolean,
        default: true,
      },
      reminderTiming: [
        {
          type: Number,
          default: [24, 1], // hours before appointment
        },
      ],
      currency: {
        type: String,
        default: "USD",
      },
      timezone: {
        type: String,
        default: "UTC",
      },
    },
    staff: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["doctor", "receptionist", "accountant", "nurse"],
        },
        permissions: [
          {
            type: String,
          },
        ],
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "cancelled", "expired", "suspended"],
        default: "active",
      },
      startDate: Date,
      endDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
clinicSchema.index({ name: "text", "address.city": "text" });

export default mongoose.model("Clinic", clinicSchema);
