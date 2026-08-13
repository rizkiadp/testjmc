import mysql from 'mysql2/promise';

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable '${envVar}' is required but not set in .env file`);
  }
}

// Environment-driven connection pool (Strict .env configuration)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'REQUIRED' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

export async function query(sql, params = []) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (error) {
    console.error('Database Query Error:', error.message);
    throw error;
  }
}

export default pool;
