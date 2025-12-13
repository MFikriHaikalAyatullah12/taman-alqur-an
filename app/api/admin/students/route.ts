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

    // Get students data untuk admin yang login saja
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        phone, 
        address,
        birth_date,
        parent_name,
        parent_phone,
        enrollment_date,
        status,
        created_at,
        updated_at
      FROM students 
      WHERE admin_id = $1
      ORDER BY id DESC
    `, [adminId]);

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
      name, birth_place, birth_date, parent_name, parent_phone
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
        admin_id, name, address, birth_date, parent_name, parent_phone, status
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 'active'
      )
      RETURNING 
        id, 
        name,
        address,
        birth_date,
        parent_name,
        parent_phone,
        enrollment_date,
        status,
        created_at
    `, [
      adminId, name, birthInfo, birth_date, parent_name, parent_phone || ''
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