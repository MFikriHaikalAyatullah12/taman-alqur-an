import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Get attendance summary submitted by teacher for this class
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const classId = params.id;

    // Verify class belongs to admin
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND admin_id = $2',
      [classId, adminId]
    );

    if (classCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    // Get attendance summary by date (only attendance recorded by teachers)
    const result = await pool.query(`
      SELECT 
        attendance_date as date,
        SUM(CASE WHEN status = 'hadir' THEN 1 ELSE 0 END) as hadir,
        SUM(CASE WHEN status = 'izin' THEN 1 ELSE 0 END) as izin,
        SUM(CASE WHEN status = 'sakit' THEN 1 ELSE 0 END) as sakit,
        SUM(CASE WHEN status = 'alfa' THEN 1 ELSE 0 END) as alfa,
        COUNT(*) as total
      FROM attendance
      WHERE class_id = $1 AND recorded_by_teacher_id IS NOT NULL
      GROUP BY attendance_date
      ORDER BY attendance_date DESC
      LIMIT 30
    `, [classId]);

    return NextResponse.json({
      success: true,
      summary: result.rows.map(row => ({
        date: row.date,
        hadir: parseInt(row.hadir) || 0,
        izin: parseInt(row.izin) || 0,
        sakit: parseInt(row.sakit) || 0,
        alfa: parseInt(row.alfa) || 0,
        total: parseInt(row.total) || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching teacher attendance summary:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
