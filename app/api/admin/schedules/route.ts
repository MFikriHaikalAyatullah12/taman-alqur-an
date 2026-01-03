import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch schedules
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
    const month = searchParams.get('month'); // Format: YYYY-MM

    let query = `
      SELECT * FROM schedules 
      WHERE admin_id = $1
    `;
    
    const params: any[] = [adminId];

    if (month) {
      query += ` AND TO_CHAR(start_date, 'YYYY-MM') = $2`;
      params.push(month);
    }

    query += ` ORDER BY start_date ASC, start_time ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, schedules: result.rows });

  } catch (error) {
    console.error('Schedules fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data jadwal' 
    }, { status: 500 });
  }
}

// POST - Create schedule
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
      title, 
      description, 
      activity_type,
      start_date, 
      end_date,
      start_time,
      end_time,
      location,
      teacher_in_charge,
      participants,
      notes,
      is_recurring,
      recurrence_pattern
    } = await request.json();

    if (!title || !start_date) {
      return NextResponse.json({ 
        error: 'Title dan start_date wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(`
      INSERT INTO schedules 
      (admin_id, title, description, activity_type, start_date, end_date, 
       start_time, end_time, location, teacher_in_charge, participants, notes,
       is_recurring, recurrence_pattern)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      adminId, title, description, activity_type, start_date, end_date,
      start_time, end_time, location, teacher_in_charge, participants, notes,
      is_recurring, recurrence_pattern
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Jadwal berhasil ditambahkan',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Schedule creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan jadwal' 
    }, { status: 500 });
  }
}

// PUT - Update schedule
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
      id,
      title, 
      description, 
      activity_type,
      start_date, 
      end_date,
      start_time,
      end_time,
      location,
      teacher_in_charge,
      participants,
      notes,
      is_recurring,
      recurrence_pattern
    } = await request.json();

    if (!id || !title || !start_date) {
      return NextResponse.json({ 
        error: 'ID, title, dan start_date wajib diisi' 
      }, { status: 400 });
    }

    const result = await pool.query(`
      UPDATE schedules 
      SET title = $1, description = $2, activity_type = $3, start_date = $4, 
          end_date = $5, start_time = $6, end_time = $7, location = $8,
          teacher_in_charge = $9, participants = $10, notes = $11,
          is_recurring = $12, recurrence_pattern = $13, updated_at = NOW()
      WHERE id = $14 AND admin_id = $15
      RETURNING *
    `, [
      title, description, activity_type, start_date, end_date,
      start_time, end_time, location, teacher_in_charge, participants, notes,
      is_recurring, recurrence_pattern, id, adminId
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Jadwal berhasil diupdate',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Schedule update error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengupdate jadwal' 
    }, { status: 500 });
  }
}

// DELETE - Remove schedule
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

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM schedules 
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `, [id, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Jadwal berhasil dihapus'
    });

  } catch (error) {
    console.error('Schedule deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus jadwal' 
    }, { status: 500 });
  }
}
