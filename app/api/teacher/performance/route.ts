import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// GET - Fetch teacher performance for teacher portal
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      // Verify token is valid (teacher role)
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.role !== 'teacher') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');
    const month = searchParams.get('month'); // Format: YYYY-MM

    if (!teacherId || !month) {
      return NextResponse.json({ 
        error: 'Parameter teacher_id dan month diperlukan' 
      }, { status: 400 });
    }

    // Get teacher info
    const teacherQuery = await pool.query(
      'SELECT id, name, admin_id, specialization FROM teachers WHERE id = $1',
      [teacherId]
    );

    if (teacherQuery.rows.length === 0) {
      return NextResponse.json({ error: 'Pengajar tidak ditemukan' }, { status: 404 });
    }

    const teacher = teacherQuery.rows[0];
    const adminId = teacher.admin_id;

    // Get attendance data for the month
    const attendanceQuery = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'hadir') as hadir,
        COUNT(*) FILTER (WHERE status = 'izin') as izin,
        COUNT(*) FILTER (WHERE status = 'alfa') as alfa,
        COUNT(*) FILTER (WHERE status = 'sakit') as sakit,
        COUNT(DISTINCT attendance_date) as total_days
      FROM teacher_attendance
      WHERE teacher_id = $1 
        AND admin_id = $2
        AND TO_CHAR(attendance_date, 'YYYY-MM') = $3
    `, [teacherId, adminId, month]);

    const attendance = attendanceQuery.rows[0];

    // Count materials taught in the month
    let materiCount = 0;
    
    try {
      const materiQuery = await pool.query(`
        SELECT COUNT(*) as materi_count
        FROM teacher_materials
        WHERE teacher_id = $1 
          AND admin_id = $2
          AND TO_CHAR(material_date, 'YYYY-MM') = $3
      `, [teacherId, adminId, month]);
      
      materiCount = parseInt(materiQuery.rows[0].materi_count) || 0;
    } catch (error) {
      // If teacher_materials table doesn't exist, use hadir count as fallback
      materiCount = parseInt(attendance.hadir) || 0;
    }

    const hadir = parseInt(attendance.hadir) || 0;
    const izin = parseInt(attendance.izin) || 0;
    const alfa = parseInt(attendance.alfa) || 0;
    const sakit = parseInt(attendance.sakit) || 0;
    const totalDays = parseInt(attendance.total_days) || 0;

    // Calculate attendance percentage
    const attendancePercentage = totalDays > 0 ? ((hadir / totalDays) * 100).toFixed(1) : '0';

    // Return performance data
    return NextResponse.json({
      success: true,
      performance: {
        teacher_name: teacher.name,
        teacher_specialization: teacher.specialization,
        hadir,
        izin,
        alfa,
        sakit,
        total_days: totalDays,
        materiCount,
        attendancePercentage,
        month
      }
    });

  } catch (error) {
    console.error('Teacher performance fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data performa' 
    }, { status: 500 });
  }
}
