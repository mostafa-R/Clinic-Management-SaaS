# 🏥 Clinic Management SaaS - Backend API

Backend server for the Clinic Management SaaS platform built with Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)

## ✨ Features

### Core Features

- ✅ RESTful API architecture
- ✅ MongoDB database with Mongoose ODM
- ✅ JWT authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Real-time updates with Socket.IO
- ✅ Request validation (Joi)
- ✅ Error handling & logging (Morgan)
- ✅ Interactive API documentation (Redoc)

### Security 🔒

- ✅ Security middleware (Helmet, CORS)
- ✅ Rate limiting (express-rate-limit) 🆕
- ✅ Input sanitization (NoSQL & XSS protection) 🆕
- ✅ Password encryption (bcryptjs)

### File Management 📁

- ✅ **Intelligent File Upload System** 🆕
  - Local storage (default)
  - Cloudinary integration
  - AWS S3 integration
  - Auto image optimization (Sharp)
  - Multiple storage providers switchable via config

### Notifications 📬

- ✅ Email notifications (Nodemailer)
- ✅ **SMS notifications (Twilio)** 🆕
- ✅ In-app notifications

### Automation ⏰

- ✅ **Scheduled tasks (node-cron)** 🆕
  - Appointment reminders (24h & 1h)
  - Payment reminders
  - Notification cleanup

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB
- **ODM**: Mongoose 8.x
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Security**: Helmet, CORS, bcryptjs
- **API Documentation**: Redoc (OpenAPI 3.0)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── database.js  # MongoDB connection
│   ├── controller/      # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose models (10 models)
│   │   ├── User.js
│   │   ├── Clinic.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   ├── Prescription.js
│   │   ├── Invoice.js
│   │   ├── Payment.js
│   │   ├── Document.js
│   │   ├── Notification.js
│   │   └── index.js
│   ├── routes/          # API routes
│   │   └── index.js
│   ├── utils/           # Utility functions
│   └── server.js        # Server configuration
├── index.js             # Application entry point
├── package.json
├── .env.example
├── DATABASE_MODELS.md   # Detailed model documentation
├── MODEL_RELATIONSHIPS.md
└── MODELS_SUMMARY.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables**

