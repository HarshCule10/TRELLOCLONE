import fs from 'fs';
import path from 'path';
import pool from '../config/database';

async function seed() {
  const seedPath = path.join(__dirname, 'seed.sql');
  const seedData = fs.readFileSync(seedPath, 'utf-8');

  const client = await pool.connect();
  try {
    console.log('Seeding database...');
    await client.query(seedData);
    console.log('✅ Seed complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
