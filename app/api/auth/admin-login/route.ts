import { NextRequest, NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('@/lib/db');

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Cari admin di database
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const admin = result.rows[0];

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    // Update last login
    await pool.query(
      'UPDATE admins SET last_login = NOW() WHERE id = $1',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email,
        name: admin.name,
        tpqName: admin.tpq_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return admin data (tanpa password)
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      success: true,
      token,
      admin: adminData
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ 
      error: 'Gagal login. Silakan coba lagi.' 
    }, { status: 500 });
  }
}