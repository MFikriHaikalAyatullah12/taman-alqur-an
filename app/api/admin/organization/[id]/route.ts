import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// DELETE - Delete organization member
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const memberId = parseInt(params.id);
    if (isNaN(memberId)) {
      return NextResponse.json({ 
        error: 'ID anggota tidak valid' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM organization_structure WHERE id = $1 AND admin_id = $2 RETURNING *',
      [memberId, decoded.adminId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Anggota organisasi tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Anggota organisasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting organization member:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus anggota organisasi' 
    }, { status: 500 });
  }
}