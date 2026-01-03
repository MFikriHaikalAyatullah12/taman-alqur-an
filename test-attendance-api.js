require('dotenv').config();
const fetch = require('node-fetch');

async function testAttendanceAPI() {
  try {
    console.log('🧪 Testing Teacher Attendance API...\n');
    
    // First login to get token
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'gurutpq@gmail.com',
        password: '1234567890',
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      process.exit(1);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // Get teachers first
    console.log('2️⃣ Fetching teachers...');
    const teachersResponse = await fetch('http://localhost:3000/api/admin/teachers', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!teachersResponse.ok) {
      console.error('❌ Failed to fetch teachers:', await teachersResponse.text());
      process.exit(1);
    }

    const teachersData = await teachersResponse.json();
    const teachers = teachersData.teachers || [];
    console.log(`✅ Found ${teachers.length} teachers\n`);

    if (teachers.length === 0) {
      console.log('⚠️  No teachers found. Please add a teacher first.');
      process.exit(0);
    }

    // Test attendance save with first teacher
    const testTeacher = teachers[0];
    console.log(`3️⃣ Testing attendance save for: ${testTeacher.name} (ID: ${testTeacher.id})`);
    
    const today = new Date().toISOString().split('T')[0];
    
    const attendancePayload = {
      teacher_id: testTeacher.id,
      attendance_date: today,
      status: 'hadir',
      clock_in: '08:00',
      clock_out: '12:00',
      notes: 'Test dari script'
    };
    
    console.log('📤 Sending payload:', JSON.stringify(attendancePayload, null, 2));
    
    const saveResponse = await fetch('http://localhost:3000/api/admin/teacher-attendance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendancePayload),
    });

    console.log(`\n📥 Response status: ${saveResponse.status} ${saveResponse.statusText}`);
    
    const responseData = await saveResponse.json();
    console.log('📥 Response data:', JSON.stringify(responseData, null, 2));

    if (saveResponse.ok) {
      console.log('\n✅ Attendance saved successfully!');
    } else {
      console.log('\n❌ Failed to save attendance');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAttendanceAPI();
