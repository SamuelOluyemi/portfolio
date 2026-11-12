import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { connectDatabase } from "./config/database.js";
import { sessionMiddleware } from "./config/session.js";

import projectsRouter from "./routes/projects.js";
import journeyRouter from "./routes/journey.js";
import contactRouter from "./routes/contact.js";
import authRouter from "./routes/auth.js";

import {
  generalLimiter,
  contactLimiter,
  loginLimiter,
} from "./middleware/rateLimiter.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);

const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// Session must run before rate limiters so they can identify admins.
app.use(sessionMiddleware);

// General API rate limiting.
// Authenticated admins are skipped by the limiter.
app.use("/api", generalLimiter);

// Contact form rate limiting.
// Apply only to public POST submissions, not admin GET/PATCH/DELETE.
app.post("/api/contact", contactLimiter);

// Login rate limiting remains active.
app.use("/api/auth/login", loginLimiter);

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/projects", projectsRouter);
app.use("/api/journey", journeyRouter);
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);

// Global error handler
app.use(errorHandler);

// Start server after database connection
async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
