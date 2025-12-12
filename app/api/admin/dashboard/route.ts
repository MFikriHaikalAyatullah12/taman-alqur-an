import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/lib/db');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Get dashboard statistics from database
    const [studentsResult, teachersResult, pendingRegistrationsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM students WHERE admin_id = (SELECT id FROM admins WHERE id = $1)', [1]), // Assuming admin_id 1 for now
      pool.query('SELECT COUNT(*) as count FROM teachers WHERE admin_id = (SELECT id FROM admins WHERE id = $1)', [1]),
      pool.query('SELECT COUNT(*) as count FROM students WHERE status = $1 AND admin_id = (SELECT id FROM admins WHERE id = $2)', ['pending', 1])
    ]);

    // Get recent activities (simplified for now)
    const recentActivities = await pool.query(`
      SELECT 'student' as type, name as message, created_at 
      FROM students 
      WHERE admin_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [1]);

    const stats = {
      totalStudents: parseInt(studentsResult.rows[0]?.count || 0),
      totalTeachers: parseInt(teachersResult.rows[0]?.count || 0),
      pendingRegistrations: parseInt(pendingRegistrationsResult.rows[0]?.count || 0),
      activePrograms: 6, // Static for now
      monthlyRevenue: 0, // Will be calculated from payments table when implemented
      recentActivities: recentActivities.rows.map(activity => ({
        id: Date.now() + Math.random(),
        type: activity.type,
        message: `${activity.message} terdaftar sebagai santri baru`,
        time: formatTimeAgo(activity.created_at)
      }))
    };

    return NextResponse.json({ success: true, data: stats });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data dashboard' 
    }, { status: 500 });
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  
  if (diff < 60) return `${diff} detik yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
}