import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../src/config/database.js";

async function createAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  if (password.length < 12) {
    throw new Error("Password must contain at least 12 characters.");
  }

  const existingAdmin = await pool.query(
    "SELECT id FROM admin_users WHERE LOWER(email) = LOWER($1)",
    [email],
  );

  if (existingAdmin.rowCount && existingAdmin.rowCount > 0) {
    throw new Error("An administrator with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)`,
    [email, passwordHash],
  );

  console.log(`Administrator account created for ${email}.`);
}

createAdmin()
  .catch((error: unknown) => {
    console.error("Administrator creation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
