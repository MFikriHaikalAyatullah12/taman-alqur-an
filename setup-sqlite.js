// SQLite database configuration for development
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'tpq_website.db');
const db = new Database(dbPath);

console.log('🔄 Setting up SQLite database...');

// Create tables
db.exec(`
-- Admins table (Multi-tenant admin accounts)
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    tpq_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TPQ Settings table (Isolated per admin)
CREATE TABLE IF NOT EXISTS tpq_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    site_name TEXT NOT NULL DEFAULT 'TPQ Al-Hikmah',
    site_description TEXT,
    logo_url TEXT,
    
    -- Contact Information
    whatsapp TEXT,
    whatsapp_message TEXT DEFAULT 'Assalamu''alaikum, saya ingin bertanya tentang TPQ',
    phone TEXT,
    email TEXT,
    address TEXT,
    
    -- Social Media
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    
    -- Operating Hours
    weekdays_hours TEXT DEFAULT 'Senin - Jumat: 15:00 - 17:00',
    saturday_hours TEXT DEFAULT 'Sabtu: 08:00 - 10:00',
    sunday_hours TEXT DEFAULT 'Minggu: Libur',
    
    -- Content
    hero_title TEXT,
    hero_subtitle TEXT,
    about_title TEXT,
    about_description TEXT,
    
    -- Theme & Colors
    primary_color TEXT DEFAULT '#10b981',
    secondary_color TEXT DEFAULT '#3b82f6',
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Students table (Isolated per admin)
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    birth_date DATE,
    parent_name TEXT,
    parent_phone TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Teachers table (Isolated per admin)
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialization TEXT,
    experience_years INTEGER,
    education TEXT,
    bio TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Classes table (Isolated per admin)
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    level TEXT,
    capacity INTEGER,
    current_students INTEGER DEFAULT 0,
    teacher_id INTEGER,
    schedule TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);
`);

console.log('✅ SQLite database setup completed!');
console.log('📂 Database file: tpq_website.db');
console.log('🎉 Ready to register admin accounts!');

db.close();