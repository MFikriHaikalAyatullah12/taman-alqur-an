require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkTable() {
  try {
    console.log('📊 Checking teacher_attendance table structure...\n');
    
    // Get columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'teacher_attendance'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Get constraints
    console.log('\n📌 Constraints:');
    const constraints = await pool.query(`
      SELECT 
        con.conname AS constraint_name,
        con.contype AS constraint_type,
        CASE 
          WHEN con.contype = 'p' THEN 'PRIMARY KEY'
          WHEN con.contype = 'u' THEN 'UNIQUE'
          WHEN con.contype = 'f' THEN 'FOREIGN KEY'
          WHEN con.contype = 'c' THEN 'CHECK'
          ELSE con.contype::text
        END AS constraint_description
      FROM pg_constraint con
      INNER JOIN pg_class rel ON rel.oid = con.conrelid
      WHERE rel.relname = 'teacher_attendance'
    `);
    
    constraints.rows.forEach(cons => {
      console.log(`  - ${cons.constraint_name}: ${cons.constraint_description}`);
    });
    
    // Get indexes
    console.log('\n🔍 Indexes:');
    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'teacher_attendance'
    `);
    
    indexes.rows.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
      console.log(`    ${idx.indexdef}`);
    });
    
    // Sample data
    console.log('\n📝 Sample records:');
    const sample = await pool.query(`
      SELECT * FROM teacher_attendance 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    console.log(`Total records: ${sample.rows.length}`);
    sample.rows.forEach((row, i) => {
      console.log(`\n  Record ${i+1}:`);
      console.log(`    ID: ${row.id}`);
      console.log(`    Teacher ID: ${row.teacher_id}`);
      console.log(`    Date: ${row.attendance_date}`);
      console.log(`    Status: ${row.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTable();
