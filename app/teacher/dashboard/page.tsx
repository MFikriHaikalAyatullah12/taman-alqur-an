'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Teacher {
  id: number;
  name: string;
  specialization: string;
}

interface PerformanceData {
  hadir: number;
  izin: number;
  alfa: number;
  sakit: number;
  total_days: number;
  materiCount: number;
}

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(false);
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('teacher_token');
    const name = localStorage.getItem('teacher_name');
    
    if (!token) {
      router.push('/teacher/login');
      return;
    }
    
    setTeacherName(name || 'Guru');
    fetchTeachers();
  }, [router]);

  useEffect(() => {
    if (selectedTeacher) {
      fetchPerformanceData();
    }
  }, [selectedTeacher, selectedMonth]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('teacher_token');
      const response = await fetch('/api/teacher/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Teachers data:', data);
        setTeachers(data.teachers || []);
      } else {
        console.error('Failed to fetch teachers:', response.status);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchPerformanceData = async () => {
    if (!selectedTeacher) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('teacher_token');
      console.log('Fetching performance for teacher:', selectedTeacher.id, 'month:', selectedMonth);
      
      const response = await fetch(
        `/api/teacher/performance?teacher_id=${selectedTeacher.id}&month=${selectedMonth}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Performance data:', data);
        
        if (data.performance) {
          setPerformanceData({
            hadir: data.performance.hadir || 0,
            izin: data.performance.izin || 0,
            alfa: data.performance.alfa || 0,
            sakit: data.performance.sakit || 0,
            total_days: data.performance.total_days || 0,
            materiCount: data.performance.materiCount || 0
          });
        }
      } else {
        console.error('Failed to fetch performance:', response.status);
      }
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_name');
    router.push('/teacher/login');
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Search query:', searchQuery);
  console.log('All teachers:', teachers.length);
  console.log('Filtered teachers:', filteredTeachers.length);

  const getAttendanceChartData = () => {
    if (!performanceData) return [];
    
    const data = [
      { name: 'Hadir', value: performanceData.hadir, fill: '#10b981' },
      { name: 'Izin', value: performanceData.izin, fill: '#3b82f6' },
      { name: 'Sakit', value: performanceData.sakit, fill: '#f59e0b' },
      { name: 'Alfa', value: performanceData.alfa, fill: '#ef4444' }
    ];
    
    return data.filter(item => item.value > 0);
  };

  const getAttendancePercentage = () => {
    if (!performanceData || performanceData.total_days === 0) return 0;
    return ((performanceData.hadir / performanceData.total_days) * 100).toFixed(1);
  };

  const months = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white drop-shadow-lg">Portal Guru TPQ</h1>
                <p className="text-emerald-100 font-medium">Selamat datang, {teacherName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-5 py-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm group"
            >
              <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-white font-semibold">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Creative Search Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 rounded-bl-full"></div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Cari Nama Pengajar
          </h2>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik nama pengajar untuk melihat performa..."
              className="w-full px-5 py-4 pl-14 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-900 placeholder-gray-500 font-medium bg-gray-50 hover:bg-white"
            />
            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {searchQuery && filteredTeachers.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left transform hover:scale-105 ${
                    selectedTeacher?.id === teacher.id
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div className="font-bold text-gray-900 text-lg">{teacher.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{teacher.specialization || 'Pengajar'}</div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && filteredTeachers.length === 0 && (
            <div className="mt-8 text-center text-gray-500 py-12">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 22a10 10 0 100-20 10 10 0 000 20z" />
              </svg>
              <p className="font-semibold text-lg">Pengajar tidak ditemukan</p>
            </div>
          )}
        </div>

        {/* Performance Section */}
        {selectedTeacher && (
          <>
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div>
                  <h2 className="text-3xl font-black mb-2">{selectedTeacher.name}</h2>
                  <p className="text-emerald-100 text-lg font-semibold">{selectedTeacher.specialization || 'Pengajar'}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2.5 bg-white bg-opacity-20 border-2 border-white border-opacity-30 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-sm"
                  >
                    {years.map(year => (
                      months.map(month => (
                        <option key={`${year}-${month.value}`} value={`${year}-${month.value}`} className="text-gray-900">
                          {month.label} {year}
                        </option>
                      ))
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold text-lg">Memuat data performa...</p>
              </div>
            ) : (
              <>
                {/* Attendance Chart */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-400 to-cyan-500 opacity-10 rounded-tr-full"></div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
                    <svg className="w-7 h-7 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Kehadiran Bulanan
                  </h3>
                  
                  {performanceData && performanceData.total_days > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={getAttendanceChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                dataKey="value"
                              >
                                {getAttendanceChartData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-l-4 border-green-500 rounded-xl p-5 shadow-sm">
                            <div className="text-green-700 text-sm font-bold mb-1">Hadir</div>
                            <div className="text-4xl font-black text-green-900">{performanceData.hadir} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-red-50 to-pink-100 border-l-4 border-red-500 rounded-xl p-5 shadow-sm">
                            <div className="text-red-700 text-sm font-bold mb-1">Alfa</div>
                            <div className="text-4xl font-black text-red-900">{performanceData.alfa} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-100 border-l-4 border-yellow-500 rounded-xl p-5 shadow-sm">
                            <div className="text-yellow-700 text-sm font-bold mb-1">Sakit</div>
                            <div className="text-4xl font-black text-yellow-900">{performanceData.sakit} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-100 border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
                            <div className="text-blue-700 text-sm font-bold mb-1">Izin</div>
                            <div className="text-4xl font-black text-blue-900">{performanceData.izin} hari</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-lg">
                        <div className="text-emerald-100 text-sm font-bold mb-3">PERSENTASE KEHADIRAN</div>
                        <div className="text-6xl font-black mb-3">{getAttendancePercentage()}%</div>
                        <div className="text-emerald-100 font-semibold">dari {performanceData.total_days} hari</div>
                      </div>

                      {performanceData.materiCount > 0 && (
                        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-100 border-l-4 border-purple-500 rounded-xl p-6 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-purple-700 text-sm font-bold mb-1">Total Materi Diajarkan</div>
                              <div className="text-4xl font-black text-purple-900">{performanceData.materiCount} materi</div>
                            </div>
                            <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-semibold text-lg">Belum ada data kehadiran untuk bulan ini</p>
                      <p className="text-sm mt-2">Pilih bulan lain untuk melihat data</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
