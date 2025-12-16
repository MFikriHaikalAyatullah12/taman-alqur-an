import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch attendance records
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
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    let query = `
      SELECT 
        sa.id,
        sa.student_id,
        sa.class_id,
        sa.attendance_date,
        sa.status,
        sa.notes,
        s.name as student_name,
        c.name as class_name
      FROM student_attendance sa
      JOIN students s ON sa.student_id = s.id
      LEFT JOIN classes c ON sa.class_id = c.id
      WHERE sa.admin_id = $1
    `;
    
    const params: any[] = [adminId];
    let paramIndex = 2;

    if (classId) {
      query += ` AND sa.class_id = $${paramIndex}`;
      params.push(classId);
      paramIndex++;
    }

    if (date) {
      query += ` AND sa.attendance_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (studentId) {
      query += ` AND sa.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    query += ` ORDER BY sa.attendance_date DESC, s.name ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, attendance: result.rows });

  } catch (error) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data absensi' 
    }, { status: 500 });
  }
}

// POST - Create or update attendance
export async function POST(request: NextRequest) {
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

    const { student_id, class_id, attendance_date, status, notes } = await request.json();

    if (!student_id || !attendance_date || !status) {
      return NextResponse.json({ 
        error: 'Student ID, tanggal, dan status wajib diisi' 
      }, { status: 400 });
    }

    // Upsert attendance (insert or update if exists)
    const result = await pool.query(`
      INSERT INTO student_attendance (
        admin_id, student_id, class_id, attendance_date, status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (student_id, attendance_date) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        id, student_id, class_id, attendance_date, status, notes, created_at
    `, [adminId, student_id, class_id, attendance_date, status, notes || null]);

    return NextResponse.json({ 
      success: true, 
      message: 'Absensi berhasil disimpan',
      attendance: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Attendance creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menyimpan absensi' 
    }, { status: 500 });
  }
}

// DELETE - Delete attendance record
export async function DELETE(request: NextRequest) {
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

    const { attendanceId } = await request.json();

    if (!attendanceId) {
      return NextResponse.json({ error: 'ID absensi tidak valid' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM student_attendance 
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `, [attendanceId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Data absensi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data absensi berhasil dihapus'
    });

  } catch (error) {
    console.error('Attendance deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data absensi' 
    }, { status: 500 });
  }
}
