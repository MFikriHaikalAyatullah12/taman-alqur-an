'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Teacher {
  id: number;
  name: string;
  specialization: string;
}

interface TeacherAttendance {
  id?: number;
  teacher_id: number;
  status: string;
  clock_in: string;
  clock_out: string;
  notes: string;
}

export default function TeacherAttendancePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: TeacherAttendance }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'daily' | 'monthly'>('daily');
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<any[]>([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (activeView === 'daily') {
      fetchDailyAttendance();
    } else {
      fetchMonthlyAttendance();
    }
  }, [selectedDate, selectedMonth, activeView]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/teacher-attendance?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const attendanceMap: { [key: number]: TeacherAttendance } = {};
        data.attendance.forEach((att: any) => {
          attendanceMap[att.teacher_id] = {
            id: att.id,
            teacher_id: att.teacher_id,
            status: att.status,
            clock_in: att.clock_in || '',
            clock_out: att.clock_out || '',
            notes: att.notes || ''
          };
        });
        setAttendanceData(attendanceMap);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/teacher-attendance?month=${selectedMonth}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMonthlyData(data.attendance || []);
        
        // Calculate summary per teacher
        const summary: any = {};
        data.attendance.forEach((att: any) => {
          if (!summary[att.teacher_id]) {
            summary[att.teacher_id] = {
              teacher_id: att.teacher_id,
              teacher_name: att.teacher_name,
              hadir: 0,
              alfa: 0,
              sakit: 0,
              izin: 0,
              total: 0
            };
          }
          summary[att.teacher_id].total++;
          if (att.status === 'hadir' || att.status === 'present') summary[att.teacher_id].hadir++;
          else if (att.status === 'alfa' || att.status === 'absent') summary[att.teacher_id].alfa++;
          else if (att.status === 'sakit' || att.status === 'sick') summary[att.teacher_id].sakit++;
          else if (att.status === 'izin' || att.status === 'permission') summary[att.teacher_id].izin++;
        });
        
        setMonthlySummary(Object.values(summary));
      }
    } catch (error) {
      console.error('Error fetching monthly attendance:', error);
    }
  };

  const handleAttendanceChange = (teacherId: number, field: keyof TeacherAttendance, value: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        teacher_id: teacherId,
        [field]: value
      }
    }));
  };

  const saveAttendance = async (teacherId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const attendance = attendanceData[teacherId] || {
        teacher_id: teacherId,
        status: 'hadir',
        clock_in: '',
        clock_out: '',
        notes: ''
      };

      const response = await fetch('/api/admin/teacher-attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          attendance_date: selectedDate,
          status: attendance.status,
          clock_in: attendance.clock_in || null,
          clock_out: attendance.clock_out || null,
          notes: attendance.notes
        }),
      });

      if (response.ok) {
        alert('Absensi berhasil disimpan');
        fetchDailyAttendance();
      } else {
        alert('Gagal menyimpan absensi');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Terjadi kesalahan');
    }
  };

  const saveAllAttendance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const promises = teachers.map(teacher => {
        const attendance = attendanceData[teacher.id] || {
          teacher_id: teacher.id,
          status: 'hadir',
          clock_in: '',
          clock_out: '',
          notes: ''
        };
        return fetch('/api/admin/teacher-attendance', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teacher_id: teacher.id,
            attendance_date: selectedDate,
            status: attendance.status,
            clock_in: attendance.clock_in || null,
            clock_out: attendance.clock_out || null,
            notes: attendance.notes
          }),
        });
      });

      await Promise.all(promises);
      alert('Semua absensi berhasil disimpan');
      fetchDailyAttendance();
    } catch (error) {
      console.error('Error saving all attendance:', error);
      alert('Terjadi kesalahan');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/teachers">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/teachers">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Absensi Pengajar</h1>
          <p className="text-gray-600">Kelola absensi dan kehadiran pengajar</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* View Toggle */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveView('daily')}
              className={`px-6 py-3 font-medium ${
                activeView === 'daily'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Absensi Harian
            </button>
            <button
              onClick={() => setActiveView('monthly')}
              className={`px-6 py-3 font-medium ${
                activeView === 'monthly'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rekap Bulanan
            </button>
          </div>

          <div className="p-6">
            {activeView === 'daily' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Pilih Tanggal:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <button
                    onClick={saveAllAttendance}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    💾 Simpan Semua
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Pengajar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Jabatan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Jam Masuk</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Jam Keluar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Catatan</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {teachers.map((teacher, index) => (
                        <tr key={teacher.id}>
                          <td className="px-4 py-3 text-sm text-black">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-black">{teacher.name}</td>
                          <td className="px-4 py-3 text-sm text-black">{teacher.specialization || '-'}</td>
                          <td className="px-4 py-3">
                            <select
                              value={attendanceData[teacher.id]?.status || 'hadir'}
                              onChange={(e) => handleAttendanceChange(teacher.id, 'status', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm"
                            >
                              <option value="hadir">Hadir</option>
                              <option value="alfa">Alfa</option>
                              <option value="sakit">Sakit</option>
                              <option value="izin">Izin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="time"
                              value={attendanceData[teacher.id]?.clock_in || ''}
                              onChange={(e) => handleAttendanceChange(teacher.id, 'clock_in', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="time"
                              value={attendanceData[teacher.id]?.clock_out || ''}
                              onChange={(e) => handleAttendanceChange(teacher.id, 'clock_out', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={attendanceData[teacher.id]?.notes || ''}
                              onChange={(e) => handleAttendanceChange(teacher.id, 'notes', e.target.value)}
                              placeholder="Catatan..."
                              className="px-2 py-1 border border-gray-300 rounded text-black text-sm w-full"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => saveAttendance(teacher.id)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Simpan
                            </button>
                          </td>
                        </tr>
                      ))}
                      {teachers.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            Belum ada data pengajar. Silakan tambahkan pengajar terlebih dahulu di menu Data Pengajar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Pilih Bulan:</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-black"
                  />
                </div>

                {/* Ringkasan Bulanan */}
                {monthlySummary.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-3">📊 Ringkasan Kehadiran Bulan Ini</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Pengajar</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">Hadir</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">Alfa</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">Sakit</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">Izin</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">Total Hari</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthlySummary.map((summary, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm font-medium text-black">{summary.teacher_name}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                  {summary.hadir}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                  {summary.alfa}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                  {summary.sakit}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                  {summary.izin}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-black">{summary.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Detail Absensi */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3">📋 Detail Absensi Harian</h3>
                  <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Tanggal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Nama Pengajar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Jam Masuk</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Jam Keluar</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {monthlyData.map((attendance, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-black">
                            {new Date(attendance.attendance_date).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-black">{attendance.teacher_name}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              attendance.status === 'hadir' ? 'bg-green-100 text-green-800' :
                              attendance.status === 'sakit' ? 'bg-yellow-100 text-yellow-800' :
                              attendance.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {attendance.status === 'hadir' ? 'Hadir' :
                               attendance.status === 'sakit' ? 'Sakit' :
                               attendance.status === 'izin' ? 'Izin' : 'Alfa'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-black">{attendance.clock_in || '-'}</td>
                          <td className="px-4 py-3 text-sm text-black">{attendance.clock_out || '-'}</td>
                          <td className="px-4 py-3 text-sm text-black">{attendance.notes || '-'}</td>
                        </tr>
                      ))}
                      {monthlyData.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Belum ada data absensi untuk bulan ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
