import { NextRequest, NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const pool = require('@/lib/db');

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { newTpqName } = await request.json();

    if (!newTpqName) {
      return NextResponse.json({ error: 'Nama TPQ tidak boleh kosong' }, { status: 400 });
    }

    // Update di tabel admin
    await pool.query(
      'UPDATE admins SET tpq_name = $1, updated_at = NOW() WHERE id = $2',
      [newTpqName, admin.adminId]
    );

    // Update di tabel settings untuk hero title, about title, dll yang menggunakan nama TPQ
    await pool.query(
      `UPDATE tpq_settings SET
        hero_title = CASE 
          WHEN hero_title LIKE '%TPQ%' OR hero_title LIKE '%Selamat Datang%' 
          THEN $1 
          ELSE hero_title 
        END,
        about_title = CASE 
          WHEN about_title LIKE '%TPQ%' OR about_title LIKE '%Tentang%' 
          THEN $2 
          ELSE about_title 
        END,
        updated_at = NOW()
      WHERE admin_id = $3`,
      [
        `Selamat Datang di ${newTpqName}`,
        `Tentang ${newTpqName}`, 
        admin.adminId
      ]
    );

    // Update juga di tabel lain yang mungkin punya referensi nama TPQ
    // (bisa ditambahkan sesuai kebutuhan database)
    
    return NextResponse.json({ 
      success: true,
      message: 'Global references berhasil diupdate',
      newTpqName 
    });

  } catch (error) {
    console.error('Update global references error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengupdate global references',
      success: false 
    }, { status: 500 });
  }
}