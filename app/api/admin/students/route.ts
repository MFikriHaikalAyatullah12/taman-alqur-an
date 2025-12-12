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

    // Get students data with minimal columns
    const result = await pool.query(`
      SELECT * FROM students 
      WHERE admin_id = (SELECT id FROM admins LIMIT 1)
      ORDER BY id ASC
    `);

    return NextResponse.json({ success: true, data: result.rows });

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
      name, address, birth_date, 
      parent_job, parent_phone, level 
    } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nama wajib diisi' }, { status: 400 });
    }

    // Try simple insert with basic fields
    const result = await pool.query(`
      INSERT INTO students (admin_id, name)
      VALUES ((SELECT id FROM admins LIMIT 1), $1)
      RETURNING *
    `, [name]);

    return NextResponse.json({ 
      success: true, 
      message: 'Santri berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Student creation error:', error);
    if (error.code === '23505') { // Unique constraint violation
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

    // Delete student
    const result = await pool.query(`
      DELETE FROM students 
      WHERE id = $1 AND admin_id = (SELECT id FROM admins LIMIT 1)
      RETURNING *
    `, [studentId]);

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