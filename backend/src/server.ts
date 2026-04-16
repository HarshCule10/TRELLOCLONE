import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import pool from './config/database';

const PORT = parseInt(process.env['PORT'] ?? '5000', 10);

async function startServer() {
  // Verify DB connection before accepting requests
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Connected to Neon PostgreSQL');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API docs: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await pool.end();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    await pool.end();
    process.exit(0);
  });
}

startServer();
