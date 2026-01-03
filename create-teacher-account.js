require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTeacherAccount() {
  try {
    console.log('🔐 Creating teacher login account...');
    
    const email = 'gurutpq@gmail.com';
    const password = '1234567890';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if account exists
    const checkQuery = 'SELECT * FROM admins WHERE email = $1';
    const existing = await pool.query(checkQuery, [email]);
    
    if (existing.rows.length > 0) {
      console.log('⚠️  Account already exists, updating password...');
      
      const updateQuery = `
        UPDATE admins 
        SET password = $1, role = 'teacher', name = 'Portal Guru TPQ', updated_at = NOW()
        WHERE email = $2
        RETURNING id, email, name, role
      `;
      const result = await pool.query(updateQuery, [hashedPassword, email]);
      console.log('✅ Teacher account updated:', result.rows[0]);
    } else {
      const insertQuery = `
        INSERT INTO admins (email, password, name, role, tpq_name, created_at, updated_at)
        VALUES ($1, $2, 'Portal Guru TPQ', 'teacher', 'TPQ Portal', NOW(), NOW())
        RETURNING id, email, name, role
      `;
      const result = await pool.query(insertQuery, [email, hashedPassword]);
      console.log('✅ Teacher account created:', result.rows[0]);
    }
    
    console.log('\n📋 Login credentials:');
    console.log('   Email: gurutpq@gmail.com');
    console.log('   Password: 1234567890');
    console.log('   Role: teacher');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTeacherAccount();
