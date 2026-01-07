import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

// GET - Get teacher class attendance status for a specific class
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
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const classId = params.id;

    // Get all teacher attendance confirmations for this class
    const result = await pool.query(`
      SELECT id, class_id, teacher_name, attendance_date, status, notes, created_at
      FROM teacher_class_attendance
      WHERE class_id = $1 AND admin_id = $2
      ORDER BY attendance_date DESC
    `, [classId, decoded.adminId]);

    return NextResponse.json({
      success: true,
      attendance: result.rows
    });

  } catch (error) {
    console.error('Error fetching teacher class attendance:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Save or update teacher attendance status for a class on a specific date
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const classId = params.id;

    const { attendance_date, status, notes } = await request.json();

    if (!attendance_date || !status) {
      return NextResponse.json({ 
        error: 'attendance_date dan status wajib diisi' 
      }, { status: 400 });
    }

    // Valid statuses
    const validStatuses = ['hadir', 'izin', 'sakit', 'alfa'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Status tidak valid. Gunakan: hadir, izin, sakit, atau alfa' 
      }, { status: 400 });
    }

    // Get teacher name from class
    const classResult = await pool.query(`
      SELECT teacher_in_charge FROM classes WHERE id = $1 AND admin_id = $2
    `, [classId, decoded.adminId]);

    if (classResult.rows.length === 0) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    const teacherName = classResult.rows[0].teacher_in_charge;

    // Upsert teacher class attendance
    await pool.query(`
      INSERT INTO teacher_class_attendance (class_id, teacher_name, attendance_date, status, notes, admin_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (class_id, attendance_date) 
      DO UPDATE SET status = $4, notes = $5, updated_at = NOW()
    `, [classId, teacherName, attendance_date, status, notes || '', decoded.adminId]);

    return NextResponse.json({
      success: true,
      message: 'Status kehadiran guru berhasil disimpan'
    });

  } catch (error) {
    console.error('Error saving teacher class attendance:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
