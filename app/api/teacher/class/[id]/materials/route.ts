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

// GET - Get materials for this class
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

    // Get materials
    const result = await pool.query(`
      SELECT id, title, description, material_date, created_at
      FROM class_materials
      WHERE class_id = $1
      ORDER BY material_date DESC, created_at DESC
    `, [classId]);

    return NextResponse.json({
      success: true,
      materials: result.rows
    });

  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// POST - Add new material
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

    const { title, description, material_date } = await request.json();

    if (!title || !description || !material_date) {
      return NextResponse.json({ 
        error: 'Judul, deskripsi, dan tanggal materi wajib diisi' 
      }, { status: 400 });
    }

    // Insert material
    const result = await pool.query(`
      INSERT INTO class_materials (
        class_id, teacher_id, admin_id, title, description, material_date, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id, title, description, material_date, created_at
    `, [
      classId,
      teacherInfo.teacherId,
      teacherInfo.adminId,
      title,
      description,
      material_date
    ]);

    return NextResponse.json({
      success: true,
      message: 'Materi berhasil ditambahkan',
      material: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding material:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
