import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch teacher performance data
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let adminId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      adminId = decoded.adminId;
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
      'SELECT id, name FROM teachers WHERE id = $1 AND admin_id = $2',
      [teacherId, adminId]
    );

    if (teacherQuery.rows.length === 0) {
      return NextResponse.json({ error: 'Pengajar tidak ditemukan' }, { status: 404 });
    }

    const teacher = teacherQuery.rows[0];

    // Get attendance data for the month
    const attendanceQuery = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'hadir') as hadir,
        COUNT(*) FILTER (WHERE status = 'izin') as izin,
        COUNT(*) FILTER (WHERE status = 'alfa') as alfa,
        COUNT(DISTINCT attendance_date) as total_days
      FROM teacher_attendance
      WHERE teacher_id = $1 
        AND admin_id = $2
        AND TO_CHAR(attendance_date, 'YYYY-MM') = $3
    `, [teacherId, adminId, month]);

    const attendance = attendanceQuery.rows[0];

    // Count materials taught in the month from teacher_materials table if exists
    // Otherwise, estimate from notes field
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
      // If teacher_materials table doesn't exist, use attendance hadir count as fallback
      console.log('teacher_materials table not found, using hadir count');
      materiCount = parseInt(attendance.hadir) || 0;
    }

    const hadir = parseInt(attendance.hadir) || 0;
    const izin = parseInt(attendance.izin) || 0;
    const alfa = parseInt(attendance.alfa) || 0;
    const totalDays = parseInt(attendance.total_days) || 0;

    // Calculate attendance percentage
    const attendancePercentage = totalDays > 0 ? (hadir / totalDays) * 100 : 0;

    // Determine performance category
    let category: 'Sempurna' | 'Baik' | 'Cukup' | 'Kurang';
    
    if (attendancePercentage >= 95 && materiCount >= 20) {
      category = 'Sempurna';
    } else if (attendancePercentage >= 85 && materiCount >= 15) {
      category = 'Baik';
    } else if (attendancePercentage >= 70 && materiCount >= 10) {
      category = 'Cukup';
    } else {
      category = 'Kurang';
    }

    const performanceData = {
      teacher_id: parseInt(teacherId),
      teacher_name: teacher.name,
      month: month,
      hadir: hadir,
      izin: izin,
      alfa: alfa,
      materi_count: materiCount,
      total_days: totalDays,
      attendance_percentage: attendancePercentage,
      category: category
    };

    return NextResponse.json({ 
      success: true, 
      performance: performanceData 
    });

  } catch (error) {
    console.error('Teacher performance fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data performa pengajar' 
    }, { status: 500 });
  }
}
