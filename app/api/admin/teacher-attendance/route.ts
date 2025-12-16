import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch teacher attendance records
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
    const teacherId = searchParams.get('teacherId');
    const date = searchParams.get('date');
    const month = searchParams.get('month'); // Format: YYYY-MM

    let query = `
      SELECT 
        ta.id,
        ta.teacher_id,
        ta.attendance_date,
        ta.status,
        ta.clock_in,
        ta.clock_out,
        ta.notes,
        t.name as teacher_name
      FROM teacher_attendance ta
      INNER JOIN teachers t ON ta.teacher_id = t.id AND t.admin_id = $1
      WHERE ta.admin_id = $1
    `;
    
    const params: any[] = [adminId];
    let paramIndex = 2;

    if (teacherId) {
      query += ` AND ta.teacher_id = $${paramIndex}`;
      params.push(teacherId);
      paramIndex++;
    }

    if (date) {
      query += ` AND ta.attendance_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (month) {
      query += ` AND TO_CHAR(ta.attendance_date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    query += ` ORDER BY ta.attendance_date DESC, t.name ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, attendance: result.rows });

  } catch (error) {
    console.error('Teacher attendance fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data absensi pengajar' 
    }, { status: 500 });
  }
}

// POST - Create or update teacher attendance
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

    const { teacher_id, attendance_date, status, clock_in, clock_out, notes } = await request.json();

    if (!teacher_id || !attendance_date || !status) {
      return NextResponse.json({ 
        error: 'Teacher ID, tanggal, dan status wajib diisi' 
      }, { status: 400 });
    }

    // Upsert attendance (insert or update if exists)
    const result = await pool.query(`
      INSERT INTO teacher_attendance (
        admin_id, teacher_id, attendance_date, status, clock_in, clock_out, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (teacher_id, attendance_date) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        clock_in = EXCLUDED.clock_in,
        clock_out = EXCLUDED.clock_out,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        id, teacher_id, attendance_date, status, clock_in, clock_out, notes, created_at
    `, [adminId, teacher_id, attendance_date, status, clock_in || null, clock_out || null, notes || null]);

    return NextResponse.json({ 
      success: true, 
      message: 'Absensi pengajar berhasil disimpan',
      attendance: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Teacher attendance creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menyimpan absensi pengajar' 
    }, { status: 500 });
  }
}

// DELETE - Delete teacher attendance record
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
      DELETE FROM teacher_attendance 
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `, [attendanceId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Data absensi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data absensi pengajar berhasil dihapus'
    });

  } catch (error) {
    console.error('Teacher attendance deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data absensi pengajar' 
    }, { status: 500 });
  }
}
