const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    console.log('🚀 Memulai migration...');
    
    const sql = fs.readFileSync('migrations/add-classes-table.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await pool.query(statement);
      }
    }
    
    console.log('✅ Migration berhasil!');
    console.log('   - Tabel classes telah dibuat');
    console.log('   - Kolom class_id ditambahkan ke tabel students');
    
  } catch (error) {
    console.error('❌ Migration gagal:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

runMigration();
