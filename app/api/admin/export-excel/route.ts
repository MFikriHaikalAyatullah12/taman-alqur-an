import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

// GET - Export reports to Excel
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

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TPQ Admin Panel';
    workbook.created = new Date();

    // 1. Sheet: Struktur Organisasi
    const orgSheet = workbook.addWorksheet('Struktur Organisasi');
    const orgResult = await pool.query(`
      SELECT name, position, education, experience, phone, email
      FROM teachers 
      WHERE admin_id = $1 AND is_active = true
      ORDER BY position
    `, [adminId]);

    orgSheet.columns = [
      { header: 'Nama', key: 'name', width: 25 },
      { header: 'Jabatan', key: 'position', width: 20 },
      { header: 'Pendidikan', key: 'education', width: 20 },
      { header: 'Pengalaman', key: 'experience', width: 15 },
      { header: 'Telepon', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
    ];
    orgSheet.addRows(orgResult.rows);
    orgSheet.getRow(1).font = { bold: true };
    orgSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // 2. Sheet: Data Santri per Kelas
    const classesResult = await pool.query(`
      SELECT id, name FROM classes WHERE admin_id = $1 ORDER BY name
    `, [adminId]);

    for (const classData of classesResult.rows) {
      const studentsSheet = workbook.addWorksheet(`Santri - ${classData.name}`);
      const studentsResult = await pool.query(`
        SELECT s.name, s.birth_date, s.parent_name, s.parent_phone, s.status
        FROM students s
        WHERE s.admin_id = $1 AND s.class_id = $2
        ORDER BY s.name
      `, [adminId, classData.id]);

      studentsSheet.columns = [
        { header: 'Nama Santri', key: 'name', width: 25 },
        { header: 'Tanggal Lahir', key: 'birth_date', width: 15 },
        { header: 'Nama Orang Tua', key: 'parent_name', width: 25 },
        { header: 'No. Telp', key: 'parent_phone', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
      ];
      studentsSheet.addRows(studentsResult.rows);
      studentsSheet.getRow(1).font = { bold: true };
      studentsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
    }

    // 3. Sheet: Absen Santri per Kelas
    for (const classData of classesResult.rows) {
      const attendanceSheet = workbook.addWorksheet(`Absen - ${classData.name}`);
      const attendanceResult = await pool.query(`
        SELECT 
          s.name as student_name,
          sa.attendance_date,
          sa.status,
          sa.notes
        FROM student_attendance sa
        JOIN students s ON sa.student_id = s.id
        WHERE sa.admin_id = $1 AND sa.class_id = $2
        ORDER BY sa.attendance_date DESC, s.name
      `, [adminId, classData.id]);

      attendanceSheet.columns = [
        { header: 'Nama Santri', key: 'student_name', width: 25 },
        { header: 'Tanggal', key: 'attendance_date', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Catatan', key: 'notes', width: 30 },
      ];
      attendanceSheet.addRows(attendanceResult.rows);
      attendanceSheet.getRow(1).font = { bold: true };
      attendanceSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
    }

    // 4. Sheet: Absen Pengajar
    const teacherAttSheet = workbook.addWorksheet('Absen Pengajar');
    const teacherAttResult = await pool.query(`
      SELECT 
        t.name as teacher_name,
        ta.attendance_date,
        ta.status,
        ta.clock_in,
        ta.clock_out,
        ta.notes
      FROM teacher_attendance ta
      JOIN teachers t ON ta.teacher_id = t.id
      WHERE ta.admin_id = $1
      ORDER BY ta.attendance_date DESC, t.name
    `, [adminId]);

    teacherAttSheet.columns = [
      { header: 'Nama Pengajar', key: 'teacher_name', width: 25 },
      { header: 'Tanggal', key: 'attendance_date', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Jam Masuk', key: 'clock_in', width: 12 },
      { header: 'Jam Keluar', key: 'clock_out', width: 12 },
      { header: 'Catatan', key: 'notes', width: 30 },
    ];
    teacherAttSheet.addRows(teacherAttResult.rows);
    teacherAttSheet.getRow(1).font = { bold: true };
    teacherAttSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // 5. Sheet: Prestasi
    const achievementSheet = workbook.addWorksheet('Prestasi');
    const achievementResult = await pool.query(`
      SELECT title, description, date, category
      FROM tpq_achievements 
      WHERE admin_id = $1
      ORDER BY date DESC
    `, [adminId]);

    achievementSheet.columns = [
      { header: 'Judul', key: 'title', width: 30 },
      { header: 'Deskripsi', key: 'description', width: 50 },
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Kategori', key: 'category', width: 20 },
    ];
    achievementSheet.addRows(achievementResult.rows);
    achievementSheet.getRow(1).font = { bold: true };
    achievementSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // 6. Sheet: Keuangan
    const financeSheet = workbook.addWorksheet('Keuangan');
    const financeResult = await pool.query(`
      SELECT 
        transaction_date,
        type,
        category,
        amount,
        description,
        payment_method
      FROM finances 
      WHERE admin_id = $1
      ORDER BY transaction_date DESC
    `, [adminId]);

    financeSheet.columns = [
      { header: 'Tanggal', key: 'transaction_date', width: 15 },
      { header: 'Tipe', key: 'type', width: 12 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Keterangan', key: 'description', width: 40 },
      { header: 'Metode Bayar', key: 'payment_method', width: 15 },
    ];
    financeSheet.addRows(financeResult.rows);
    financeSheet.getRow(1).font = { bold: true };
    financeSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // 7. Sheet: Pemasukan
    const incomeSheet = workbook.addWorksheet('Pemasukan');
    const incomeResult = await pool.query(`
      SELECT 
        transaction_date,
        category,
        amount,
        description,
        payment_method
      FROM finances 
      WHERE admin_id = $1 AND type = 'income'
      ORDER BY transaction_date DESC
    `, [adminId]);

    incomeSheet.columns = [
      { header: 'Tanggal', key: 'transaction_date', width: 15 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Keterangan', key: 'description', width: 40 },
      { header: 'Metode Bayar', key: 'payment_method', width: 15 },
    ];
    incomeSheet.addRows(incomeResult.rows);
    incomeSheet.getRow(1).font = { bold: true };
    incomeSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // Calculate total income
    const totalIncome = incomeResult.rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
    incomeSheet.addRow({});
    const totalIncomeRow = incomeSheet.addRow({ category: 'TOTAL PEMASUKAN', amount: totalIncome });
    totalIncomeRow.font = { bold: true };

    // 8. Sheet: Pengeluaran
    const expenseSheet = workbook.addWorksheet('Pengeluaran');
    const expenseResult = await pool.query(`
      SELECT 
        transaction_date,
        category,
        amount,
        description,
        payment_method
      FROM finances 
      WHERE admin_id = $1 AND type = 'expense'
      ORDER BY transaction_date DESC
    `, [adminId]);

    expenseSheet.columns = [
      { header: 'Tanggal', key: 'transaction_date', width: 15 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'Jumlah', key: 'amount', width: 15 },
      { header: 'Keterangan', key: 'description', width: 40 },
      { header: 'Metode Bayar', key: 'payment_method', width: 15 },
    ];
    expenseSheet.addRows(expenseResult.rows);
    expenseSheet.getRow(1).font = { bold: true };
    expenseSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

    // Calculate total expense
    const totalExpense = expenseResult.rows.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0);
    expenseSheet.addRow({});
    const totalExpenseRow = expenseSheet.addRow({ category: 'TOTAL PENGELUARAN', amount: totalExpense });
    totalExpenseRow.font = { bold: true };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=Laporan_TPQ_${new Date().toISOString().split('T')[0]}.xlsx`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ 
      error: 'Gagal membuat laporan Excel' 
    }, { status: 500 });
  }
}
