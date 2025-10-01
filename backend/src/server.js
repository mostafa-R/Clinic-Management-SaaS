import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import swaggerSpec from "./config/swagger.js";
import cronService from "./jobs/cron/cronService.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { sanitizeNoSQL, sanitizeXSS } from "./middlewares/sanitize.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.redoc.ly"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// OpenAPI JSON Spec
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Redoc API Documentation
app.get("/api-docs", (req, res) => {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Clinic Management API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='/api-docs.json'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
  `;
  res.send(html);
});

app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🏥 Clinic Management API is running...",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log("=================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📚 API Docs (Redoc): http://localhost:${PORT}/api-docs`);
      console.log("=================================");

      if (
        process.env.NODE_ENV === "production" ||
        process.env.ENABLE_CRON === "true"
      ) {
        cronService.startAll();
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("\n⚠️  Shutting down gracefully...");

  cronService.stopAll();

  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("❌ Forced shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default startServer;
