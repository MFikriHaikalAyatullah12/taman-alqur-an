const { Pool } = require('pg');

async function checkTeachersSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check if teachers table exists and get its columns
    const result = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'teachers'
      ORDER BY ordinal_position;
    `);

    console.log('\n✓ Teachers table structure:');
    console.log('=====================================');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`);
    });
    console.log('=====================================\n');

    // Check if position column exists
    const hasPosition = result.rows.some(row => row.column_name === 'position');
    
    if (!hasPosition) {
      console.log('⚠️  WARNING: "position" column does NOT exist in teachers table!');
      console.log('Would you like to add it? (This script will show the ALTER command)\n');
      console.log('ALTER TABLE teachers ADD COLUMN position VARCHAR(255);');
    } else {
      console.log('✓ "position" column EXISTS in teachers table');
    }

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await pool.end();
  }
}

checkTeachersSchema();
