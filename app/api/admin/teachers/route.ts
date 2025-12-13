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

    // Get teachers data untuk admin yang login saja
    const result = await pool.query(`
      SELECT 
        id, name, email, phone, specialization, 
        experience_years, education, status, 
        photo_url, bio, created_at
      FROM teachers 
      WHERE admin_id = $1
      ORDER BY name ASC
    `, [adminId]);

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

    const { name, email, phone, specialization, experience_years, education, bio, photo_url } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    // Limit bio to 300 characters to prevent database error
    const limitedBio = bio ? bio.substring(0, 300) : '';

    // Insert new teacher untuk admin yang login
    const result = await pool.query(`
      INSERT INTO teachers 
      (admin_id, name, email, phone, specialization, experience_years, education, bio, photo_url, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', NOW(), NOW())
      RETURNING id, name, email, phone, specialization, experience_years, education, status, photo_url, bio
    `, [adminId, name, email, phone || '', specialization || '', experience_years || 0, education || '', limitedBio, photo_url || '']);

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