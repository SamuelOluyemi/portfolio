import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("API error:", err);

  const statusCode = typeof err.status === "number" ? err.status : 500;

  const message =
    statusCode === 413
      ? "Request payload is too large."
      : statusCode >= 500
        ? "Internal server error."
        : "Request failed.";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

