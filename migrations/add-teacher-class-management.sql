-- Migration: Add teacher class management features
-- This migration adds columns and tables to support teacher-managed classes

-- Add password column to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add column to track which teacher added a student
ALTER TABLE students ADD COLUMN IF NOT EXISTS added_by_teacher_id INTEGER REFERENCES teachers(id);

-- Add column to track which teacher recorded attendance
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS recorded_by_teacher_id INTEGER REFERENCES teachers(id);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS class_id INTEGER REFERENCES classes(id);
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS admin_id INTEGER REFERENCES admins(id);

-- Create unique constraint on attendance (student_id, attendance_date) if not exists
-- First check and drop if exists, then recreate
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'attendance_student_date_unique'
    ) THEN
        ALTER TABLE attendance ADD CONSTRAINT attendance_student_date_unique 
        UNIQUE (student_id, attendance_date);
    END IF;
END $$;

-- Create table for class materials (materi yang diajarkan guru)
CREATE TABLE IF NOT EXISTS class_materials (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id),
    admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    material_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_class_materials_class_id ON class_materials(class_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_teacher_id ON class_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_date ON class_materials(material_date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_recorded_by ON attendance(recorded_by_teacher_id);
