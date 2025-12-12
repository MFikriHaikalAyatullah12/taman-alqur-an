import { NextRequest, NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const pool = require('@/lib/db');

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Helper function untuk verifikasi admin token
async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Ambil settings admin
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT * FROM tpq_settings WHERE admin_id = $1',
      [admin.adminId]
    );

    if (result.rows.length === 0) {
      // Buat settings default jika belum ada
      const defaultSettings = {
        admin_id: admin.adminId,
        site_name: admin.tpqName || 'TAMAN PENDIDIKAN ALQUR\'AN',
        site_description: `${admin.tpqName || 'TAMAN PENDIDIKAN ALQUR\'AN'} adalah Taman Pendidikan Al-Quran terpercaya`,
        logo_url: '',
        whatsapp: '6281234567890',
        whatsapp_message: 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
        phone: '(021) 123-4567',
        email: admin.email,
        address: 'Alamat TPQ belum diatur',
        hero_title: `Selamat Datang di ${admin.tpqName || 'TAMAN PENDIDIKAN ALQUR\'AN'}`,
        hero_subtitle: 'Tempat terbaik untuk belajar Al-Quran',
        about_title: `Tentang ${admin.tpqName || 'TAMAN PENDIDIKAN ALQUR\'AN'}`,
        about_description: 'TPQ terpercaya dengan metode pembelajaran yang berkualitas'
      };

      const insertResult = await pool.query(
        `INSERT INTO tpq_settings (
          admin_id, site_name, site_description, logo_url, whatsapp, whatsapp_message,
          phone, email, address, hero_title, hero_subtitle, about_title, about_description,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        RETURNING *`,
        [
          defaultSettings.admin_id, defaultSettings.site_name, defaultSettings.site_description,
          defaultSettings.logo_url, defaultSettings.whatsapp, defaultSettings.whatsapp_message, defaultSettings.phone,
          defaultSettings.email, defaultSettings.address, defaultSettings.hero_title,
          defaultSettings.hero_subtitle, defaultSettings.about_title, defaultSettings.about_description
        ]
      );

      return NextResponse.json({ settings: insertResult.rows[0] });
    }

    return NextResponse.json({ settings: result.rows[0] });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}

// PUT - Update settings admin
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await request.json();

    // Update settings untuk admin ini saja
    const result = await pool.query(
      `UPDATE tpq_settings SET
        site_name = $1,
        site_description = $2,
        logo_url = $3,
        whatsapp = $4,
        whatsapp_message = $5,
        phone = $6,
        email = $7,
        address = $8,
        facebook_url = $9,
        instagram_url = $10,
        youtube_url = $11,
        weekdays_hours = $12,
        saturday_hours = $13,
        sunday_hours = $14,
        hero_title = $15,
        hero_subtitle = $16,
        about_title = $17,
        about_description = $18,
        primary_color = $19,
        secondary_color = $20,
        updated_at = NOW()
      WHERE admin_id = $21
      RETURNING *`,
      [
        settings.site_name || admin.tpqName,
        settings.site_description || '',
        settings.logo || '',
        settings.whatsapp || '',
        settings.whatsapp_message || '',
        settings.phone || '',
        settings.email || admin.email,
        settings.address || '',
        settings.facebook_url || '',
        settings.instagram_url || '',
        settings.youtube_url || '',
        settings.weekdays_hours || 'Senin - Jumat: 15:00 - 17:00',
        settings.saturday_hours || 'Sabtu: 08:00 - 10:00',
        settings.sunday_hours || 'Minggu: Libur',
        settings.hero_title || 'Selamat Datang di Taman Pendidikan Alquran',
        settings.hero_subtitle || 'Tempat terbaik untuk belajar Al-Quran',
        settings.about_title || 'Tentang Taman Pendidikan Alquran',
        settings.about_description || '',
        settings.primary_color || '#10b981',
        settings.secondary_color || '#3b82f6',
        admin.adminId
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Settings tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings berhasil diupdate',
      settings: result.rows[0] 
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate pengaturan' }, { status: 500 });
  }
}

// POST - Update settings admin (sama dengan PUT untuk kompatibilitas)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const settings = await request.json();

    // Cek apakah record sudah ada
    const existingResult = await pool.query(
      'SELECT id FROM tpq_settings WHERE admin_id = $1',
      [admin.adminId]
    );

    let result;
    
    if (existingResult.rows.length === 0) {
      // Insert new record
      result = await pool.query(
        `INSERT INTO tpq_settings (
          admin_id, site_name, site_description, logo_url, whatsapp, whatsapp_message,
          phone, email, address, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING *`,
        [
          admin.adminId,
          settings.site_name || 'Taman Pendidikan Alquran',
          settings.site_description || '',
          settings.logo && settings.logo.length > 500 ? settings.logo.substring(0, 500) : settings.logo || '',
          settings.whatsapp || '',
          settings.whatsapp_message || 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
          settings.phone || '',
          settings.email || admin.email || '',
          settings.address || ''
        ]
      );
    } else {
      // Update existing record dengan SEMUA field yang dikirim
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      // Mapping field yang bisa diupdate
      const fieldMapping = {
        'site_name': settings.site_name,
        'site_description': settings.site_description,
        'logo_url': settings.logo ? settings.logo.substring(0, 500) : null,
        'whatsapp': settings.whatsapp,
        'whatsapp_message': settings.whatsapp_message,
        'phone': settings.phone,
        'email': settings.email,
        'address': settings.address,
        'facebook_url': settings.facebook_url,
        'instagram_url': settings.instagram_url,
        'youtube_url': settings.youtube_url,
        'hero_title': settings.hero_title || (settings.site_name ? `Selamat Datang di ${settings.site_name}` : null),
        'about_title': settings.about_title || (settings.site_name ? `Tentang ${settings.site_name}` : null),
        'hero_subtitle': settings.hero_subtitle,
        'about_description': settings.about_description
      };

      // Build dynamic update query
      Object.entries(fieldMapping).forEach(([field, value]) => {
        if (value !== undefined) {
          updateFields.push(`${field} = $${paramIndex}`);
          updateValues.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        return NextResponse.json({ error: 'Tidak ada data untuk diupdate' }, { status: 400 });
      }

      // Add updated_at and admin_id
      updateFields.push(`updated_at = NOW()`);
      updateValues.push(admin.adminId);

      const updateQuery = `
        UPDATE tpq_settings SET 
        ${updateFields.join(', ')}
        WHERE admin_id = $${paramIndex}
        RETURNING *
      `;

      result = await pool.query(updateQuery, updateValues);
    }

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gagal menyimpan settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings berhasil diupdate',
      settings: result.rows[0] 
    });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengupdate pengaturan: ' + error.message,
      success: false 
    }, { status: 500 });
  }
}