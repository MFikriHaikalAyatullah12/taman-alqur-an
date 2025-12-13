import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Fetch organization structure
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
      'SELECT * FROM organization_structure WHERE admin_id = $1 ORDER BY id ASC',
      [decoded.adminId]
    );

    // If no data exists, create default structure
    if (result.rows.length === 0) {
      const defaultStructure = [
        { position: 'Kepala TPQ', name: 'Ustadz Ahmad Fauzi', description: 'Memimpin dan mengawasi seluruh kegiatan TPQ' },
        { position: 'Wakil Kepala', name: 'Ustadzah Siti Fatimah', description: 'Membantu kepala dalam mengelola TPQ' },
        { position: 'Koordinator Pendidikan', name: 'Ustadz Muhammad Yusuf', description: 'Mengkoordinasi program pembelajaran' },
        { position: 'Bendahara', name: 'Ustadzah Aminah', description: 'Mengelola keuangan TPQ' },
        { position: 'Sekretaris', name: 'Ustadz Abdul Rahman', description: 'Mengelola administrasi TPQ' }
      ];

      for (const member of defaultStructure) {
        await pool.query(
          'INSERT INTO organization_structure (admin_id, position, name, description) VALUES ($1, $2, $3, $4)',
          [decoded.adminId, member.position, member.name, member.description]
        );
      }

      const newResult = await pool.query(
        'SELECT * FROM organization_structure WHERE admin_id = $1 ORDER BY id ASC',
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
    console.error('Error fetching organization:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data organisasi' 
    }, { status: 500 });
  }
}

// POST - Add new organization member
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

    const { position, name, description } = await request.json();

    if (!position || !name) {
      return NextResponse.json({ 
        error: 'Posisi dan nama wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO organization_structure (admin_id, position, name, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [decoded.adminId, position, name, description || '']
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Anggota organisasi berhasil ditambahkan',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding organization member:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan anggota organisasi' 
    }, { status: 500 });
  }
}

// PUT - Update organization member
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

    const { id, position, name, description } = await request.json();

    if (!id || !position || !name) {
      return NextResponse.json({ 
        error: 'ID, posisi, dan nama wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE organization_structure SET position = $1, name = $2, description = $3 WHERE id = $4 AND admin_id = $5 RETURNING *',
      [position, name, description || '', id, decoded.adminId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Anggota organisasi tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Anggota organisasi berhasil diperbarui',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating organization member:', error);
    return NextResponse.json({ 
      error: 'Gagal memperbarui anggota organisasi' 
    }, { status: 500 });
  }
}