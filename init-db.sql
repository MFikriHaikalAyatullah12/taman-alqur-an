-- Database schema for Multi-Tenant TPQ Website
-- Each admin has isolated data for privacy

-- Admins table (Multi-tenant admin accounts)
CREATE TABLE IF NOT EXISTS admins (
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
);

-- TPQ Settings table (Isolated per admin)
CREATE TABLE IF NOT EXISTS tpq_settings (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    site_name VARCHAR(255) NOT NULL DEFAULT 'TAMAN PENDIDIKAN ALQUR\'AN',
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
);

-- Features table (Isolated per admin)
CREATE TABLE IF NOT EXISTS tpq_features (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table (Isolated per admin)
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    birth_date DATE,
    birth_place VARCHAR(255),
    gender VARCHAR(10) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Parent Information
    father_name VARCHAR(255),
    father_occupation VARCHAR(255),
    father_phone VARCHAR(20),
    mother_name VARCHAR(255),
    mother_occupation VARCHAR(255),
    mother_phone VARCHAR(20),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    
    -- Academic Information
    current_level VARCHAR(100),
    previous_education VARCHAR(255),
    quran_ability VARCHAR(100),
    
    -- Registration Info
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table (Isolated per admin)  
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    education VARCHAR(255),
    experience VARCHAR(100),
    specialization VARCHAR(255),
    description TEXT,
    photo_url VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curriculum table (Isolated per admin)
CREATE TABLE IF NOT EXISTS curriculum (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    level VARCHAR(100) NOT NULL,
    description TEXT,
    topics JSON,
    duration VARCHAR(100),
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News & Articles table (Isolated per admin)
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    author VARCHAR(255),
    category VARCHAR(100),
    featured_image VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery table (Isolated per admin)
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table (Isolated per admin)
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    parent_name VARCHAR(255) NOT NULL,
    student_name VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    photo_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student Progress table (Isolated per admin)
CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    level VARCHAR(100),
    progress_percentage INTEGER DEFAULT 0,
    notes TEXT,
    assessed_by VARCHAR(255),
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules table (Isolated per admin)
CREATE TABLE IF NOT EXISTS schedules (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    start_time TIME,
    end_time TIME,
    days_of_week JSON, -- ['monday', 'tuesday', etc]
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    teacher_id INTEGER REFERENCES teachers(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_admin_id ON students(admin_id);
CREATE INDEX IF NOT EXISTS idx_teachers_admin_id ON teachers(admin_id);
CREATE INDEX IF NOT EXISTS idx_news_admin_id ON news(admin_id);
CREATE INDEX IF NOT EXISTS idx_gallery_admin_id ON gallery(admin_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_admin_id ON testimonials(admin_id);
CREATE INDEX IF NOT EXISTS idx_schedules_admin_id ON schedules(admin_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_admin_id ON curriculum(admin_id);
CREATE INDEX IF NOT EXISTS idx_tpq_settings_admin_id ON tpq_settings(admin_id);

-- Insert sample admin (remove in production)
INSERT INTO admins (name, email, password, tpq_name, phone, address) 
VALUES 
('Admin Demo', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeR8jKKjw1DqYA6WK', 'TPQ Al-Hikmah Demo', '081234567890', 'Jl. Demo No. 123, Jakarta')
ON CONFLICT (email) DO NOTHING;