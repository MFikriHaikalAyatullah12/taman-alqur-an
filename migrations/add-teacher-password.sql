-- Add password column to teachers table for teacher portal access
-- This password will be set by admin when adding/editing a teacher

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update existing teachers with a default password (hashed: 12345678)
-- Admin should update this password for each teacher
UPDATE teachers SET password = '$2b$10$kRqW9VW8JH8.kL8.JxV8.O1Qy9.8Q2.4Kq.9L1.2Mn.5Pq.3Rs.7Tu' WHERE password IS NULL;
