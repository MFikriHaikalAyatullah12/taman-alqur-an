import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Get students statistics untuk admin yang login
    const studentsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students
      FROM students 
      WHERE admin_id = $1
    `, [adminId]);

    // Get teachers statistics untuk admin yang login
    const teachersResult = await pool.query(`
      SELECT 
        COUNT(*) as total_teachers,
        AVG(experience_years) as avg_experience
      FROM teachers 
      WHERE admin_id = $1
    `, [adminId]);

    // Get finances statistics untuk admin yang login
    const financesResult = await pool.query(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as total_transactions
      FROM finances 
      WHERE admin_id = $1
        AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [adminId]);

    const students = studentsResult.rows[0] || { total_students: 0, active_students: 0 };
    const teachers = teachersResult.rows[0] || { total_teachers: 0, avg_experience: 0 };
    const finances = financesResult.rows[0] || { total_income: 0, total_expense: 0, total_transactions: 0 };

    const balance = parseFloat(finances.total_income || 0) - parseFloat(finances.total_expense || 0);

    const dashboard = {
      students: {
        total: parseInt(students.total_students),
        active: parseInt(students.active_students)
      },
      teachers: {
        total: parseInt(teachers.total_teachers),
        avgExperience: Math.round(parseFloat(teachers.avg_experience || 0))
      },
      finances: {
        income: parseFloat(finances.total_income || 0),
        expense: parseFloat(finances.total_expense || 0),
        balance: balance,
        transactions: parseInt(finances.total_transactions)
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      data: dashboard
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data dashboard' 
    }, { status: 500 });
  }
}