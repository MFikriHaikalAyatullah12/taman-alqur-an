require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    console.log('📊 Checking current admins table structure...');
    
    const checkColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admins'
      ORDER BY ordinal_position
    `);
    
    console.log('Current columns:', checkColumns.rows);
    
    console.log('\n🔄 Adding role column...');
    
    const sql = fs.readFileSync('./migrations/add-role-to-admins.sql', 'utf8');
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully');
    
    console.log('\n📊 Updated table structure:');
    const updatedColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admins'
      ORDER BY ordinal_position
    `);
    console.log(updatedColumns.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

runMigration();
