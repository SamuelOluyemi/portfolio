import rateLimit from "express-rate-limit";

// General rate limiter for public API requests.
// Authenticated admins are exempt.
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => Boolean(req.session?.adminId),
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Rate limiter for public contact form submissions.
// Authenticated admins are exempt.
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => Boolean(req.session?.adminId),
  message: {
    success: false,
    message: "Too many contact submissions. Please try again later.",
  },
});

// Login rate limiter remains active for everyone.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  skipSuccessfulRequests: true,
});
