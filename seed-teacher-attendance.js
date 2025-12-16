require('dotenv').config();
const { Pool } = require('pg');

async function seedTeacherAttendance() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('\n🔄 Seeding teacher attendance data...');
    
    // Get all teachers and admins
    const teachersResult = await pool.query(`
      SELECT t.id as teacher_id, t.admin_id, t.name
      FROM teachers t
      LIMIT 10
    `);

    if (teachersResult.rows.length === 0) {
      console.log('⚠️  No teachers found. Please add teachers first.');
      return;
    }

    console.log(`Found ${teachersResult.rows.length} teachers`);

    // Seed attendance for today and last 7 days
    const today = new Date();
    const statuses = ['hadir', 'izin', 'sakit', 'alpha'];
    let insertedCount = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      for (const teacher of teachersResult.rows) {
        // Randomly assign status (80% hadir)
        const randomStatus = Math.random() < 0.8 ? 'hadir' : statuses[Math.floor(Math.random() * statuses.length)];
        
        // Random clock in/out times (for hadir status)
        const clockIn = randomStatus === 'hadir' ? '07:30:00' : null;
        const clockOut = randomStatus === 'hadir' ? '15:00:00' : null;

        try {
          await pool.query(`
            INSERT INTO teacher_attendance (
              admin_id, teacher_id, attendance_date, status, clock_in, clock_out, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (teacher_id, attendance_date) DO NOTHING
          `, [
            teacher.admin_id,
            teacher.teacher_id,
            dateStr,
            randomStatus,
            clockIn,
            clockOut,
            randomStatus !== 'hadir' ? `${randomStatus.charAt(0).toUpperCase() + randomStatus.slice(1)} pada tanggal ${dateStr}` : null
          ]);
          
          insertedCount++;
        } catch (err) {
          // Skip if duplicate
          if (err.code !== '23505') {
            console.error(`Error inserting for ${teacher.name} on ${dateStr}:`, err.message);
          }
        }
      }
    }

    console.log(`✅ Successfully seeded ${insertedCount} attendance records for ${teachersResult.rows.length} teachers across 7 days`);
    console.log('\n📊 Summary:');
    
    // Show summary
    const summary = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM teacher_attendance
      GROUP BY status
      ORDER BY count DESC
    `);
    
    summary.rows.forEach(row => {
      console.log(`   - ${row.status}: ${row.count} records`);
    });

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedTeacherAttendance();
