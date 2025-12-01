const { Client } = require('pg');

async function createDatabase() {
  // Connect to postgres database first to create tpq_website database
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL...');

    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'tpq_website'"
    );

    if (result.rows.length === 0) {
      // Create database
      await client.query('CREATE DATABASE tpq_website');
      console.log('✅ Database "tpq_website" created successfully!');
    } else {
      console.log('✅ Database "tpq_website" already exists.');
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ PostgreSQL connection failed!');
      console.log('');
      console.log('💡 Make sure PostgreSQL is installed and running:');
      console.log('   1. Download PostgreSQL from: https://www.postgresql.org/download/');
      console.log('   2. Install with default settings (port 5432, user: postgres)');
      console.log('   3. Start PostgreSQL service');
      console.log('');
      console.log('   OR use Docker: docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres');
      return false;
    } else {
      console.error('❌ Database creation error:', error.message);
      return false;
    }
  } finally {
    await client.end();
  }
  
  return true;
}

createDatabase().then(success => {
  if (success) {
    console.log('🎉 Ready to run: node setup-db.js');
  }
});