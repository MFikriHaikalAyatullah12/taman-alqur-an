import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/lib/db');

export async function GET(request: NextRequest) {
  try {
    // Ambil data terbaru dari settings
    const query = `
      SELECT 
        s.site_name,
        s.site_description,
        s.address,
        s.phone,
        s.email,
        s.whatsapp,
        s.whatsapp_message,
        s.facebook_url,
        s.instagram_url,
        s.youtube_url,
        s.hero_title,
        s.hero_subtitle,
        s.about_title,
        s.about_description
      FROM tpq_settings s
      ORDER BY s.updated_at DESC 
      LIMIT 1
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      // Return default settings jika tidak ada data
      return NextResponse.json({
        site_name: 'TPQ Al-Hikmah',
        site_description: '',
        address: 'Alamat TPQ belum diatur',
        phone: '(021) 123-4567',
        email: 'info@tpq.com',
        whatsapp: '6281234567890',
        whatsapp_message: 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
        facebook_url: '',
        instagram_url: '',
        youtube_url: '',
        hero_title: 'Selamat Datang di TPQ Al-Hikmah',
        hero_subtitle: 'Tempat terbaik untuk belajar Al-Quran',
        about_title: 'Tentang TPQ Al-Hikmah',
        about_description: ''
      });
    }

    const settings = result.rows[0];
    
    return NextResponse.json({
      site_name: settings.site_name,
      site_description: settings.site_description || '',
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      whatsapp: settings.whatsapp,
      whatsapp_message: settings.whatsapp_message,
      facebook_url: settings.facebook_url || '',
      instagram_url: settings.instagram_url || '',
      youtube_url: settings.youtube_url || '',
      hero_title: settings.hero_title || `Selamat Datang di ${settings.site_name}`,
      hero_subtitle: settings.hero_subtitle || 'Tempat terbaik untuk belajar Al-Quran',
      about_title: settings.about_title || `Tentang ${settings.site_name}`,
      about_description: settings.about_description || ''
    });

  } catch (error) {
    console.error('Public settings fetch error:', error);
    return NextResponse.json({
      site_name: 'TPQ Al-Hikmah',
      site_description: '',
      address: 'Alamat TPQ belum diatur',
      phone: '(021) 123-4567',
      email: 'info@tpq.com',
      whatsapp: '6281234567890',
      whatsapp_message: 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
      facebook_url: '',
      instagram_url: '',
      youtube_url: '',
      hero_title: 'Selamat Datang di TPQ Al-Hikmah',
      hero_subtitle: 'Tempat terbaik untuk belajar Al-Quran',
      about_title: 'Tentang TPQ Al-Hikmah',
      about_description: ''
    });
  }
}