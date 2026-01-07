import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const dynamic = 'force-dynamic';

// POST - Verify teacher password and grant access to their dashboard
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teacher_id, password } = await request.json();

    if (!teacher_id || !password) {
      return NextResponse.json({ 
        error: 'ID Pengajar dan password wajib diisi' 
      }, { status: 400 });
    }

    // Get teacher data with password
    const result = await pool.query(
      'SELECT id, name, email, specialization, password, admin_id FROM teachers WHERE id = $1',
      [teacher_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Pengajar tidak ditemukan' 
      }, { status: 404 });
    }

    const teacher = result.rows[0];

    // If no password is set, deny access
    if (!teacher.password) {
      return NextResponse.json({ 
        error: 'Akun pengajar belum memiliki password. Hubungi admin.' 
      }, { status: 400 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, teacher.password);

    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Password salah' 
      }, { status: 401 });
    }

    // Get classes assigned to this teacher
    const classesResult = await pool.query(
      `SELECT id, name, description, is_active 
       FROM classes 
       WHERE teacher_in_charge = $1 AND admin_id = $2`,
      [teacher.name, teacher.admin_id]
    );

    // Generate a token for teacher to access their specific data
    const teacherAccessToken = jwt.sign(
      { 
        teacherId: teacher.id,
        teacherName: teacher.name,
        adminId: teacher.admin_id,
        type: 'teacher_access'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Verifikasi berhasil',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization
      },
      classes: classesResult.rows,
      accessToken: teacherAccessToken
    });

  } catch (error) {
    console.error('Teacher verification error:', error);
    return NextResponse.json({ 
      error: 'Terjadi kesalahan server' 
    }, { status: 500 });
  }
}
