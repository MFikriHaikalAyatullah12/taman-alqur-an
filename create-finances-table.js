require('dotenv').config();
const { Pool } = require('pg');

// Database connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createFinancesTable() {
  try {
    console.log('🔄 Creating finances table...');
    console.log('📡 Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Create finances table SQL
    const createFinancesSQL = `
      CREATE TABLE IF NOT EXISTS finances (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
        description TEXT,
        date DATE DEFAULT CURRENT_DATE,
        payment_method VARCHAR(50) DEFAULT 'cash',
        reference_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS idx_finances_admin_id ON finances(admin_id);
      CREATE INDEX IF NOT EXISTS idx_finances_date ON finances(date);
      CREATE INDEX IF NOT EXISTS idx_finances_type ON finances(type);
    `;
    
    console.log('📝 Creating finances table...');
    await pool.query(createFinancesSQL);
    
    console.log('✅ Finances table created successfully! 💰');
    
    // Verify table exists
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'finances'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Table verification: finances table exists');
    } else {
      console.log('❌ Table verification: finances table not found');
    }
    
    // Also check if admins table exists, if not create a simple version
    const adminResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admins'
    `);
    
    if (adminResult.rows.length === 0) {
      console.log('📝 Creating basic admins table...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          tpq_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Insert default admin
        INSERT INTO admins (name, email, password, tpq_name) 
        VALUES ('Admin', 'admin@tpq.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeR8jKKjw1DqYA6WK', 'TPQ Al-Hikmah')
        ON CONFLICT (email) DO NOTHING;
      `);
      console.log('✅ Basic admins table created!');
    }
    
    console.log('');
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

createFinancesTable();