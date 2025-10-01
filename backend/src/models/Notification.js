import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "appointment-reminder",
        "appointment-confirmed",
        "appointment-cancelled",
        "appointment-rescheduled",
        "new-appointment",
        "payment-received",
        "payment-overdue",
        "invoice-generated",
        "prescription-ready",
        "lab-result-ready",
        "general",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed, // Additional data related to notification
    },
    channels: [
      {
        type: {
          type: String,
          enum: ["email", "sms", "whatsapp", "push", "in-app"],
        },
        status: {
          type: String,
          enum: ["pending", "sent", "failed", "delivered", "read"],
          default: "pending",
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String,
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    scheduledFor: {
      type: Date,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    relatedTo: {
      model: {
        type: String,
        enum: [
          "Appointment",
          "Invoice",
          "Payment",
          "Prescription",
          "MedicalRecord",
        ],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Mark as read method
notificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ clinic: 1 });
notificationSchema.index({ scheduledFor: 1 });

export default mongoose.model("Notification", notificationSchema);
