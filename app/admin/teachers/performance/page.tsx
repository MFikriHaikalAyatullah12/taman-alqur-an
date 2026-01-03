'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Teacher {
  id: number;
  name: string;
  specialization: string;
}

interface PerformanceData {
  teacher_id: number;
  teacher_name: string;
  month: string;
  hadir: number;
  izin: number;
  alfa: number;
  materi_count: number;
  total_days: number;
  category: 'Sempurna' | 'Baik' | 'Cukup' | 'Kurang';
}

const COLORS = {
  hadir: '#10b981', // green
  izin: '#f59e0b', // amber
  alfa: '#ef4444', // red
  materi: '#3b82f6' // blue
};

export default function TeacherPerformancePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
    
    // Check if there's a teacher ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = urlParams.get('id');
    if (teacherId) {
      setSelectedTeacher(parseInt(teacherId));
    }
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchPerformanceData();
    }
  }, [selectedTeacher, selectedMonth]);

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
        const teacherList = data.teachers || [];
        setTeachers(teacherList);
        if (teacherList.length > 0) {
          setSelectedTeacher(teacherList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    if (!selectedTeacher) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `/api/admin/teacher-attendance/performance?teacher_id=${selectedTeacher}&month=${selectedMonth}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPerformanceData(data.performance);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAttendanceChartData = () => {
    if (!performanceData) return [];
    
    const hadir = performanceData.hadir || 0;
    const izin = performanceData.izin || 0;
    const alfa = performanceData.alfa || 0;
    
    // Only include items with value > 0
    const data = [];
    if (hadir > 0) data.push({ name: 'Hadir', value: hadir, color: COLORS.hadir });
    if (izin > 0) data.push({ name: 'Izin', value: izin, color: COLORS.izin });
    if (alfa > 0) data.push({ name: 'Alfa', value: alfa, color: COLORS.alfa });
    
    return data;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sempurna':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Baik':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cukup':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Kurang':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sempurna':
        return '🌟';
      case 'Baik':
        return '👍';
      case 'Cukup':
        return '👌';
      case 'Kurang':
        return '📉';
      default:
        return '📊';
    }
  };

  const attendancePercentage = performanceData && performanceData.total_days > 0
    ? ((performanceData.hadir / performanceData.total_days) * 100).toFixed(1)
    : '0';

  return (
    <AdminLayout currentPage="/admin/teachers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Performa Pengajar</h1>
            <p className="text-gray-600">Evaluasi kinerja pengajar bulanan</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            ← Kembali
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pengajar</label>
              <select
                value={selectedTeacher || ''}
                onChange={(e) => setSelectedTeacher(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : performanceData ? (
          <>
            {/* Kategori Performa */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-center">
                <div className={`px-8 py-4 rounded-xl border-2 ${getCategoryColor(performanceData.category)}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getCategoryIcon(performanceData.category)}</div>
                    <h3 className="text-2xl font-bold mb-1">Kategori: {performanceData.category}</h3>
                    <p className="text-sm opacity-75">Evaluasi Performa Bulanan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hadir</p>
                    <p className="text-2xl font-bold text-green-600">{performanceData.hadir || 0} hari</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Izin</p>
                    <p className="text-2xl font-bold text-amber-600">{performanceData.izin || 0} hari</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Alfa</p>
                    <p className="text-2xl font-bold text-red-600">{performanceData.alfa || 0} hari</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Materi</p>
                    <p className="text-2xl font-bold text-blue-600">{performanceData.materi_count || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attendance Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Grafik Kehadiran</h3>
                {getAttendanceChartData().length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getAttendanceChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getAttendanceChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">Persentase Kehadiran</p>
                      <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
                    </div>
                  </>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <p className="text-4xl mb-2">📊</p>
                      <p>Belum ada data kehadiran</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Material Coverage */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Materi yang Diajarkan</h3>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <svg className="transform -rotate-90" width="200" height="200">
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="#e5e7eb"
                          strokeWidth="20"
                          fill="none"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke={COLORS.materi}
                          strokeWidth="20"
                          fill="none"
                          strokeDasharray={`${Math.min((performanceData.materi_count || 0) / 30, 1) * 502.65} 502.65`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                          <p className="text-4xl font-bold text-blue-600">{performanceData.materi_count || 0}</p>
                          <p className="text-sm text-gray-600">Materi</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">Dalam 1 bulan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ringkasan Evaluasi</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Total Hari Kerja</span>
                  <span className="font-bold text-gray-900">{performanceData.total_days || 0} hari</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Tingkat Kehadiran</span>
                  <span className="font-bold text-green-600">{attendancePercentage}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Rata-rata Materi per Hari</span>
                  <span className="font-bold text-blue-600">
                    {performanceData.hadir > 0 
                      ? ((performanceData.materi_count || 0) / performanceData.hadir).toFixed(1)
                      : '0'} materi/hari
                  </span>
                </div>
              </div>
            </div>

            {/* Kriteria Evaluasi */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kriteria Evaluasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl mb-2">🌟</div>
                  <h4 className="font-bold text-green-800 mb-1">Sempurna</h4>
                  <p className="text-sm text-green-700">Kehadiran ≥ 95% & Materi ≥ 20</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl mb-2">👍</div>
                  <h4 className="font-bold text-blue-800 mb-1">Baik</h4>
                  <p className="text-sm text-blue-700">Kehadiran ≥ 85% & Materi ≥ 15</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl mb-2">👌</div>
                  <h4 className="font-bold text-yellow-800 mb-1">Cukup</h4>
                  <p className="text-sm text-yellow-700">Kehadiran ≥ 70% & Materi ≥ 10</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-2xl mb-2">📉</div>
                  <h4 className="font-bold text-red-800 mb-1">Kurang</h4>
                  <p className="text-sm text-red-700">Di bawah standar cukup</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
            <p className="text-gray-600">Belum ada data performa untuk bulan yang dipilih</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
