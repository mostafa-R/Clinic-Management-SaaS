// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  CLINIC_ADMIN: "clinic_admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
  ACCOUNTANT: "accountant",
  NURSE: "nurse",
  PATIENT: "patient",
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  CONSULTATION: "consultation",
  FOLLOW_UP: "follow_up",
  EMERGENCY: "emergency",
  CHECKUP: "checkup",
  PROCEDURE: "procedure",
};

// Invoice Status
export const INVOICE_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  INSURANCE: "insurance",
  ONLINE: "online",
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  BASIC: "basic",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
};

// Days of Week
export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Specialties
export const MEDICAL_SPECIALTIES = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Ophthalmology",
  "Orthopedics",
  "Otolaryngology (ENT)",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
];

// Blood Types
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Currencies
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "SAR", symbol: "SR", name: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Date & Time Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  INPUT: "yyyy-MM-dd",
  FULL: "MMMM dd, yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, yyyy HH:mm",
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".pdf"],
};

// Feature Flags
export const FEATURES = {
  TELEMEDICINE: process.env.NEXT_PUBLIC_ENABLE_TELEMEDICINE === "true",
  INSURANCE: process.env.NEXT_PUBLIC_ENABLE_INSURANCE === "true",
  PHARMACY: process.env.NEXT_PUBLIC_ENABLE_PHARMACY_INTEGRATION === "true",
};
