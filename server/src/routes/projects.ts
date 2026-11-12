import { Router } from "express";
import { z } from "zod";
import { pool } from "../config/database.js";
import { authenticateAdmin } from "../middleware/authenticateAdmin.js";

const router = Router();

const projectSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1),
  technologies: z.array(z.string().trim().min(1)),
  category: z.string().trim().min(1).max(100),
  githubUrl: z.string().trim().url().or(z.literal("")).optional(),
  liveDemoUrl: z.string().trim().url().or(z.literal("")).optional(),
  imageUrl: z.string().trim().url().or(z.literal("")).optional(),
});

const projectFields = `
  id,
  title,
  description,
  technologies,
  category,
  github_url AS "githubUrl",
  live_demo_url AS "liveDemoUrl",
  image_url AS "imageUrl"
`;

// GET /api/projects - Public
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT ${projectFields}
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
      message: "Failed to retrieve projects.",
    });
  }
});

// POST /api/projects - Admin only
router.post("/", authenticateAdmin, async (req, res) => {
  const validation = projectSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid project information.",
    });
    return;
  }

  const {
    title,
    description,
    technologies,
    category,
    githubUrl,
    liveDemoUrl,
    imageUrl,
  } = validation.data;

  try {
    const result = await pool.query(
      `INSERT INTO projects (
        title, description, technologies, category,
        github_url, live_demo_url, image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING ${projectFields}`,
      [
        title,
        description,
        technologies,
        category,
        githubUrl || null,
        liveDemoUrl || null,
        imageUrl || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
});

// PUT /api/projects/:id - Admin only
router.put("/:id", authenticateAdmin, async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID.",
    });
    return;
  }

  const validation = projectSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid project information.",
    });
    return;
  }

  const {
    title,
    description,
    technologies,
    category,
    githubUrl,
    liveDemoUrl,
    imageUrl,
  } = validation.data;

  try {
    const result = await pool.query(
      `UPDATE projects
       SET title = $1,
           description = $2,
           technologies = $3,
           category = $4,
           github_url = $5,
           live_demo_url = $6,
           image_url = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING ${projectFields}`,
      [
        title,
        description,
        technologies,
        category,
        githubUrl || null,
        liveDemoUrl || null,
        imageUrl || null,
        projectId,
      ],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Project not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
});

// DELETE /api/projects/:id - Admin only
router.delete("/:id", authenticateAdmin, async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID.",
    });
    return;
  }

  try {
    const result = await pool.query("DELETE FROM projects WHERE id = $1", [
      projectId,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Project not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete project:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
});

export default router;
