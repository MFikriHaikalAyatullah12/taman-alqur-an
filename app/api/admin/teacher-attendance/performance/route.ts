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

    // Get classes where this teacher is in charge
    const classesQuery = await pool.query(
      'SELECT id, name FROM classes WHERE teacher_in_charge = $1 AND admin_id = $2',
      [teacher.name, adminId]
    );

    const classIds = classesQuery.rows.map((c: any) => c.id);

    let hadir = 0, izin = 0, alfa = 0, sakit = 0, totalDays = 0;

    // Get teacher attendance from teacher_class_attendance (confirmed by admin)
    if (classIds.length > 0) {
      const attendanceQuery = await pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE status = 'hadir') as hadir,
          COUNT(*) FILTER (WHERE status = 'izin') as izin,
          COUNT(*) FILTER (WHERE status = 'alfa') as alfa,
          COUNT(*) FILTER (WHERE status = 'sakit') as sakit,
          COUNT(DISTINCT attendance_date) as total_days
        FROM teacher_class_attendance
        WHERE class_id = ANY($1::int[])
          AND admin_id = $2
          AND TO_CHAR(attendance_date, 'YYYY-MM') = $3
      `, [classIds, adminId, month]);

      const attendance = attendanceQuery.rows[0];
      hadir = parseInt(attendance.hadir) || 0;
      izin = parseInt(attendance.izin) || 0;
      alfa = parseInt(attendance.alfa) || 0;
      sakit = parseInt(attendance.sakit) || 0;
      totalDays = parseInt(attendance.total_days) || 0;
    }

    // Count materials from class_materials (input by teacher via Portal Guru)
    let materiCount = 0;
    
    if (classIds.length > 0) {
      try {
        const materiQuery = await pool.query(`
          SELECT COUNT(*) as materi_count
          FROM class_materials
          WHERE class_id = ANY($1::int[])
            AND TO_CHAR(material_date, 'YYYY-MM') = $2
        `, [classIds, month]);
        
        materiCount = parseInt(materiQuery.rows[0].materi_count) || 0;
      } catch (error) {
        console.log('class_materials table error:', error);
        materiCount = 0;
      }
    }

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
      sakit: sakit,
      materi_count: materiCount,
      total_days: totalDays,
      attendance_percentage: attendancePercentage,
      category: category,
      classes: classesQuery.rows.map((c: any) => c.name)
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
