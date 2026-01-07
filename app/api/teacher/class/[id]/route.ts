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

// GET - Get class details
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

    // Get class data - verify teacher is assigned to this class
    const result = await pool.query(`
      SELECT id, name, description, teacher_in_charge, is_active
      FROM classes
      WHERE id = $1 AND admin_id = $2 AND teacher_in_charge = $3
    `, [classId, teacherInfo.adminId, teacherInfo.teacherName]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Kelas tidak ditemukan atau Anda tidak memiliki akses' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      class: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
