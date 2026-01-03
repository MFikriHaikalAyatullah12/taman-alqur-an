-- Migration: Add teacher materials table
-- This table tracks materials taught by teachers daily

-- Create teacher_materials table
CREATE TABLE IF NOT EXISTS teacher_materials (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  material_date DATE NOT NULL DEFAULT CURRENT_DATE,
  material_topic VARCHAR(255) NOT NULL,
  material_description TEXT,
  class_name VARCHAR(100),
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_teacher_materials_teacher_id ON teacher_materials(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_materials_admin_id ON teacher_materials(admin_id);
CREATE INDEX IF NOT EXISTS idx_teacher_materials_date ON teacher_materials(material_date);
CREATE INDEX IF NOT EXISTS idx_teacher_materials_teacher_date ON teacher_materials(teacher_id, material_date);

-- Add comment to table
COMMENT ON TABLE teacher_materials IS 'Stores materials/topics taught by teachers each day';

-- You can run this migration by executing:
-- psql -d your_database_name -f migrations/add-teacher-materials-table.sql
