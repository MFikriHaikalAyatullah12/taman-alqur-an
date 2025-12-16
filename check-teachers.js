require('dotenv').config();
const { Pool } = require('pg');

async function checkTeachers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔍 Checking teachers table structure...\n');
    
    // Get table structure
    const structure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teachers'
      ORDER BY ordinal_position
    `);
    
    console.log('Teachers table columns:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n📋 Teachers data:\n');
    const result = await pool.query(`SELECT * FROM teachers ORDER BY id`);
    
    console.log(`Total teachers: ${result.rows.length}\n`);
    
    if (result.rows.length > 0) {
      result.rows.forEach(teacher => {
        console.log(`ID: ${teacher.id} | Name: ${teacher.name || '-'} | Admin: ${teacher.admin_id}`);
      });
    } else {
      console.log('⚠️  No teachers found!\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTeachers();
