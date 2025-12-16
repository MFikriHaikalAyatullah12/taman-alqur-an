import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch all classes for logged-in admin
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

    // Get classes for the logged-in admin
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name, 
        c.teacher_in_charge,
        c.description,
        c.is_active,
        c.created_at,
        c.updated_at,
        COUNT(s.id) as student_count
      FROM classes c
      LEFT JOIN students s ON c.id = s.class_id AND s.status = 'active'
      WHERE c.admin_id = $1
      GROUP BY c.id
      ORDER BY c.name ASC
    `, [adminId]);

    return NextResponse.json({ success: true, classes: result.rows });

  } catch (error) {
    console.error('Classes fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data kelas' 
    }, { status: 500 });
  }
}

// POST - Create a new class
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

    const { name, teacher_in_charge, description } = await request.json();

    if (!name) {
      return NextResponse.json({ 
        error: 'Nama kelas wajib diisi' 
      }, { status: 400 });
    }

    // Check if class name already exists for this admin
    const checkExisting = await pool.query(
      'SELECT id FROM classes WHERE admin_id = $1 AND LOWER(name) = LOWER($2)',
      [adminId, name]
    );

    if (checkExisting.rows.length > 0) {
      return NextResponse.json({ 
        error: 'Nama kelas sudah digunakan' 
      }, { status: 400 });
    }

    // Insert new class
    const result = await pool.query(`
      INSERT INTO classes (
        admin_id, name, teacher_in_charge, description, is_active
      )
      VALUES ($1, $2, $3, $4, true)
      RETURNING 
        id, 
        name,
        teacher_in_charge,
        description,
        is_active,
        created_at,
        updated_at
    `, [adminId, name, teacher_in_charge || null, description || null]);

    return NextResponse.json({ 
      success: true, 
      message: 'Kelas berhasil ditambahkan',
      class: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Class creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menambahkan kelas' 
    }, { status: 500 });
  }
}

// PUT - Update a class
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

    const { classId, name, teacher_in_charge, description, is_active } = await request.json();

    if (!classId || !name) {
      return NextResponse.json({ 
        error: 'ID kelas dan nama kelas wajib diisi' 
      }, { status: 400 });
    }

    // Update class only if it belongs to the logged-in admin
    const result = await pool.query(`
      UPDATE classes 
      SET 
        name = $1,
        teacher_in_charge = $2,
        description = $3,
        is_active = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND admin_id = $6
      RETURNING 
        id, 
        name,
        teacher_in_charge,
        description,
        is_active,
        updated_at
    `, [name, teacher_in_charge, description, is_active, classId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Kelas berhasil diperbarui',
      class: result.rows[0]
    });

  } catch (error) {
    console.error('Class update error:', error);
    return NextResponse.json({ 
      error: 'Gagal memperbarui kelas' 
    }, { status: 500 });
  }
}

// DELETE - Delete a class
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

    const { classId } = await request.json();

    if (!classId) {
      return NextResponse.json({ error: 'ID kelas tidak valid' }, { status: 400 });
    }

    // Check if there are students in this class
    const studentCheck = await pool.query(
      'SELECT COUNT(*) as count FROM students WHERE class_id = $1 AND admin_id = $2',
      [classId, adminId]
    );

    if (parseInt(studentCheck.rows[0].count) > 0) {
      return NextResponse.json({ 
        error: 'Tidak dapat menghapus kelas yang masih memiliki santri. Pindahkan atau hapus santri terlebih dahulu.' 
      }, { status: 400 });
    }

    // Delete class only if it belongs to the logged-in admin
    const result = await pool.query(`
      DELETE FROM classes 
      WHERE id = $1 AND admin_id = $2
      RETURNING name
    `, [classId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Kelas ${result.rows[0].name} berhasil dihapus`
    });

  } catch (error) {
    console.error('Class deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus kelas' 
    }, { status: 500 });
  }
}
