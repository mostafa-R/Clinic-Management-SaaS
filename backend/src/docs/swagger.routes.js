/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Create a new user account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     description: Authenticate user and get access token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     description: Get authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logout current user and invalidate refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
 *     description: Retrieve list of all clinics with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by clinic name
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Clinics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Clinics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     clinics:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinics]
 *     description: Create a new clinic (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: City Medical Center
 *               email:
 *                 type: string
 *                 format: email
 *                 example: info@citymedical.com
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   zipCode:
 *                     type: string
 *                     example: "10001"
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     description: Retrieve list of all patients (Staff only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or patient ID
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *         description: Filter by clinic ID
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     description: Retrieve list of appointments with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, in-progress, completed, cancelled, no-show]
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     description: Schedule a new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - clinicId
 *               - doctorId
 *               - appointmentDate
 *               - startTime
 *               - endTime
 *             properties:
 *               patientId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               clinicId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               doctorId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-15"
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 example: "10:30"
 *               reason:
 *                 type: string
 *                 example: "Regular checkup"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     description: Retrieve list of invoices with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, partially-paid, paid, cancelled, overdue]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     description: Generate a new invoice for a patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - clinicId
 *               - invoiceDate
 *               - dueDate
 *               - items
 *             properties:
 *               patientId:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               invoiceDate:
 *                 type: string
 *                 format: date
 *               dueDate:
 *                 type: string
 *                 format: date
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "General Consultation"
 *                     category:
 *                       type: string
 *                       enum: [consultation, procedure, medication, lab-test, imaging, other]
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     unitPrice:
 *                       type: number
 *                       example: 100
 *                     discount:
 *                       type: number
 *                       example: 0
 *                     tax:
 *                       type: number
 *                       example: 10
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     description: Retrieve list of payments with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, pending, failed, refunded]
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [cash, card, bank-transfer, insurance, cheque, other]
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     description: Process a new payment for an invoice
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceId
 *               - patientId
 *               - clinicId
 *               - amount
 *               - paymentMethod
 *               - paymentDate
 *             properties:
 *               invoiceId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 example: 100
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, bank-transfer, insurance, cheque, other]
 *               paymentDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     description: Retrieve list of documents with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [lab-result, imaging, prescription, insurance, consent-form, report, other]
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Upload a new document
 *     tags: [Documents]
 *     description: Upload a new patient document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - clinicId
 *               - title
 *               - category
 *               - fileUrl
 *               - fileName
 *               - fileSize
 *               - mimeType
 *             properties:
 *               patientId:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: "Blood Test Results"
 *               category:
 *                 type: string
 *                 enum: [lab-result, imaging, prescription, insurance, consent-form, report, other]
 *               fileUrl:
 *                 type: string
 *                 example: "https://storage.example.com/file.pdf"
 *               fileName:
 *                 type: string
 *                 example: "test.pdf"
 *               fileSize:
 *                 type: number
 *                 example: 245678
 *               mimeType:
 *                 type: string
 *                 example: "application/pdf"
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/notifications/my-notifications:
 *   get:
 *     summary: Get my notifications
 *     tags: [Notifications]
 *     description: Retrieve notifications for authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [appointment, prescription, payment, document, system, reminder, alert]
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                     unreadCount:
 *                       type: integer
 *                       example: 5
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/notifications/mark-as-read:
 *   put:
 *     summary: Mark notifications as read
 *     tags: [Notifications]
 *     description: Mark selected notifications as read
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationIds
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve list of all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, doctor, nurse, receptionist, accountant, admin]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
