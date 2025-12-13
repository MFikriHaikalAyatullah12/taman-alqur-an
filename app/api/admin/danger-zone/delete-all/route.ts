import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let adminId;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      adminId = decoded.adminId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Mulai transaction untuk memastikan semua operasi berhasil atau gagal bersamaan
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Hapus data students
      await client.query('DELETE FROM students WHERE admin_id = $1', [adminId]);
      
      // Hapus data teachers  
      await client.query('DELETE FROM teachers WHERE admin_id = $1', [adminId]);
      
      // Hapus data finances
      await client.query('DELETE FROM finances WHERE admin_id = $1', [adminId]);
      
      // Hapus data organization_structure
      await client.query('DELETE FROM organization_structure WHERE admin_id = $1', [adminId]);
      
      // Hapus data achievements
      await client.query('DELETE FROM achievements WHERE admin_id = $1', [adminId]);
      
      // Reset settings ke default (tidak dihapus, hanya di-reset)
      await client.query(`
        UPDATE tpq_settings 
        SET 
          site_name = 'TPQ AN-NABA',
          hero_title = 'Selamat Datang di TPQ AN-NABA',
          hero_subtitle = 'Tempat Belajar Al-Quran Terpercaya',
          about_title = 'Tentang TPQ AN-NABA',
          about_description = 'TPQ AN-NABA adalah lembaga pendidikan Al-Quran yang berkomitmen memberikan pendidikan berkualitas.',
          phone = '',
          email = '',
          address = '',
          facebook_url = '',
          instagram_url = '',
          youtube_url = '',
          updated_at = NOW()
        WHERE admin_id = $1
      `, [adminId]);

      await client.query('COMMIT');

      return NextResponse.json({ 
        success: true, 
        message: 'Semua data telah berhasil dihapus' 
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error deleting all data:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data' },
      { status: 500 }
    );
  }
}