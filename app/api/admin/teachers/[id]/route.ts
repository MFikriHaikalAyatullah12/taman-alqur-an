import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/lib/db');

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { id } = params;
    const { name, email, phone, specialization, experience_years, education, bio, photo_url } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    // Limit bio to 500 characters to prevent database error
    const limitedBio = bio ? bio.substring(0, 500) : '';

    // Update teacher data
    const result = await pool.query(`
      UPDATE teachers 
      SET name = $1, email = $2, phone = $3, specialization = $4, 
          experience_years = $5, education = $6, bio = $7, photo_url = $8, updated_at = NOW()
      WHERE id = $9 AND admin_id = (SELECT id FROM admins LIMIT 1)
      RETURNING id, name, email, phone, specialization, experience_years, education, status, photo_url, bio
    `, [name, email, phone || '', specialization || '', experience_years || 0, education || '', limitedBio, photo_url || '', id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pengajar tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data pengajar berhasil diupdate',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Teacher update error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengupdate data pengajar' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { id } = params;

    // Delete teacher data
    const result = await pool.query(`
      DELETE FROM teachers 
      WHERE id = $1 AND admin_id = (SELECT id FROM admins LIMIT 1)
      RETURNING id, name
    `, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pengajar tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Pengajar ${result.rows[0].name} berhasil dihapus`
    });

  } catch (error) {
    console.error('Teacher delete error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data pengajar' 
    }, { status: 500 });
  }
}