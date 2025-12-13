require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createStudentsTable() {
  try {
    console.log('🔄 Creating students table...');
    console.log('📡 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Create students table SQL dengan field yang disederhanakan
    const createStudentsSQL = `
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        full_name VARCHAR(255) NOT NULL,
        birth_place VARCHAR(255),
        birth_date DATE,
        father_name VARCHAR(255),
        father_phone VARCHAR(20),
        gender VARCHAR(10) DEFAULT 'Laki-laki',
        current_level VARCHAR(100) DEFAULT 'Al-Quran',
        status VARCHAR(20) DEFAULT 'active',
        registration_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Kolom tambahan untuk kompatibilitas dengan kode yang ada
        nickname VARCHAR(255),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        father_occupation VARCHAR(255),
        mother_name VARCHAR(255),
        mother_occupation VARCHAR(255),
        mother_phone VARCHAR(20),
        guardian_name VARCHAR(255),
        guardian_phone VARCHAR(20),
        previous_education VARCHAR(255),
        quran_ability VARCHAR(255)
      );
      
      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_students_admin_id ON students(admin_id);
      CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
    `;
    
    console.log('📝 Creating students table...');
    await pool.query(createStudentsSQL);
    
    console.log('✅ Students table created successfully! 👨‍🎓');
    
    // Verify table exists
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'students'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Table verification: students table exists');
      
      // Show table structure
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'students' 
        ORDER BY ordinal_position
      `);
      
      console.log('📊 Table structure:');
      columns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})${col.is_nullable === 'YES' ? ' NULL' : ' NOT NULL'}`);
      });
    } else {
      console.log('❌ Table verification: students table not found');
    }
    
    console.log('');
    console.log('🎉 Students table setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

createStudentsTable();