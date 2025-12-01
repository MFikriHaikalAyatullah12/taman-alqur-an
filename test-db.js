require('dotenv').config({ path: '.env.local' });
const pool = require('./lib/db');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Server time:', result.rows[0].now);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database connection test passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('');
    console.log('💡 Possible solutions:');
    console.log('   1. Check DATABASE_URL in .env.local');
    console.log('   2. Make sure Neon PostgreSQL is accessible');
    console.log('   3. Check firewall/network settings');
    console.log('');
    console.log('Current DATABASE_URL pattern:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/\/\/[^@]+@/, '//***:***@') : 'Not set');
    return false;
  }
}

testConnection();