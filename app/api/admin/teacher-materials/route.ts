import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch teacher materials
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

    let query = `
      SELECT 
        tm.id,
        tm.teacher_id,
        tm.material_date,
        tm.material_topic,
        tm.material_description,
        tm.class_name,
        tm.duration_minutes,
        t.name as teacher_name
      FROM teacher_materials tm
      INNER JOIN teachers t ON tm.teacher_id = t.id
      WHERE tm.admin_id = $1
    `;
    
    const params: any[] = [adminId];
    let paramIndex = 2;

    if (teacherId) {
      query += ` AND tm.teacher_id = $${paramIndex}`;
      params.push(teacherId);
      paramIndex++;
    }

    if (month) {
      query += ` AND TO_CHAR(tm.material_date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    query += ` ORDER BY tm.material_date DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, materials: result.rows });

  } catch (error) {
    console.error('Teacher materials fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data materi pengajar' 
    }, { status: 500 });
  }
}

// POST - Create teacher material
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

    const { 
      teacher_id, 
      material_date, 
      material_topic, 
      material_description,
      class_name,
      duration_minutes 
    } = await request.json();

    if (!teacher_id || !material_date || !material_topic) {
      return NextResponse.json({ 
        error: 'teacher_id, material_date, dan material_topic wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO teacher_materials 
      (admin_id, teacher_id, material_date, material_topic, material_description, class_name, duration_minutes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      adminId, 
      teacher_id, 
      material_date, 
      material_topic, 
      material_description || null,
      class_name || null,
      duration_minutes || 60
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Materi berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Teacher material creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan materi' 
    }, { status: 500 });
  }
}

// DELETE - Remove teacher material
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

    const { material_id } = await request.json();

    if (!material_id) {
      return NextResponse.json({ error: 'material_id diperlukan' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM teacher_materials 
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `, [material_id, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Materi berhasil dihapus'
    });

  } catch (error) {
    console.error('Teacher material deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus materi' 
    }, { status: 500 });
  }
}
