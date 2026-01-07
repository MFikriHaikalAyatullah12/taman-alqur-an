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

// GET - Get students in class
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

    // Verify access
    const hasAccess = await verifyClassAccess(classId, teacherInfo);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    // Get students
    const result = await pool.query(`
      SELECT id, name, parent_name, parent_phone, status, created_at
      FROM students
      WHERE class_id = $1 AND admin_id = $2
      ORDER BY name ASC
    `, [classId, teacherInfo.adminId]);

    return NextResponse.json({
      success: true,
      students: result.rows
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Add new student to class (by teacher)
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

    const { name, parent_name, parent_phone, birth_place, birth_date } = await request.json();

    if (!name || !parent_name || !birth_place || !birth_date) {
      return NextResponse.json({ 
        error: 'Nama santri, nama orang tua, tempat dan tanggal lahir wajib diisi' 
      }, { status: 400 });
    }

    // Insert student
    const result = await pool.query(`
      INSERT INTO students (
        admin_id, class_id, name, parent_name, parent_phone, 
        address, enrollment_date, status, created_at, updated_at,
        added_by_teacher_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, 'active', NOW(), NOW(), $7)
      RETURNING id, name, parent_name, parent_phone, status
    `, [
      teacherInfo.adminId, 
      classId, 
      name, 
      parent_name, 
      parent_phone || '', 
      `${birth_place}, ${birth_date}`,
      teacherInfo.teacherId
    ]);

    return NextResponse.json({
      success: true,
      message: 'Santri berhasil ditambahkan',
      student: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding student:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
