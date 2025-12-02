import { NextRequest, NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');
const pool = require('@/lib/db');

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, address } = await request.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Data wajib tidak lengkap' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    // Generate default TPQ name dari nama admin
    const defaultTpqName = `TPQ ${name}`;

    // Cek apakah email sudah terdaftar
    const existingAdmin = await pool.query(
      'SELECT id FROM admins WHERE email = $1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat admin dan TPQ settings dalam satu transaksi
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert admin
      const adminResult = await client.query(
        `INSERT INTO admins (name, email, password, tpq_name, phone, address, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
         RETURNING id, name, email, tpq_name`,
        [name, email, hashedPassword, defaultTpqName, phone || '', address || '']
      );

      const adminId = adminResult.rows[0].id;

      // Insert default TPQ settings untuk admin ini
      await client.query(
        `INSERT INTO tpq_settings (admin_id, site_name, site_description, whatsapp, phone, email, address, hero_title, hero_subtitle, about_title, about_description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          adminId,
          defaultTpqName,
          `${defaultTpqName} adalah Taman Pendidikan Al-Quran yang berkualitas dengan metode pembelajaran yang menyenangkan`,
          phone || '6281234567890',
          phone || '(021) 123-4567',
          email,
          address || 'Alamat TPQ belum diatur',
          `Selamat Datang di ${defaultTpqName}`,
          'Tempat terbaik untuk belajar Al-Quran dengan metode yang menyenangkan',
          `Tentang ${defaultTpqName}`,
          `${defaultTpqName} adalah lembaga pendidikan Al-Quran yang berkomitmen memberikan pendidikan berkualitas dengan metode pembelajaran yang mudah dipahami dan menyenangkan.`
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({ 
        success: true, 
        message: 'Admin berhasil didaftarkan',
        admin: adminResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json({ 
      error: 'Gagal mendaftar admin. Silakan coba lagi.' 
    }, { status: 500 });
  }
}