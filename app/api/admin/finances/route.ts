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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'income' or 'expense' or 'all'
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    let query = `
      SELECT 
        id, 
        type, 
        category,
        amount,
        description,
        date,
        payment_method,
        reference_number,
        created_at
      FROM finances 
      WHERE admin_id = $1
    `;
    
    const params: any[] = [adminId];
    
    if (type && type !== 'all') {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    
    if (month && year) {
      params.push(year);
      params.push(month);
      query += ` AND EXTRACT(YEAR FROM date) = $${params.length - 1} AND EXTRACT(MONTH FROM date) = $${params.length}`;
    }
    
    query += ` ORDER BY date DESC, created_at DESC`;
    
    const result = await pool.query(query, params);

    // Get summary
    let summaryQuery = `
      SELECT 
        type,
        SUM(amount) as total
      FROM finances 
      WHERE admin_id = $1
    `;
    
    let summaryParams = [adminId];
    
    if (month && year) {
      summaryParams.push(year, month);
      summaryQuery += ` AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3`;
    }
    
    summaryQuery += ` GROUP BY type`;
    
    const summaryResult = await pool.query(summaryQuery, summaryParams);
    
    const summary = summaryResult.rows.reduce((acc: any, row: any) => {
      acc[row.type] = parseFloat(row.total);
      return acc;
    }, { income: 0, expense: 0 });
    
    summary.balance = summary.income - summary.expense;

    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      summary 
    });

  } catch (error) {
    console.error('Finances fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data keuangan' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { 
      type, category, amount, description, date,
      payment_method, reference_number 
    } = await request.json();

    if (!type || !category || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Tipe, kategori, dan jumlah wajib diisi' 
      }, { status: 400 });
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json({ 
        error: 'Tipe harus income atau expense' 
      }, { status: 400 });
    }

    const transactionDate = date || new Date().toISOString().split('T')[0];

    const result = await pool.query(`
      INSERT INTO finances (
        admin_id, type, category, amount, description, 
        date, payment_method, reference_number
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING 
        id, type, category, amount, description, 
        date, payment_method, reference_number, created_at
    `, [
      adminId, type, category, parseFloat(amount), description || '',
      transactionDate,
      payment_method || 'cash', reference_number || ''
    ]);

    return NextResponse.json({ 
      success: true, 
      message: `${type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan`,
      data: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Finance creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan data keuangan' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const { 
      id, type, category, amount, description, date,
      payment_method, reference_number 
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    if (!type || !category || !amount || amount <= 0) {
      return NextResponse.json({ 
        error: 'Tipe, kategori, dan jumlah wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(`
      UPDATE finances SET
        type = $1,
        category = $2,
        amount = $3,
        description = $4,
        date = $5,
        payment_method = $6,
        reference_number = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND admin_id = $9
      RETURNING 
        id, type, category, amount, description, 
        date, payment_method, reference_number, created_at
    `, [
      type, category, parseFloat(amount), description || '',
      date, payment_method || 'cash', reference_number || '', id, adminId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Data keuangan tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data keuangan berhasil diperbarui',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Finance update error:', error);
    return NextResponse.json({ 
      error: 'Gagal memperbarui data keuangan' 
    }, { status: 500 });
  }
}

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

    const { searchParams } = new URL(request.url);
    const financeId = searchParams.get('id');

    if (!financeId) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM finances 
      WHERE id = $1 AND admin_id = $2
      RETURNING *
    `, [financeId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Data keuangan tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data keuangan berhasil dihapus'
    });

  } catch (error) {
    console.error('Finance deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data keuangan' 
    }, { status: 500 });
  }
}