import { Router } from "express";
import { pool } from "../config/database.js";
import { contactSchema } from "../validators/contactValidator.js";

const router = Router();

// POST a new contact message
router.post("/", async (req, res) => {
  try {
    // Validate incoming request data
    const validation = contactSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Please check your form details.",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, email, subject, message } = validation.data;

    // Insert validated message into PostgreSQL
    const result = await pool.query(
      `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, subject, status, created_at AS "createdAt";
      `,
      [name, email, subject, message],
    );

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again later.",
    });
  }
});

export default router;
