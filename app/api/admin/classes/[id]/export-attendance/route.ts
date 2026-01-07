import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';

export const dynamic = 'force-dynamic';

// GET - Export class attendance recap to Excel
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const classId = params.id;
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM

    if (!month) {
      return NextResponse.json({ error: 'Parameter month diperlukan (format: YYYY-MM)' }, { status: 400 });
    }

    // Get class info
    const classResult = await pool.query(
      'SELECT id, name, teacher_in_charge FROM classes WHERE id = $1 AND admin_id = $2',
      [classId, adminId]
    );

    if (classResult.rows.length === 0) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    const classData = classResult.rows[0];

    // Get students in this class
    const studentsResult = await pool.query(
      'SELECT id, name FROM students WHERE class_id = $1 AND admin_id = $2 ORDER BY name',
      [classId, adminId]
    );

    const students = studentsResult.rows;

    // Get attendance data for the month
    const attendanceResult = await pool.query(`
      SELECT 
        a.student_id,
        a.attendance_date,
        a.status
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE s.class_id = $1 
        AND TO_CHAR(a.attendance_date, 'YYYY-MM') = $2
      ORDER BY a.attendance_date, s.name
    `, [classId, month]);

    // Create a map of attendance by student
    const attendanceByStudent: { [key: number]: { [date: string]: string } } = {};
    const uniqueDates: Set<string> = new Set();

    attendanceResult.rows.forEach((att: any) => {
      const studentId = att.student_id;
      const date = new Date(att.attendance_date).toISOString().split('T')[0];
      
      if (!attendanceByStudent[studentId]) {
        attendanceByStudent[studentId] = {};
      }
      attendanceByStudent[studentId][date] = att.status;
      uniqueDates.add(date);
    });

    const sortedDates = Array.from(uniqueDates).sort();

    // Calculate summary per student
    const studentSummary = students.map((student: any) => {
      const studentAttendance = attendanceByStudent[student.id] || {};
      
      let hadir = 0, izin = 0, sakit = 0, alfa = 0;
      
      Object.values(studentAttendance).forEach((status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'hadir' || statusLower === 'present') hadir++;
        else if (statusLower === 'izin' || statusLower === 'permission') izin++;
        else if (statusLower === 'sakit' || statusLower === 'sick') sakit++;
        else if (statusLower === 'alfa' || statusLower === 'alpha' || statusLower === 'absent') alfa++;
      });

      return {
        id: student.id,
        name: student.name,
        hadir,
        izin,
        sakit,
        alfa,
        total: hadir + izin + sakit + alfa,
        attendance: studentAttendance
      };
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TPQ Admin Panel';
    workbook.created = new Date();

    // Parse month for display
    const [year, monthNum] = month.split('-');
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthNames[parseInt(monthNum) - 1];

    // Sheet 1: Summary (Ringkasan)
    const summarySheet = workbook.addWorksheet('Ringkasan Kehadiran');
    
    // Title
    summarySheet.mergeCells('A1:G1');
    summarySheet.getCell('A1').value = `REKAP KEHADIRAN SANTRI`;
    summarySheet.getCell('A1').font = { bold: true, size: 16 };
    summarySheet.getCell('A1').alignment = { horizontal: 'center' };

    summarySheet.mergeCells('A2:G2');
    summarySheet.getCell('A2').value = `Kelas: ${classData.name} | Penanggung Jawab: ${classData.teacher_in_charge || '-'}`;
    summarySheet.getCell('A2').alignment = { horizontal: 'center' };

    summarySheet.mergeCells('A3:G3');
    summarySheet.getCell('A3').value = `Periode: ${monthName} ${year}`;
    summarySheet.getCell('A3').alignment = { horizontal: 'center' };

    // Empty row
    summarySheet.addRow([]);

    // Headers
    const headerRow = summarySheet.addRow(['No', 'Nama Santri', 'Hadir', 'Izin', 'Sakit', 'Alfa', 'Total Hari']);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data rows
    studentSummary.forEach((student, index) => {
      const row = summarySheet.addRow([
        index + 1,
        student.name,
        student.hadir,
        student.izin,
        student.sakit,
        student.alfa,
        student.total
      ]);
      
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (colNumber >= 3) {
          cell.alignment = { horizontal: 'center' };
        }
      });

      // Color code based on attendance
      const hadirCell = row.getCell(3);
      const alfaCell = row.getCell(6);
      
      if (student.hadir > 0) {
        hadirCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
      }
      if (student.alfa > 0) {
        alfaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
      }
    });

    // Total row
    const totalRow = summarySheet.addRow([
      '',
      'TOTAL',
      studentSummary.reduce((sum, s) => sum + s.hadir, 0),
      studentSummary.reduce((sum, s) => sum + s.izin, 0),
      studentSummary.reduce((sum, s) => sum + s.sakit, 0),
      studentSummary.reduce((sum, s) => sum + s.alfa, 0),
      studentSummary.reduce((sum, s) => sum + s.total, 0)
    ]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Set column widths
    summarySheet.getColumn(1).width = 5;
    summarySheet.getColumn(2).width = 30;
    summarySheet.getColumn(3).width = 10;
    summarySheet.getColumn(4).width = 10;
    summarySheet.getColumn(5).width = 10;
    summarySheet.getColumn(6).width = 10;
    summarySheet.getColumn(7).width = 12;

    // Sheet 2: Daily Detail (Detail Harian)
    if (sortedDates.length > 0) {
      const detailSheet = workbook.addWorksheet('Detail Harian');

      // Title
      detailSheet.mergeCells('A1:' + String.fromCharCode(65 + sortedDates.length) + '1');
      detailSheet.getCell('A1').value = `DETAIL KEHADIRAN HARIAN - ${classData.name}`;
      detailSheet.getCell('A1').font = { bold: true, size: 14 };
      detailSheet.getCell('A1').alignment = { horizontal: 'center' };

      detailSheet.mergeCells('A2:' + String.fromCharCode(65 + sortedDates.length) + '2');
      detailSheet.getCell('A2').value = `Periode: ${monthName} ${year}`;
      detailSheet.getCell('A2').alignment = { horizontal: 'center' };

      detailSheet.addRow([]);

      // Headers: No, Nama, then dates
      const dateHeaders = ['No', 'Nama Santri', ...sortedDates.map(d => {
        const date = new Date(d);
        return date.getDate().toString();
      })];
      const detailHeaderRow = detailSheet.addRow(dateHeaders);
      detailHeaderRow.font = { bold: true };
      detailHeaderRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2196F3' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Data rows
      studentSummary.forEach((student, index) => {
        const rowData = [
          index + 1,
          student.name,
          ...sortedDates.map(date => {
            const status = student.attendance[date];
            if (!status) return '-';
            const statusLower = status.toLowerCase();
            if (statusLower === 'hadir' || statusLower === 'present') return 'H';
            if (statusLower === 'izin' || statusLower === 'permission') return 'I';
            if (statusLower === 'sakit' || statusLower === 'sick') return 'S';
            if (statusLower === 'alfa' || statusLower === 'alpha' || statusLower === 'absent') return 'A';
            return status.charAt(0).toUpperCase();
          })
        ];
        
        const row = detailSheet.addRow(rowData);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          if (colNumber >= 3) {
            cell.alignment = { horizontal: 'center' };
            // Color code
            const value = cell.value?.toString();
            if (value === 'H') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8E6C9' } };
            } else if (value === 'A') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFCDD2' } };
            } else if (value === 'S') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
            } else if (value === 'I') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBBDEFB' } };
            }
          }
        });
      });

      // Legend
      detailSheet.addRow([]);
      detailSheet.addRow(['Keterangan:']);
      detailSheet.addRow(['H = Hadir', 'I = Izin', 'S = Sakit', 'A = Alfa']);

      // Set column widths
      detailSheet.getColumn(1).width = 5;
      detailSheet.getColumn(2).width = 25;
      for (let i = 3; i <= sortedDates.length + 2; i++) {
        detailSheet.getColumn(i).width = 5;
      }
    }

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return as downloadable file
    const fileName = `Rekap_Kehadiran_${classData.name.replace(/\s+/g, '_')}_${monthName}_${year}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Export attendance error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengexport data kehadiran' 
    }, { status: 500 });
  }
}
