import mysql from 'mysql2/promise';

let pool = null;

function getPool() {
  if (!pool) {
    if (!process.env.DB_HOST) {
      throw new Error('DB_HOST environment variable is not set');
    }
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
      ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
    });
  }
  return pool;
}

export default getPool;
