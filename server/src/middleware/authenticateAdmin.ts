import type { Request, Response, NextFunction } from "express";

export function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session.adminId) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  next();
}
