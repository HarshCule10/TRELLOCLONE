import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env['DATABASE_URL']) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

pool.on('connect', () => {
  if (process.env['NODE_ENV'] !== 'production') {
    console.log('New database client connected');
  }
});

export default pool;
