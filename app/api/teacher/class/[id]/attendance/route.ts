import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

// Verify teacher access token and get teacher info
function verifyTeacherAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'teacher_access') {
      return null;
    }
    return {
      teacherId: decoded.teacherId,
      teacherName: decoded.teacherName,
      adminId: decoded.adminId
    };
  } catch (error) {
    return null;
  }
}

// Verify teacher has access to this class
async function verifyClassAccess(classId: string, teacherInfo: any) {
  const result = await pool.query(`
    SELECT id FROM classes
    WHERE id = $1 AND admin_id = $2 AND teacher_in_charge = $3
  `, [classId, teacherInfo.adminId, teacherInfo.teacherName]);
  
  return result.rows.length > 0;
}

// GET - Get attendance for a specific date
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherInfo = verifyTeacherAccess(request);
    if (!teacherInfo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = params.id;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Verify access
    const hasAccess = await verifyClassAccess(classId, teacherInfo);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    // Get attendance
    const result = await pool.query(`
      SELECT a.id, a.student_id, a.status, a.notes, a.attendance_date
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.class_id = $1 AND a.attendance_date = $2
    `, [classId, date]);

    return NextResponse.json({
      success: true,
      attendance: result.rows
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Save attendance for all students
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherInfo = verifyTeacherAccess(request);
    if (!teacherInfo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classId = params.id;

    // Verify access
    const hasAccess = await verifyClassAccess(classId, teacherInfo);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { attendance_date, attendance } = await request.json();

    if (!attendance_date || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ 
        error: 'Data absensi tidak valid' 
      }, { status: 400 });
    }

    // Save attendance for each student using upsert
    for (const att of attendance) {
      await pool.query(`
        INSERT INTO attendance (student_id, attendance_date, status, notes, class_id, recorded_by_teacher_id, admin_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (student_id, attendance_date) 
        DO UPDATE SET status = $3, notes = $4, recorded_by_teacher_id = $6, updated_at = NOW()
      `, [
        att.student_id,
        attendance_date,
        att.status,
        att.notes || '',
        classId,
        teacherInfo.teacherId,
        teacherInfo.adminId
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Absensi berhasil disimpan'
    });

  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
