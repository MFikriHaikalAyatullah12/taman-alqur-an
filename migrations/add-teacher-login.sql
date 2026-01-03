-- Migration: Add teacher login account
-- Create a special account for all teachers to view their performance

-- Insert teacher account
INSERT INTO admins (email, password, name, role, created_at)
VALUES (
  'gurutpq@gmail.com',
  '$2b$10$8OvZ5xN.kR7KdH4nZj.cR.YQO8QP8qF8L0rJ2vG3lYZNqH5KkJ1Vu', -- password: 1234567890
  'Portal Guru TPQ',
  'teacher',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE admins IS 'Stores admin and teacher accounts';
