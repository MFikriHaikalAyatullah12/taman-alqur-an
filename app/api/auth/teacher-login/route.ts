import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Query untuk mengecek apakah user ada dengan role teacher
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1 AND role = $2',
      [email, 'teacher']
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const teacher = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher.id, 
        email: teacher.email,
        name: teacher.name,
        role: teacher.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json({
      message: 'Login berhasil',
      token,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role
      }
    });

  } catch (error) {
    console.error('Teacher login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
