import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { connectDB } from "./config/database.js";
import { initializeAdmins } from "./config/admins.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logActivity } from "./middlewares/logger.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dataRoutes from "./routes/data.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://porta-v2.onrender.com",
  "https://porta-v2.vercel.app",
];

if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(...process.env.CORS_ORIGIN.split(","));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, mobile, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use(limiter);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ── Lazy DB connection middleware (required for Vercel serverless) ─────────────
// In serverless, app.listen() is never called so we must connect on first request.
// Mongoose connection is cached across warm invocations automatically.
let dbInitialized = false;
app.use(async (_req: Request, res: Response, next) => {
  if (!dbInitialized || mongoose.connection.readyState === 0) {
    try {
      await connectDB();
      if (!dbInitialized) {
        await initializeAdmins();
        dbInitialized = true;
      }
    } catch (err) {
      console.error("DB connection failed:", err);
      return res.status(503).json({ success: false, message: "Database unavailable" });
    }
  }
  next();
});

// ── Activity logging ──────────────────────────────────────────────────────────
app.use(logActivity);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  const dbState = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: dbState[mongoose.connection.readyState] || "unknown",
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/data", dataRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server (Required for Render) ──────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ PORTA Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

// ── Export for potential serverless use ──────────────────────────────────────
export default app;
