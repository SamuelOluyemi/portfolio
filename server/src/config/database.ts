import pg from "pg";

const { Pool } = pg;

// Use the local PostgreSQL database in development
// Use Neon PostgreSQL in production
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

export const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Monitor unexpected database connection errors
pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

// Test database connection
export async function connectDatabase(): Promise<void> {
  try {
    const client = await pool.connect();

    console.log("Connected to PostgreSQL successfully");

    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    throw error;
  }
}
