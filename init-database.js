require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    console.log('📡 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Read SQL file
    const sqlFile = path.join(__dirname, 'init-db.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📝 Executing database schema...');
    
    // Execute SQL
    await pool.query(sqlContent);
    
    console.log('✅ Database schema created successfully!');
    console.log('📊 Tables created/updated:');
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
    console.log('   - finances 💰');
    console.log('');
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('');
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('💡 This appears to be a table creation issue. Trying to continue...');
    } else {
      console.log('💡 Make sure DATABASE_URL is correct in .env file.');
      console.log('   Current DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    }
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };