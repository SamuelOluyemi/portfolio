import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/database.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const router = Router();

const journeySchema = z.object({
  organization: z.string().trim().min(1).max(150),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  dateLabel: z.string().trim().max(100).optional(),
  displayOrder: z.number().int().min(0),
});

const journeyFields = `
  id,
  organization,
  title,
  description,
  date_label AS "dateLabel",
  display_order AS "displayOrder"
`;

// GET /api/journey - Public
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT ${journeyFields}
      FROM journey_milestones
      ORDER BY display_order ASC, id ASC
    `);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Failed to retrieve journey milestones:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve journey milestones.",
    });
  }
});

// POST /api/journey - Admin only
router.post("/", authenticateAdmin, async (req, res) => {
  const validation = journeySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid journey milestone information.",
    });
    return;
  }

  const { organization, title, description, dateLabel, displayOrder } =
    validation.data;

  try {
    const result = await pool.query(
      `INSERT INTO journey_milestones (
        organization, title, description, date_label, display_order
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${journeyFields}`,
      [organization, title, description, dateLabel || null, displayOrder],
    );

    res.status(201).json({
      success: true,
      message: "Journey milestone created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create journey milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create journey milestone.",
    });
  }
});

// PUT /api/journey/:id - Admin only
router.put("/:id", authenticateAdmin, async (req, res) => {
  const milestoneId = Number(req.params.id);

  if (!Number.isInteger(milestoneId) || milestoneId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid journey milestone ID.",
    });
    return;
  }

  const validation = journeySchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid journey milestone information.",
    });
    return;
  }

  const { organization, title, description, dateLabel, displayOrder } =
    validation.data;

  try {
    const result = await pool.query(
      `UPDATE journey_milestones
       SET organization = $1,
           title = $2,
           description = $3,
           date_label = $4,
           display_order = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING ${journeyFields}`,
      [
        organization,
        title,
        description,
        dateLabel || null,
        displayOrder,
        milestoneId,
      ],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Journey milestone not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Journey milestone updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update journey milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update journey milestone.",
    });
  }
});

// DELETE /api/journey/:id - Admin only
router.delete("/:id", authenticateAdmin, async (req, res) => {
  const milestoneId = Number(req.params.id);

  if (!Number.isInteger(milestoneId) || milestoneId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid journey milestone ID.",
    });
    return;
  }

  try {
    const result = await pool.query(
      "DELETE FROM journey_milestones WHERE id = $1",
      [milestoneId],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Journey milestone not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Journey milestone deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete journey milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete journey milestone.",
    });
  }
});

export default router;
