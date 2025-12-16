import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

    // Get classId filter from query params
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.phone, 
        s.address,
        s.birth_date,
        s.parent_name,
        s.parent_phone,
        s.enrollment_date,
        s.status,
        s.class_id,
        s.created_at,
        s.updated_at,
        c.name as class_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.admin_id = $1
    `;
    
    const params: any[] = [adminId];
    
    // Filter by class if classId is provided
    if (classId && classId !== 'all') {
      query += ` AND s.class_id = $2`;
      params.push(classId);
    }
    
    query += ` ORDER BY s.id DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, students: result.rows });

  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data santri' 
    }, { status: 500 });
  }
}

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
      name, birth_place, birth_date, parent_name, parent_phone, class_id
    } = await request.json();

    if (!name || !birth_place || !birth_date || !parent_name) {
      return NextResponse.json({ 
        error: 'Nama santri, tempat lahir, tanggal lahir, dan nama orang tua wajib diisi' 
      }, { status: 400 });
    }

    // Gabungkan tempat dan tanggal lahir untuk address sementara
    const birthInfo = `${birth_place}, ${birth_date}`;

    // Insert student untuk admin yang login
    const result = await pool.query(`
      INSERT INTO students (
        admin_id, name, address, birth_date, parent_name, parent_phone, class_id, status
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'active'
      )
      RETURNING 
        id, 
        name,
        address,
        birth_date,
        parent_name,
        parent_phone,
        class_id,
        enrollment_date,
        status,
        created_at
    `, [
      adminId, name, birthInfo, birth_date, parent_name, parent_phone || '', class_id || null
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Santri berhasil ditambahkan',
      data: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Student creation error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Data santri sudah terdaftar' }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Gagal menambahkan santri' 
    }, { status: 500 });
  }
}

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

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'ID santri tidak valid' }, { status: 400 });
    }

    // Delete student only for the logged in admin
    const result = await pool.query(`
      DELETE FROM students 
      WHERE id = $1 AND admin_id = $2
      RETURNING name
    `, [studentId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Santri tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Santri ${result.rows[0].name} berhasil dihapus`
    });

  } catch (error) {
    console.error('Student deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus santri' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const { studentId, class_id } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'ID santri tidak valid' }, { status: 400 });
    }

    // Update student's class_id (can be null to remove from class)
    const result = await pool.query(`
      UPDATE students 
      SET class_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND admin_id = $3
      RETURNING id, name, class_id
    `, [class_id, studentId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Santri tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: class_id ? 'Santri berhasil ditambahkan ke kelas' : 'Santri berhasil dikeluarkan dari kelas',
      student: result.rows[0]
    });

  } catch (error) {
    console.error('Student update error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengupdate santri' 
    }, { status: 500 });
  }
}