import "dotenv/config"; // Load environment variables from .env file
import express from "express";

// CORS middleware
import cors from "cors";
import { connectDatabase } from "./config/database.js";

// Import the projects router
import projectsRouter from "./routes/projects.js";
import journeyRouter from "./routes/journey.js";
import contactRouter from "./routes/contact.js";

import authRouter from "./routes/auth.js"; // Import the auth router

// Import helmet for security headers
import helmet from "helmet";
// Limiter
import {
  generalLimiter,
  contactLimiter,
  loginLimiter,
} from "./middleware/rateLimiter.js";

// Import the error handler middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Import the session middleware
import { sessionMiddleware } from "./config/session.js";

const app = express();
app.set("trust proxy", 1); // Trust the first proxy in front of the server (if any) for rate limiting and security headers

// cors configuration
// app.use(
//     cors({
//         origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow requests from the client URL or localhost
//     })
// )
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
    credentials: true, // Allow cookies to be sent with requests
  }),
);

const PORT = process.env.PORT || 3001;

// security headers using helmet (configures security-related HTTP headers for incoming requests)
app.use(helmet());
app.use(sessionMiddleware); // Use the session middleware for managing user sessions

app.use("/api", generalLimiter); // Apply general rate limiting to all API routes
app.use("/api/contact", contactLimiter); // Apply contact-specific rate limiting
app.use("/api/auth/login", loginLimiter); // Apply login-specific rate limiting

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "10kb" })); // Limit request body size to 10kb

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Projects and Endpoint: moved to separate router file for better organization and maintainability

// replaced the following line with the projects router
// app.get("/api/projects", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     data: projects,
//   });
// });

// Projects API
app.use("/api/projects", projectsRouter);

// Journey API
app.use("/api/journey", journeyRouter);

// Contact API
app.use("/api/contact", contactRouter);

// Auth API
app.use("/api/auth", authRouter); // Use the auth router for authentication-related routes

app.use(errorHandler); // Use the error handler middleware

// Start the server: Replace the following line with the database connection logic
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Start the server only after connecting to PostgreSQL
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
