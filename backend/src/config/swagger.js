import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic Management SaaS API",
      version: "4.0.0",
      description: `
# 🏥 Complete Clinic Management System API

Enterprise-grade RESTful API for managing clinics, patients, appointments, medical records, and more.

## 🌟 Features

- **Authentication & Authorization** - JWT-based with role-based access control
- **Multi-tenant Architecture** - Clinic-based data isolation
- **Complete Clinical Operations** - Patients, appointments, medical records, prescriptions
- **Financial Management** - Invoicing, payments, refunds
- **Document Management** - File upload and organization
- **Notification System** - Real-time alerts and notifications
- **User Administration** - Complete user management

## 🔒 Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

## 📊 API Statistics

- **Total Endpoints**: 97
- **Controllers**: 11
- **Models**: 10
- **Validation Schemas**: 35

## 🚀 Getting Started

1. Register a new user: \`POST /api/auth/register\`
2. Verify your email: \`GET /api/auth/verify-email/:token\`
3. Login: \`POST /api/auth/login\`
4. Use the returned token for authenticated requests

## 📞 Support

For support, email support@clinicmanagement.com
      `,
      contact: {
        name: "API Support",
        email: "support@clinicmanagement.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.clinicmanagement.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Users",
        description: "User management and administration",
      },
      {
        name: "Clinics",
        description: "Clinic management and staff operations",
      },
      {
        name: "Patients",
        description: "Patient records and medical history",
      },
      {
        name: "Appointments",
        description: "Appointment scheduling and management",
      },
      {
        name: "Medical Records",
        description: "Patient visit records and medical history",
      },
      {
        name: "Prescriptions",
        description: "Medication prescriptions and refills",
      },
      {
        name: "Invoices",
        description: "Billing and invoice management",
      },
      {
        name: "Payments",
        description: "Payment processing and refunds",
      },
      {
        name: "Documents",
        description: "File upload and document management",
      },
      {
        name: "Notifications",
        description: "Notification system and alerts",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "object",
              example: { field: "Error details" },
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 100,
            },
            pages: {
              type: "integer",
              example: 10,
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            firstName: {
              type: "string",
              example: "John",
            },
            lastName: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            role: {
              type: "string",
              enum: [
                "patient",
                "doctor",
                "nurse",
                "receptionist",
                "accountant",
                "admin",
              ],
              example: "patient",
            },
            isEmailVerified: {
              type: "boolean",
              example: true,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Not authorized, token required",
              },
            },
          },
        },
        ForbiddenError: {
          description: "User does not have permission",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Not authorized to access this resource",
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Validation failed",
                errors: {
                  email: "Please provide a valid email",
                  password: "Password must be at least 8 characters",
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controller/*.js", "./src/docs/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
