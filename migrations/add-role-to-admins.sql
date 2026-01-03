-- Add role column to admins table for teacher/admin differentiation
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin';

-- Update existing admins to have 'admin' role
UPDATE admins SET role = 'admin' WHERE role IS NULL;
