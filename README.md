# 🏥 Clinic Management SaaS

A comprehensive cloud-based SaaS platform for managing medical clinics, centers, and small hospitals built on MERN Stack (MongoDB, Express.js, React, Node.js).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- 👨‍⚕️ **Patient Management**: Complete patient records with medical history, documents, and visit logs
- 📅 **Appointment Management**: Online booking, calendar view, automated reminders (SMS/Email/WhatsApp)
- 💳 **Billing & Payments**: Invoice generation, payment tracking, multiple payment methods (Stripe, Paymob)
- 🏥 **Multi-Clinic Support**: Manage multiple clinics from a single centralized account
- 🔔 **Notifications**: Automated reminders and alerts for appointments and payments
- 📊 **Reports & Analytics**: Comprehensive reports on patients, revenue, and diagnoses
- 👥 **RBAC System**: Role-based access control with flexible permissions

### User Portals
- **Super Admin Dashboard**: Platform-wide management, subscriptions, monitoring
- **Clinic Dashboard**: Patient, appointment, staff, and billing management
- **Patient Portal**: Book appointments, view records, pay bills online

### Future Features
- Insurance integration
- Pharmacy integration (e-prescriptions)
- Telemedicine (video consultations)
- AI Chatbot for patient inquiries
- Loyalty program

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit / Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Calendar**: FullCalendar / React Big Calendar
- **Charts**: Recharts / Chart.js

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Refresh Tokens
- **Authorization**: RBAC (Role-Based Access Control)
- **File Upload**: Multer + AWS S3
- **Notifications**: 
  - Email: SendGrid / NodeMailer
  - SMS/WhatsApp: Twilio / Vonage
- **Payments**: Stripe, Paymob, PayPal
- **Validation**: Joi / Express-Validator
- **Security**: Helmet, CORS, Rate Limiting

### DevOps & Deployment
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (optional)
- **Cloud**: AWS / DigitalOcean / Azure
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: PM2, Winston (logging)

## 📁 Project Structure

```
clinic-management-saas/
├── backend/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── validators/        # Input validation schemas
│   │   └── server.js          # App entry point
│   ├── uploads/               # File uploads (local)
│   ├── .env.example
│   └── package.json
├── frontend/                   # Frontend (Next.js + React)
│   ├── public/                # Static files
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Libraries & utilities
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── styles/            # Global styles
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml          # Docker compose configuration
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB 7+
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clinic-management-saas.git
   cd clinic-management-saas
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration

   # Frontend
   cp frontend/.env.example frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or use Docker Compose
   docker-compose up -d mongodb
   ```

5. **Run the application**
   ```bash
   # Development mode (both frontend & backend)
   npm run dev

   # Or run separately
   npm run server:dev
   npm run client:dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Docs: http://localhost:5000/api-docs

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/clinic-management
MONGODB_TEST_URI=mongodb://localhost:27017/clinic-management-test

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=7d

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@yourclinic.com

# SMS/WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Payment Gateways
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
PAYMOB_API_KEY=your-paymob-key

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=clinic-management-files

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
NEXT_PUBLIC_APP_NAME=Clinic Management System
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📚 API Documentation

API documentation is available at `/api-docs` when running in development mode.

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Main Endpoints

- **Auth**: `/api/v1/auth` - Authentication & Authorization
- **Users**: `/api/v1/users` - User management
- **Patients**: `/api/v1/patients` - Patient management
- **Appointments**: `/api/v1/appointments` - Appointment management
- **Clinics**: `/api/v1/clinics` - Clinic management
- **Invoices**: `/api/v1/invoices` - Billing & invoices
- **Payments**: `/api/v1/payments` - Payment processing
- **Reports**: `/api/v1/reports` - Analytics & reports
- **Notifications**: `/api/v1/notifications` - Notification management

## 🚢 Deployment

### Backend Deployment

```bash
# Build for production
cd backend
npm run build

# Start production server
npm start
```

### Frontend Deployment

```bash
# Build for production
cd frontend
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@yourclinic.com or join our Slack channel.

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with ❤️ using MERN Stack

