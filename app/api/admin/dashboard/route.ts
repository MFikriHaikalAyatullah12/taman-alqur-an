import { NextRequest, NextResponse } from 'next/server';
const pool = require('@/lib/db');

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
    }

    // Pastikan ada admin di database
    const adminCheck = await pool.query('SELECT id FROM admins LIMIT 1');
    if (adminCheck.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Admin tidak ditemukan. Silakan login ulang.' 
      }, { status: 400 });
    }
    
    const adminId = adminCheck.rows[0].id;

    // Get students statistics
    const studentsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_students
      FROM students 
      WHERE admin_id = $1
    `, [adminId]);

    // Get teachers statistics
    const teachersResult = await pool.query(`
      SELECT 
        COUNT(*) as total_teachers,
        AVG(experience_years) as avg_experience
      FROM teachers 
      WHERE admin_id = $1
    `, [adminId]);

    // Get finances statistics
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