const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tpq_website',
  password: 'postgres',
  port: 5432,
});

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database tables...');
    
    // Read SQL file
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Execute SQL
    await pool.query(sqlContent);
    
    console.log('✅ Database tables created successfully!');
    console.log('📊 Tables created:');
    console.log('   - admins');
    console.log('   - tpq_settings');
    console.log('   - students');
    console.log('   - teachers');
    console.log('   - classes');
    console.log('   - enrollments');
    console.log('   - schedules');
    console.log('   - announcements');
    console.log('   - galleries');
    console.log('   - testimonials');
    console.log('   - student_registrations');
    console.log('');
    console.log('🎉 Database setup completed! You can now register admin accounts.');
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    console.log('');
    console.log('💡 Make sure PostgreSQL is running and database "tpq_website" exists.');
    console.log('   Run this command first: createdb -U postgres tpq_website');
  } finally {
    await pool.end();
  }
}

setupDatabase();