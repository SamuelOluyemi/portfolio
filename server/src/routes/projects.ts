import { Router } from "express";
import { pool } from "../config/database.js";

const router = Router();

// GET /api/projects
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        technologies,
        category,
        github_url AS "githubUrl",
        live_demo_url AS "liveDemoUrl",
        image_url AS "imageUrl"
      FROM projects
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to retrieve projects:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
});

export default router;
