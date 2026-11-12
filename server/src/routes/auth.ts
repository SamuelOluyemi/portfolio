import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";
import { loginSchema } from "../validators/authValidator.js";

const router = Router();

// Admin login
router.post("/login", async (req, res, next) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password format.",
      });
      return;
    }

    const { email, password } = validation.data;

    const result = await pool.query(
      `SELECT id, email, password_hash
       FROM admin_users
       WHERE LOWER(email) = LOWER($1)`,
      [email],
    );

    const admin = result.rows[0];

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    req.session.regenerate((error) => {
      if (error) {
        next(error);
        return;
      }

      req.session.adminId = admin.id;

      req.session.save(async (saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }

        try {
          await pool.query(
            `UPDATE admin_users
             SET last_login_at = NOW()
             WHERE id = $1`,
            [admin.id],
          );

          res.status(200).json({
            success: true,
            message: "Login successful.",
            admin: {
              id: admin.id,
              email: admin.email,
            },
          });
        } catch (updateError) {
          req.session.destroy(() => {});
          next(updateError);
        }
      });
    });
  } catch (error) {
    next(error);
  }
});

// Admin logout
router.post("/logout", authenticateAdmin, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("connect.sid");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  });
});

// Check authentication status
router.get("/me", authenticateAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    authenticated: true,
    adminId: req.session.adminId,
  });
});

export default router;
