// Run migration for teacher class management features
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration: Teacher Class Management Features...');
    
    // Add password column to teachers table
    await client.query('ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password VARCHAR(255)');
    console.log('✓ Added password column to teachers table');
    
    // Add column to track which teacher added a student
    try {
      await client.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS added_by_teacher_id INTEGER');
      console.log('✓ Added added_by_teacher_id column to students table');
    } catch (e) {
      console.log('  - added_by_teacher_id column already exists or skipped');
    }
    
    // Add columns to attendance table
    try {
      await client.query('ALTER TABLE attendance ADD COLUMN IF NOT EXISTS recorded_by_teacher_id INTEGER');
      console.log('✓ Added recorded_by_teacher_id column to attendance table');
    } catch (e) {
      console.log('  - recorded_by_teacher_id column already exists or skipped');
    }
    
    try {
      await client.query('ALTER TABLE attendance ADD COLUMN IF NOT EXISTS class_id INTEGER');
      console.log('✓ Added class_id column to attendance table');
    } catch (e) {
      console.log('  - class_id column already exists or skipped');
    }
    
    try {
      await client.query('ALTER TABLE attendance ADD COLUMN IF NOT EXISTS admin_id INTEGER');
      console.log('✓ Added admin_id column to attendance table');
    } catch (e) {
      console.log('  - admin_id column already exists or skipped');
    }
    
    // Create class_materials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS class_materials (
        id SERIAL PRIMARY KEY,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        teacher_id INTEGER,
        admin_id INTEGER,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        material_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created class_materials table');
    
    // Create indexes
    try {
      await client.query('CREATE INDEX IF NOT EXISTS idx_class_materials_class_id ON class_materials(class_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_class_materials_teacher_id ON class_materials(teacher_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_class_materials_date ON class_materials(material_date)');
      console.log('✓ Created indexes for class_materials');
    } catch (e) {
      console.log('  - Indexes already exist or skipped');
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
