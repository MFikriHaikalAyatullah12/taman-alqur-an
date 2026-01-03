require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Starting migration: add-schedules-table.sql');
    
    const sqlPath = path.join(__dirname, 'migrations', 'add-schedules-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('📅 schedules table has been created');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
