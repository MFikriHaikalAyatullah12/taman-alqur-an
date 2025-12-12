import { NextRequest, NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const pool = require('@/lib/db');

export const dynamic = 'force-dynamic';

// Helper function untuk verifikasi admin token
async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Ambil data donasi
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(`
      SELECT 
        id, donor_name, amount, donation_type, message, 
        created_at, status, payment_method
      FROM donations 
      WHERE admin_id = $1
      ORDER BY created_at DESC
    `, [admin.adminId]);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Donations fetch error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data donasi' }, { status: 500 });
  }
}

// POST - Tambah donasi baru
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { donor_name, amount, donation_type, message, payment_method } = await request.json();

    if (!donor_name || !amount || !donation_type) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO donations (
        admin_id, donor_name, amount, donation_type, message, 
        payment_method, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', NOW())
      RETURNING *
    `, [admin.adminId, donor_name, amount, donation_type, message || '', payment_method || 'cash']);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Donation creation error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan donasi' }, { status: 500 });
  }
}

// PUT - Update status donasi
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    const result = await pool.query(`
      UPDATE donations 
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND admin_id = $3
      RETURNING *
    `, [status, id, admin.adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Donasi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Donation update error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate donasi' }, { status: 500 });
  }
}