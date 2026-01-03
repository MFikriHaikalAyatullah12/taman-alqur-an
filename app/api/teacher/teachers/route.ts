import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// GET - Fetch all teachers for teacher portal
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      // Verify token is valid (teacher role)
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (decoded.role !== 'teacher') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch all teachers (teacher portal can see all teachers' performance)
    const result = await pool.query(`
      SELECT 
        id, name, email, phone, specialization, 
        experience_years, education, status, 
        photo_url, bio, created_at, admin_id
      FROM teachers 
      ORDER BY name ASC
    `);

    return NextResponse.json({ 
      success: true, 
      teachers: result.rows 
    });

  } catch (error) {
    console.error('Teacher portal fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data pengajar' 
    }, { status: 500 });
  }
}
