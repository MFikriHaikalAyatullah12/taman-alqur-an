import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch achievements
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (error) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT * FROM achievements WHERE admin_id = $1 ORDER BY year DESC, id DESC',
      [decoded.adminId]
    );

    // If no data exists, create default achievements
    if (result.rows.length === 0) {
      const defaultAchievements = [
        { title: 'Juara 1 Lomba MTQ Tingkat Kecamatan', year: '2024', category: 'Kompetisi', description: 'Santri TPQ meraih juara 1 dalam lomba Musabaqah Tilawatil Quran tingkat kecamatan' },
        { title: 'Akreditasi A dari Kemenag', year: '2023', category: 'Institusional', description: 'TPQ mendapat akreditasi A dari Kementerian Agama' },
        { title: 'Best TPQ Award', year: '2023', category: 'Penghargaan', description: 'Mendapat penghargaan TPQ terbaik dari Yayasan Pendidikan Islam' },
        { title: 'Hafidz Cilik Terbaik', year: '2024', category: 'Prestasi Santri', description: '5 santri berhasil menyelesaikan hafalan 5 juz Al-Quran' }
      ];

      for (const achievement of defaultAchievements) {
        await pool.query(
          'INSERT INTO achievements (admin_id, title, year, category, description) VALUES ($1, $2, $3, $4, $5)',
          [decoded.adminId, achievement.title, achievement.year, achievement.category, achievement.description]
        );
      }

      const newResult = await pool.query(
        'SELECT * FROM achievements WHERE admin_id = $1 ORDER BY year DESC, id DESC',
        [decoded.adminId]
      );
      
      return NextResponse.json({ 
        success: true, 
        data: newResult.rows 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data prestasi' 
    }, { status: 500 });
  }
}

// POST - Add new achievement
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (error) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { title, year, category, description } = await request.json();

    if (!title || !year || !category) {
      return NextResponse.json({ 
        error: 'Judul, tahun, dan kategori wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO achievements (admin_id, title, year, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [decoded.adminId, title, year, category, description || '']
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Prestasi berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding achievement:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan prestasi' 
    }, { status: 500 });
  }
}

// PUT - Update achievement
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (error) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    const { id, title, year, category, description } = await request.json();

    if (!id || !title || !year || !category) {
      return NextResponse.json({ 
        error: 'ID, judul, tahun, dan kategori wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE achievements SET title = $1, year = $2, category = $3, description = $4, updated_at = NOW() WHERE id = $5 AND admin_id = $6 RETURNING *',
      [title, year, category, description || '', id, decoded.adminId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Prestasi tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prestasi berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json({ 
      error: 'Gagal memperbarui prestasi' 
    }, { status: 500 });
  }
}