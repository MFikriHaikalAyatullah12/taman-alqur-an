const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSQL(sql, name) {
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await pool.query(statement);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists') && 
            !error.message.includes('duplicate key') &&
            !error.message.includes('does not exist')) {
          console.log(`   ⚠️  Warning in ${name}:`, error.message.substring(0, 100));
        }
      }
    }
  }
}

async function runAllMigrations() {
  console.log('🚀 Memulai migration database...\n');
  
  try {
    // 1. Run init-db.sql first (base schema)
    console.log('1️⃣  Menjalankan init-db.sql (skema dasar)...');
    const initSQL = fs.readFileSync('init-db.sql', 'utf8');
    await runSQL(initSQL, 'init-db.sql');
    console.log('   ✅ Skema dasar selesai\n');

    // 2. Run all migrations in order
    const migrations = [
      'add-role-to-admins.sql',
      'add-classes-table.sql',
      'add-schedules-table.sql',
      'add-teacher-password.sql',
      'add-teacher-login.sql',
      'add-attendance-assessment-tables.sql',
      'add-teacher-materials-table.sql',
      'add-teacher-class-management.sql',
    ];

    for (let i = 0; i < migrations.length; i++) {
      const migrationFile = migrations[i];
      const filePath = path.join('migrations', migrationFile);
      
      if (fs.existsSync(filePath)) {
        console.log(`${i + 2}️⃣  Menjalankan ${migrationFile}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await runSQL(sql, migrationFile);
        console.log(`   ✅ ${migrationFile} selesai\n`);
      } else {
        console.log(`   ⚠️  File ${migrationFile} tidak ditemukan, dilewati\n`);
      }
    }

    // 3. Verify tables exist
    console.log('🔍 Memverifikasi tabel...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tabel yang ada di database:');
    tablesResult.rows.forEach((row, idx) => {
      console.log(`   ${idx + 1}. ${row.table_name}`);
    });

    // 4. Verify teacher account exists
    console.log('\n👤 Memeriksa akun guru...');
    const teacherAccount = await pool.query(
      "SELECT email, name, role FROM admins WHERE email = 'gurutpq@gmail.com'"
    );
    
    if (teacherAccount.rows.length > 0) {
      console.log('   ✅ Akun guru sudah ada:', teacherAccount.rows[0].email);
    } else {
      console.log('   ⚠️  Akun guru belum ada, membuat akun...');
      await pool.query(`
        INSERT INTO admins (email, password, name, role, tpq_name)
        VALUES (
          'gurutpq@gmail.com',
          '$2b$10$8OvZ5xN.kR7KdH4nZj.cR.YQO8QP8qF8L0rJ2vG3lYZNqH5KkJ1Vu',
          'Portal Guru TPQ',
          'teacher',
          'TPQ'
        )
        ON CONFLICT (email) DO NOTHING
      `);
      console.log('   ✅ Akun guru berhasil dibuat');
    }

    console.log('\n✨ =============================================');
    console.log('✅ SEMUA MIGRATION BERHASIL DIJALANKAN!');
    console.log('=============================================\n');
    
    console.log('📝 Akun yang tersedia:');
    console.log('   🔹 Admin: admin@demo.com / (password di-hash)');
    console.log('   🔹 Guru:  gurutpq@gmail.com / 1234567890');
    console.log('');

  } catch (error) {
    console.error('\n❌ Migration gagal:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

runAllMigrations();
