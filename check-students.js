require('dotenv').config();
const { Pool } = require('pg');

async function checkStudents() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔍 Checking students data...\n');
    
    // Count total students
    const countResult = await pool.query('SELECT COUNT(*) as total FROM students');
    console.log(`Total students in database: ${countResult.rows[0].total}`);
    
    // Get all students with class info
    const studentsResult = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.parent_name,
        s.class_id,
        c.name as class_name,
        s.admin_id
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      ORDER BY s.id
      LIMIT 20
    `);
    
    if (studentsResult.rows.length > 0) {
      console.log('\n📋 Students List:');
      console.log('=====================================');
      studentsResult.rows.forEach(student => {
        console.log(`ID: ${student.id} | Name: ${student.name} | Parent: ${student.parent_name} | Class: ${student.class_name || 'No Class'} (ID: ${student.class_id || '-'})`);
      });
      console.log('=====================================\n');
    } else {
      console.log('⚠️  No students found in database!');
    }
    
    // Check students without class
    const noClassResult = await pool.query(`
      SELECT COUNT(*) as total 
      FROM students 
      WHERE class_id IS NULL
    `);
    console.log(`Students without class: ${noClassResult.rows[0].total}`);
    
    // Check classes
    const classesResult = await pool.query('SELECT id, name FROM classes');
    console.log(`\nTotal classes: ${classesResult.rows.length}`);
    if (classesResult.rows.length > 0) {
      console.log('Classes:');
      classesResult.rows.forEach(cls => {
        console.log(`  - ${cls.name} (ID: ${cls.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

checkStudents();