Edit `.env` file with your configuration (see [Environment Variables](#environment-variables))

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/clinic-management-saas

# Client
CLIENT_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@clinic.com

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=your-number

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Payment Gateway (Stripe - optional)
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PUBLISHABLE_KEY=your-publishable-key
```

## 🏃 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`)

### Verify Server is Running

Visit: `http://localhost:5000`

You should see:

```json
{
  "success": true,
  "message": "🏥 Clinic Management API is running...",
  "version": "1.0.0",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

### Health Check

Visit: `http://localhost:5000/api/health`

```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

## 📚 API Documentation

### Interactive Documentation (Redoc)

Access the beautiful, interactive API documentation powered by Redoc:

```
http://localhost:5000/api-docs
```

Features:

- 🎨 Clean, modern interface with left sidebar navigation
- 📖 Complete endpoint documentation
- 🔍 Search functionality
- 📥 Download OpenAPI spec
- 🎯 Request/response examples
- 🔐 Authentication instructions

### OpenAPI Specification

Download the raw OpenAPI 3.0 specification:

```
http://localhost:5000/api-docs.json
```

### Base URL

```
http://localhost:5000/api
```

### Available Endpoints

- **Authentication**

  - `POST /api/auth/register` - Register new user
  - `POST /api/auth/login` - User login
  - `POST /api/auth/logout` - User logout
  - `POST /api/auth/refresh-token` - Refresh JWT token

- **Users**

  - `GET /api/users` - Get all users
  - `GET /api/users/:id` - Get user by ID
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

- **Clinics**

  - `GET /api/clinics` - Get all clinics
  - `POST /api/clinics` - Create clinic
  - `GET /api/clinics/:id` - Get clinic by ID
  - `PUT /api/clinics/:id` - Update clinic
  - `DELETE /api/clinics/:id` - Delete clinic

- **Patients**

  - `GET /api/patients` - Get all patients
  - `POST /api/patients` - Create patient
  - `GET /api/patients/:id` - Get patient by ID
  - `PUT /api/patients/:id` - Update patient

- **Appointments**

  - `GET /api/appointments` - Get all appointments
  - `POST /api/appointments` - Book appointment
  - `GET /api/appointments/:id` - Get appointment
  - `PUT /api/appointments/:id` - Update appointment
  - `DELETE /api/appointments/:id` - Cancel appointment

- **Medical Records**

  - `GET /api/medical-records` - Get all records
  - `POST /api/medical-records` - Create record
  - `GET /api/medical-records/:id` - Get record by ID

- **Prescriptions**

  - `GET /api/prescriptions` - Get all prescriptions
  - `POST /api/prescriptions` - Create prescription
  - `GET /api/prescriptions/:id` - Get prescription

- **Invoices**

  - `GET /api/invoices` - Get all invoices
  - `POST /api/invoices` - Create invoice
  - `GET /api/invoices/:id` - Get invoice

- **Payments**

  - `POST /api/payments` - Record payment
  - `GET /api/payments/:id` - Get payment

- **Documents**

  - `POST /api/documents` - Upload document
  - `GET /api/documents/:id` - Get document

- **Notifications**

  - `GET /api/notifications` - Get user notifications
  - `PUT /api/notifications/:id/read` - Mark as read

- **File Upload** 🆕
  - `POST /api/upload/profile` - Upload profile image
  - `POST /api/upload/document` - Upload medical document
  - `POST /api/upload/documents` - Upload multiple documents
  - `GET /api/upload/:id/url` - Get signed URL
  - `DELETE /api/upload/:id` - Delete file
  - `GET /api/upload/info` - Get storage info (admin)

### 📮 Postman Collection

A complete Postman collection with **82 endpoints** is available:

**File:** `Clinic_Management_Complete.postman_collection.json`

**Features:**

- ✅ All 82 API endpoints
- ✅ Pre-configured requests with examples
- ✅ Auto-saves access tokens and IDs
- ✅ File upload endpoints with form-data
- ✅ Environment variables ready
- ✅ Complete testing workflow

**Quick Import:**

```
File → Import → Select "Clinic_Management_Complete.postman_collection.json"
```

**Categories Included:**

- 🔐 Auth (11 endpoints)
- 👥 Users (4 endpoints)
- 🏥 Clinics (5 endpoints)
- 🤒 Patients (6 endpoints)
- 📅 Appointments (6 endpoints)
- 📋 Medical Records (4 endpoints)
- 💊 Prescriptions (3 endpoints)
- 💰 Invoices (4 endpoints)
- 💳 Payments (3 endpoints)
- 📄 Documents (3 endpoints)
- 🔔 Notifications (4 endpoints)
- 📤 File Upload (6 endpoints) 🆕
- 🏥 Health Check (1 endpoint)

**See:** `POSTMAN_GUIDE.md` for detailed usage instructions

## 🗄️ Database Models

This application includes 10 comprehensive database models:

1. **User** - Authentication and user management
2. **Clinic** - Clinic/facility management
3. **Patient** - Patient records and medical history
4. **Appointment** - Appointment scheduling
5. **MedicalRecord** - Visit documentation
6. **Prescription** - Digital prescriptions
7. **Invoice** - Billing and invoicing
8. **Payment** - Payment transactions
9. **Document** - File management
10. **Notification** - Multi-channel notifications

For detailed documentation, see:

- [DATABASE_MODELS.md](./DATABASE_MODELS.md) - Complete model schemas
- [MODEL_RELATIONSHIPS.md](./MODEL_RELATIONSHIPS.md) - Relationships and workflows
- [MODELS_SUMMARY.md](./MODELS_SUMMARY.md) - Quick reference

## 🔐 Security Features

- Password hashing with bcrypt
- JWT authentication
- HTTP security headers (Helmet)
- CORS protection
- Request rate limiting (to be implemented)
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Mostafa Ramadan - [Initial work](https://github.com/mostafa-R)

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All contributors

---

**Version**: 1.0.0  
**Last Updated**: October 2025
