require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testFinancesAPI() {
  try {
    console.log('🧪 Testing finances API...');
    
    // Test database connection and query
    const result = await pool.query('SELECT COUNT(*) as count FROM finances');
    console.log(`✅ Finances table accessible. Current records: ${result.rows[0].count}`);
    
    // Check if admin exists
    const adminResult = await pool.query('SELECT id, name FROM admins LIMIT 1');
    if (adminResult.rows.length > 0) {
      console.log(`✅ Admin found: ${adminResult.rows[0].name}`);
      
      // Add sample data if table is empty
      if (parseInt(result.rows[0].count) === 0) {
        console.log('📝 Adding sample finance data...');
        const adminId = adminResult.rows[0].id;
        
        await pool.query(`
          INSERT INTO finances (admin_id, type, category, amount, description, date) 
          VALUES 
            ($1, 'income', 'SPP/Biaya Pendidikan', 500000, 'SPP bulan Desember 2025', '2025-12-13'),
            ($1, 'income', 'Donasi', 200000, 'Donasi dari alumni', '2025-12-12'),
            ($1, 'expense', 'Gaji Guru/Staff', 1500000, 'Gaji guru bulan Desember', '2025-12-10'),
            ($1, 'expense', 'Listrik & Air', 300000, 'Tagihan listrik dan air', '2025-12-11')
        `, [adminId]);
        
        console.log('✅ Sample data added successfully!');
      }
    } else {
      console.log('❌ No admin found. Please ensure admin is registered.');
    }
    
    console.log('');
    console.log('🎉 Database is ready for finances module!');
    console.log('💰 You can now use the finances feature in the admin panel.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('relation "finances" does not exist')) {
      console.log('💡 Run: node create-finances-table.js first');
    }
  } finally {
    await pool.end();
  }
}

testFinancesAPI();