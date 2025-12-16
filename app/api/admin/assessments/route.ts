import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// GET - Fetch daily assessments
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
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    let query = `
      SELECT 
        da.id,
        da.student_id,
        da.class_id,
        da.assessment_date,
        da.subject,
        da.score,
        da.grade,
        da.notes,
        s.name as student_name,
        c.name as class_name
      FROM daily_assessments da
      JOIN students s ON da.student_id = s.id
      LEFT JOIN classes c ON da.class_id = c.id
      WHERE da.admin_id = $1
    `;
    
    const params: any[] = [adminId];
    let paramIndex = 2;

    if (classId) {
      query += ` AND da.class_id = $${paramIndex}`;
      params.push(classId);
      paramIndex++;
    }

    if (date) {
      query += ` AND da.assessment_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (studentId) {
      query += ` AND da.student_id = $${paramIndex}`;
      params.push(studentId);
      paramIndex++;
    }

    query += ` ORDER BY da.assessment_date DESC, s.name ASC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, assessments: result.rows });

  } catch (error) {
    console.error('Assessment fetch error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data penilaian' 
    }, { status: 500 });
  }
}

// POST - Create assessment
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

    const { student_id, class_id, assessment_date, subject, score, grade, notes } = await request.json();

    if (!student_id || !assessment_date || !subject) {
      return NextResponse.json({ 
        error: 'Student ID, tanggal, dan mata pelajaran wajib diisi' 
      }, { status: 400 });
    }

    // Calculate grade if score is provided but grade is not
    let finalGrade = grade;
    if (score && !grade) {
      if (score >= 90) finalGrade = 'A';
      else if (score >= 80) finalGrade = 'B';
      else if (score >= 70) finalGrade = 'C';
      else if (score >= 60) finalGrade = 'D';
      else finalGrade = 'E';
    }

    const result = await pool.query(`
      INSERT INTO daily_assessments (
        admin_id, student_id, class_id, assessment_date, subject, score, grade, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id, student_id, class_id, assessment_date, subject, score, grade, notes, created_at
    `, [adminId, student_id, class_id, assessment_date, subject, score || null, finalGrade || null, notes || null]);

    return NextResponse.json({ 
      success: true, 
      message: 'Penilaian berhasil disimpan',
      assessment: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Assessment creation error:', error);
    return NextResponse.json({ 
      error: 'Gagal menyimpan penilaian' 
    }, { status: 500 });
  }
}

// PUT - Update assessment
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

    const { assessmentId, subject, score, grade, notes } = await request.json();

    if (!assessmentId || !subject) {
      return NextResponse.json({ 
        error: 'ID penilaian dan mata pelajaran wajib diisi' 
      }, { status: 400 });
    }

    // Calculate grade if score is provided but grade is not
    let finalGrade = grade;
    if (score && !grade) {
      if (score >= 90) finalGrade = 'A';
      else if (score >= 80) finalGrade = 'B';
      else if (score >= 70) finalGrade = 'C';
      else if (score >= 60) finalGrade = 'D';
      else finalGrade = 'E';
    }

    const result = await pool.query(`
      UPDATE daily_assessments 
      SET 
        subject = $1,
        score = $2,
        grade = $3,
        notes = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND admin_id = $6
      RETURNING 
        id, student_id, class_id, assessment_date, subject, score, grade, notes, updated_at
    `, [subject, score, finalGrade, notes, assessmentId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Data penilaian tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Penilaian berhasil diperbarui',
      assessment: result.rows[0]
    });

  } catch (error) {
    console.error('Assessment update error:', error);
    return NextResponse.json({ 
      error: 'Gagal memperbarui penilaian' 
    }, { status: 500 });
  }
}

// DELETE - Delete assessment
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

    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json({ error: 'ID penilaian tidak valid' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM daily_assessments 
      WHERE id = $1 AND admin_id = $2
      RETURNING id
    `, [assessmentId, adminId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Data penilaian tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data penilaian berhasil dihapus'
    });

  } catch (error) {
    console.error('Assessment deletion error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus data penilaian' 
    }, { status: 500 });
  }
}
