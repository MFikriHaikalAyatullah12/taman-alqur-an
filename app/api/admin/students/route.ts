import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/lib/db');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Pastikan ada admin di database
    const adminCheck = await pool.query('SELECT id FROM admins LIMIT 1');
    if (adminCheck.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Admin tidak ditemukan. Silakan login ulang.' 
      }, { status: 400 });
    }
    
    const adminId = adminCheck.rows[0].id;

    // Get students data dengan struktur tabel yang ada
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
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { 
      name, birth_place, birth_date, parent_name, parent_phone
    } = await request.json();

    if (!name || !birth_place || !birth_date || !parent_name) {
      return NextResponse.json({ 
        error: 'Nama santri, tempat lahir, tanggal lahir, dan nama orang tua wajib diisi' 
      }, { status: 400 });
    }

    // Pastikan ada admin di database
    const adminCheck = await pool.query('SELECT id FROM admins LIMIT 1');
    if (adminCheck.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Admin tidak ditemukan. Silakan login ulang.' 
      }, { status: 400 });
    }
    
    const adminId = adminCheck.rows[0].id;

    // Gabungkan tempat dan tanggal lahir untuk address sementara
    const birthInfo = `${birth_place}, ${birth_date}`;

    // Insert student dengan field yang ada di database
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
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'ID santri tidak valid' }, { status: 400 });
    }

    // Pastikan ada admin di database
    const adminCheck = await pool.query('SELECT id FROM admins LIMIT 1');
    if (adminCheck.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Admin tidak ditemukan. Silakan login ulang.' 
      }, { status: 400 });
    }
    
    const adminId = adminCheck.rows[0].id;

    // Delete student
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