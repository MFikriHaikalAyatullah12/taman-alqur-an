require('dotenv').config({ path: '.env.local' });
const pool = require('./lib/db');

async function setupPostgreSQLTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Setting up PostgreSQL tables...');
    
    // Drop existing tables untuk fresh start
    await client.query('DROP TABLE IF EXISTS tpq_settings CASCADE');
    await client.query('DROP TABLE IF EXISTS admins CASCADE');
    
    // Create admins table
    await client.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        tpq_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "admins" created');

    // Create tpq_settings table
    await client.query(`
      CREATE TABLE tpq_settings (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        site_name VARCHAR(255) NOT NULL DEFAULT 'TPQ Al-Hikmah',
        site_description TEXT,
        logo_url VARCHAR(500),
        
        -- Contact Information
        whatsapp VARCHAR(20),
        whatsapp_message TEXT DEFAULT 'Assalamu''alaikum, saya ingin bertanya tentang TPQ',
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        
        -- Social Media
        facebook_url VARCHAR(500),
        instagram_url VARCHAR(500),
        youtube_url VARCHAR(500),
        
        -- Operating Hours
        weekdays_hours VARCHAR(100) DEFAULT 'Senin - Jumat: 15:00 - 17:00',
        saturday_hours VARCHAR(100) DEFAULT 'Sabtu: 08:00 - 10:00',
        sunday_hours VARCHAR(100) DEFAULT 'Minggu: Libur',
        
        -- Content
        hero_title VARCHAR(255),
        hero_subtitle VARCHAR(255),
        about_title VARCHAR(255),
        about_description TEXT,
        
        -- Theme & Colors
        primary_color VARCHAR(7) DEFAULT '#10b981',
        secondary_color VARCHAR(7) DEFAULT '#3b82f6',
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "tpq_settings" created');

    // Create students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        birth_date DATE,
        parent_name VARCHAR(255),
        parent_phone VARCHAR(50),
        enrollment_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "students" created');

    // Create teachers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        specialization VARCHAR(255),
        experience_years INTEGER,
        education TEXT,
        bio TEXT,
        photo_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "teachers" created');

    // Create student_registrations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS student_registrations (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        birth_date DATE,
        parent_name VARCHAR(255),
        parent_phone VARCHAR(50),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table "student_registrations" created');

    console.log('');
    console.log('🎉 PostgreSQL database setup completed!');
    console.log('📊 All tables created successfully');
    console.log('🔗 Database: Neon PostgreSQL');
    console.log('');
    console.log('✅ Ready to register admin accounts!');
    console.log('   Visit: http://localhost:3000/admin/register');

  } catch (error) {
    console.error('❌ Database setup error:', error);
    console.log('');
    console.log('💡 Check your DATABASE_URL in .env.local');
    console.log('   Make sure Neon PostgreSQL is accessible');
  } finally {
    client.release();
    await pool.end();
  }
}

setupPostgreSQLTables();