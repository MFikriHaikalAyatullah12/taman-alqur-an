require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testStudentsAPI() {
  try {
    console.log('🧪 Testing students API...');
    
    // Test database connection and query
    const result = await pool.query('SELECT COUNT(*) as count FROM students');
    console.log(`✅ Students table accessible. Current records: ${result.rows[0].count}`);
    
    // Check if admin exists
    const adminResult = await pool.query('SELECT id, name FROM admins LIMIT 1');
    if (adminResult.rows.length > 0) {
      console.log(`✅ Admin found: ${adminResult.rows[0].name}`);
      
      // Add sample data if table is empty
      if (parseInt(result.rows[0].count) === 0) {
        console.log('📝 Adding sample student data...');
        const adminId = adminResult.rows[0].id;
        
        await pool.query(`
          INSERT INTO students (admin_id, name, address, birth_date, parent_name, parent_phone, status) 
          VALUES 
            ($1, 'Ahmad Fauzi', 'Jakarta, 12 Januari 2015', '2015-01-12', 'Bapak Ahmad', '081234567890', 'active'),
            ($1, 'Siti Aisyah', 'Bekasi, 05 Maret 2016', '2016-03-05', 'Bapak Usman', '081987654321', 'active'),
            ($1, 'Muhammad Rizki', 'Tangerang, 20 September 2014', '2014-09-20', 'Bapak Rizki Sr.', '081555666777', 'active')
        `, [adminId]);
        
        console.log('✅ Sample student data added successfully!');
      }
    } else {
      console.log('❌ No admin found. Please ensure admin is registered.');
    }
    
    // Test the structure
    const students = await pool.query('SELECT * FROM students LIMIT 1');
    if (students.rows.length > 0) {
      console.log('📊 Student table structure verified:');
      console.log('   Sample record:', students.rows[0]);
    }
    
    console.log('');
    console.log('🎉 Database is ready for students module!');
    console.log('👨‍🎓 You can now use the students feature in the admin panel.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('relation "students" does not exist')) {
      console.log('💡 Run: node create-students-table.js first');
    }
  } finally {
    await pool.end();
  }
}

testStudentsAPI();