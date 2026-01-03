-- Migration: Add schedules table
-- This table stores activity schedules for TPQ

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_type VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  teacher_in_charge VARCHAR(255),
  participants TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_schedules_admin_id ON schedules(admin_id);
CREATE INDEX IF NOT EXISTS idx_schedules_start_date ON schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_schedules_activity_type ON schedules(activity_type);

-- Add comment
COMMENT ON TABLE schedules IS 'Stores activity schedules for TPQ';
