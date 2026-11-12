import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/database.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";
import { contactSchema } from "../validators/contactValidator.js";

const router = Router();

const messageStatusSchema = z.object({
  status: z.enum(["unread", "read", "archived"]),
});

const messageFields = `
  id,
  name,
  email,
  subject,
  message,
  status,
  created_at AS "createdAt"
`;

// POST /api/contact - Public contact form submission
router.post("/", async (req, res) => {
  try {
    const validation = contactSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Please check your form details.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, subject, message } = validation.data;

    const result = await pool.query(
      `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, subject, status,
                  created_at AS "createdAt"
      `,
      [name, email, subject, message],
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);

    res.status(500).json({
      success: false,
      message: "Unable to send your message. Please try again later.",
    });
  }
});

// GET /api/contact - Admin only
router.get("/", authenticateAdmin, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT ${messageFields}
      FROM contact_messages
      ORDER BY created_at DESC, id DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to retrieve contact messages:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact messages.",
    });
  }
});

// PATCH /api/contact/:id/status - Admin only
router.patch("/:id/status", authenticateAdmin, async (req, res) => {
  const messageId = Number(req.params.id);

  if (!Number.isInteger(messageId) || messageId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid message ID.",
    });
    return;
  }

  const validation = messageStatusSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid message status.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `
        UPDATE contact_messages
        SET status = $1
        WHERE id = $2
        RETURNING ${messageFields}
      `,
      [validation.data.status, messageId],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Message not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Message status updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update message status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update message status.",
    });
  }
});

// DELETE /api/contact/:id - Admin only
router.delete("/:id", authenticateAdmin, async (req, res) => {
  const messageId = Number(req.params.id);

  if (!Number.isInteger(messageId) || messageId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid message ID.",
    });
    return;
  }

  try {
    const result = await pool.query(
      "DELETE FROM contact_messages WHERE id = $1",
      [messageId],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Message not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete contact message:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
});

export default router;
