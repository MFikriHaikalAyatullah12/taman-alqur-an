-- Migration: Add Classes table and update Students table
-- This enables classroom management with isolated data per admin

-- Create Classes table (Isolated per admin)
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    teacher_in_charge VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add class_id to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_admin_id ON classes(admin_id);

-- Add some sample classes (optional - remove if not needed)
-- INSERT INTO classes (admin_id, name, teacher_in_charge, description) 
-- VALUES 
--     (1, 'Kelas A', 'Ustadz Ahmad', 'Kelas untuk santri pemula'),
--     (1, 'Kelas B', 'Ustadzah Fatimah', 'Kelas untuk santri menengah');
