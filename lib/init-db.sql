-- Database initialization script for TPQ Website
-- Run this script to create all necessary tables

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TPQ Profile information
CREATE TABLE IF NOT EXISTS tpq_profile (
  id SERIAL PRIMARY KEY,
  history TEXT,
  vision TEXT,
  mission TEXT,
  organizational_structure JSONB,
  achievements JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers/Ustadz information
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  photo VARCHAR(255),
  specialization VARCHAR(255),
  experience INTEGER,
  certification TEXT,
  teaching_schedule JSONB,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students information
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  student_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  nick_name VARCHAR(100),
  birth_date DATE,
  birth_place VARCHAR(255),
  gender VARCHAR(10),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  parent_email VARCHAR(255),
  address TEXT,
  photo VARCHAR(255),
  registration_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'active',
  current_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curriculum and learning programs
CREATE TABLE IF NOT EXISTS curriculum (
  id SERIAL PRIMARY KEY,
  level VARCHAR(100) NOT NULL,
  description TEXT,
  materials JSONB,
  learning_objectives TEXT,
  duration_weeks INTEGER,
  prerequisites VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student progress tracking
CREATE TABLE IF NOT EXISTS student_progress (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  curriculum_id INTEGER REFERENCES curriculum(id),
  current_page INTEGER DEFAULT 1,
  total_pages INTEGER,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  last_assessment_score DECIMAL(3,1),
  assessment_notes TEXT,
  completed_at TIMESTAMP,
  teacher_id INTEGER REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules and events
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  teacher_id INTEGER REFERENCES teachers(id),
  class_level VARCHAR(100),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News and articles
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(255),
  category VARCHAR(100),
  author_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery for photos and videos
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  event_date DATE,
  uploaded_by INTEGER REFERENCES users(id),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  content TEXT NOT NULL,
  photo VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student registrations
CREATE TABLE IF NOT EXISTS student_registrations (
  id SERIAL PRIMARY KEY,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  birth_place VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  parent_email VARCHAR(255),
  address TEXT NOT NULL,
  previous_education VARCHAR(255),
  documents JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  interview_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment records
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  registration_id INTEGER REFERENCES student_registrations(id),
  payment_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP,
  due_date DATE,
  description TEXT,
  receipt_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings and configurations
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text',
  description TEXT,
  updated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (email, username, password, role, full_name) 
VALUES (
  'admin@tpq.com', 
  'admin', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'admin', 
  'Administrator TPQ'
) ON CONFLICT (email) DO NOTHING;

-- Insert default TPQ profile
INSERT INTO tpq_profile (history, vision, mission) 
VALUES (
  'TPQ Al-Hikmah didirikan pada tahun 2010 dengan tujuan untuk memberikan pendidikan Al-Quran yang berkualitas kepada generasi muda.',
  'Menjadi lembaga pendidikan Al-Quran terdepan yang menghasilkan generasi Qurani, berakhlak mulia, dan berprestasi.',
  'Menyelenggarakan pendidikan Al-Quran yang berkualitas, mengembangkan potensi santri secara optimal, dan membentuk karakter Islami yang kuat.'
) ON CONFLICT DO NOTHING;

-- Insert default curriculum levels
INSERT INTO curriculum (level, description, materials, duration_weeks) VALUES 
('Iqra 1', 'Pengenalan huruf hijaiyah dasar', '["Huruf Alif-Ya", "Harakat Fathah", "Latihan Membaca"]', 8),
('Iqra 2', 'Lanjutan huruf hijaiyah dengan harakat', '["Harakat Kasrah", "Harakat Dhammah", "Tanwin"]', 8),
('Iqra 3', 'Bacaan panjang dan sukun', '["Mad", "Sukun", "Tasydid"]', 10),
('Iqra 4', 'Bacaan lanjutan dan tajwid dasar', '["Qalqalah", "Ikhfa", "Idghom"]', 10),
('Iqra 5', 'Bacaan gharib dan tajwid lanjutan', '["Mad Wajib", "Mad Jaiz", "Bacaan Gharib"]', 12),
('Iqra 6', 'Persiapan Al-Quran', '["Waqaf Ibtida", "Tajwid Sempurna", "Bacaan Tartil"]', 12),
('Al-Quran', 'Membaca Al-Quran 30 Juz', '["Juz 1-30", "Tahsin", "Tahfidz"]', 104),
('Tahfidz Juz 30', 'Menghafal Juz Amma', '["Surat An-Naba sampai An-Nas", "Muroja ah", "Tahfidz Method"]', 24)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('tpq_name', 'TPQ Al-Hikmah', 'Nama TPQ'),
('tpq_address', 'Jl. Pendidikan No. 123, Jakarta', 'Alamat TPQ'),
('tpq_phone', '021-12345678', 'Nomor Telepon TPQ'),
('tpq_email', 'info@tpqalhikmah.com', 'Email TPQ'),
('tpq_whatsapp', '628123456789', 'Nomor WhatsApp TPQ'),
('registration_fee', '150000', 'Biaya Pendaftaran'),
('monthly_fee', '100000', 'SPP Bulanan'),
('academic_year', '2024/2025', 'Tahun Ajaran'),
('registration_open', 'true', 'Status Pendaftaran'),
('max_students_per_class', '15', 'Maksimal Santri per Kelas')
ON CONFLICT (setting_key) DO NOTHING;