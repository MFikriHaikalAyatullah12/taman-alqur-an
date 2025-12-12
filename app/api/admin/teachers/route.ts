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

    // Get teachers data from database
    const result = await pool.query(`
      SELECT 
        id, name, email, phone, specialization, 
        experience_years, education, status, 
        photo_url, bio, created_at
      FROM teachers 
      WHERE admin_id = (SELECT id FROM admins LIMIT 1)
      ORDER BY name ASC
    `);

    return NextResponse.json({ success: true, data: result.rows });

  } catch (error) {
    console.error('Teachers fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data pengajar' 
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

    const { name, email, phone, specialization, experience_years, education, bio, photo_url } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    // Limit bio to 300 characters to prevent database error
    const limitedBio = bio ? bio.substring(0, 300) : '';

    // Insert new teacher
    const result = await pool.query(`
      INSERT INTO teachers 
      (admin_id, name, email, phone, specialization, experience_years, education, bio, photo_url, status, created_at, updated_at)
      VALUES ((SELECT id FROM admins LIMIT 1), $1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW(), NOW())
      RETURNING id, name, email, phone, specialization, experience_years, education, status, photo_url, bio
    `, [name, email, phone || '', specialization || '', experience_years || 0, education || '', limitedBio, photo_url || '']);

    return NextResponse.json({ 
      success: true, 
      message: 'Pengajar berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Teacher creation error:', error);
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Gagal menambahkan pengajar' 
    }, { status: 500 });
  }
}