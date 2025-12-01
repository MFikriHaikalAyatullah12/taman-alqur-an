import { NextRequest, NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const pool = require('@/lib/db');

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Get user details from database
    const result = await pool.query(
      'SELECT id, email, username, role, full_name, phone FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json(user);

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Token tidak valid' },
      { status: 401 }
    );
  }
}