import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Get materials submitted by teacher for this class
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

    // Get materials with teacher name
    const result = await pool.query(`
      SELECT 
        cm.id, 
        cm.title, 
        cm.description, 
        cm.material_date, 
        cm.created_at,
        t.name as teacher_name
      FROM class_materials cm
      LEFT JOIN teachers t ON cm.teacher_id = t.id
      WHERE cm.class_id = $1
      ORDER BY cm.material_date DESC, cm.created_at DESC
    `, [classId]);

    return NextResponse.json({
      success: true,
      materials: result.rows
    });

  } catch (error) {
    console.error('Error fetching teacher materials:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
