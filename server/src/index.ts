import "dotenv/config"; // Load environment variables from .env file
import express from "express";

// CORS middleware
import cors from "cors";
import { connectDatabase } from "./config/database.js";

// Import the projects router
import projectsRouter from "./routes/projects.js";
import journeyRouter from "./routes/journey.js";
import contactRouter from "./routes/contact.js";

// Import helmet for security headers
import helmet from "helmet";
// Limiter
import { generalLimiter, contactLimiter } from "./middleware/rateLimiter.js";

// Import the error handler middleware
import { errorHandler } from "./middleware/errorHandler.js";

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
  }),
);

const PORT = process.env.PORT || 3001;

// security headers using helmet (configures security-related HTTP headers for incoming requests)
app.use(helmet());

app.use("/api", generalLimiter); // Apply general rate limiting to all API routes
app.use("/api/contact", contactLimiter); // Apply contact-specific rate limiting

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

// Projects and Endpoint
// const projects = [
//   {
//     id: 1,
//     title: "Marketing & Advertising Platform",
//     description:
//       "A full-stack web application built to support over 5,000 users, featuring a React frontend and a Node.js backend.",
//     technologies: [
//       "React",
//       "Node.js",
//       "JavaScript",
//       "Express",
//       "MongoDB",
//       "TailwindCSS",
//     ],
//     category: "Full Stack Development",
//     githubUrl: "https://github.com/Pill4rs",
//     liveDemoUrl: "",
//     imageUrl: "",
//   },
//   {
//     id: 2,
//     title: "Tech Blog Application",
//     description:
//       "An interactive technology blog featuring user registration, authentication, article publishing, comments, and admin functionality.",
//     technologies: ["Web Development", "Authentication", "CRUD"],
//     category: "Full-Stack Development",
//     githubUrl: "https://github.com/SamuelOluyemi/Tech-Blog-World.git",
//     liveDemoUrl: "",
//     imageUrl: "/images/tech-blog-home.png",
//   },
// ];

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
