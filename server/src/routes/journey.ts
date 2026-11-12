import { Router } from "express";
import { pool } from "../config/database.js";

const router = Router();

// GET all journey milestones
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        organization,
        title,
        description,
        date_label AS "dateLabel",
        display_order AS "displayOrder"
      FROM journey_milestones
      ORDER BY display_order ASC, id ASC;
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to retrieve journey milestones:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve journey milestones",
    });
  }
});

export default router;
