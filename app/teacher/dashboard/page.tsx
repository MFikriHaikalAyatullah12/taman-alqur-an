'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Teacher {
  id: number;
  name: string;
  specialization: string;
}

interface TeacherClass {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

interface PerformanceData {
  hadir: number;
  izin: number;
  alfa: number;
  sakit: number;
  total_days: number;
  materiCount: number;
}

// Password Modal Component
const PasswordModal = ({ 
  isOpen, 
  onClose, 
  teacher, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  teacher: Teacher | null;
  onSuccess: (teacherId: number, classes: TeacherClass[], accessToken: string) => void;
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('teacher_token');
      const response = await fetch('/api/teacher/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacher.id,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(teacher.id, data.classes || [], data.accessToken);
        setPassword('');
        onClose();
      } else {
        setError(data.error || 'Verifikasi gagal');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('Terjadi kesalahan saat verifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Masukkan Password</h2>
          <p className="text-gray-600 text-sm mt-1">Verifikasi untuk mengakses kelas <strong>{teacher.name}</strong></p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password pengajar"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 placeholder-gray-500"
              required
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  
  // Password verification states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [teacherToVerify, setTeacherToVerify] = useState<Teacher | null>(null);
  const [verifiedTeacher, setVerifiedTeacher] = useState<{ id: number; classes: TeacherClass[] } | null>(null);

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
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('verified_teacher_id');
    router.push('/teacher/login');
  };

  // Handle teacher click - require password verification
  const handleTeacherClick = (teacher: Teacher) => {
    setTeacherToVerify(teacher);
    setShowPasswordModal(true);
  };

  // Handle successful password verification
  const handleVerificationSuccess = (teacherId: number, classes: TeacherClass[], accessToken: string) => {
    // Store access token
    localStorage.setItem('teacher_access_token', accessToken);
    localStorage.setItem('verified_teacher_id', teacherId.toString());
    
    // Set verified teacher with their classes
    setVerifiedTeacher({ id: teacherId, classes });
    
    // Find and set the selected teacher
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
    }
  };

  // Navigate to class management
  const handleManageClass = (classId: number) => {
    router.push(`/teacher/class/${classId}`);
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
              {filteredTeachers.map((teacher) => {
                const isVerified = verifiedTeacher?.id === teacher.id;
                
                return (
                  <div
                    key={teacher.id}
                    className={`p-5 rounded-2xl border-2 transition-all text-left transform ${
                      selectedTeacher?.id === teacher.id && isVerified
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{teacher.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{teacher.specialization || 'Pengajar'}</div>
                      </div>
                      {isVerified ? (
                        <div className="flex items-center space-x-1">
                          <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        </div>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>
                    
                    {isVerified ? (
                      <div className="mt-4 flex space-x-2">
                        {/* Ikon Performa */}
                        <button
                          onClick={() => setSelectedTeacher(teacher)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Performa
                        </button>
                        {/* Ikon Kelas */}
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            // Scroll to class section
                            document.getElementById('class-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Kelas
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTeacherClick(teacher)}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-700 transition-all"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Masuk dengan Password
                      </button>
                    )}
                  </div>
                );
              })}
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
                <div className="bg-white rounded-xl shadow-md p-4 mb-4 relative overflow-hidden max-w-4xl mx-auto">
                  
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Kehadiran Bulanan
                  </h3>
                  
                  {performanceData && performanceData.total_days > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                              <Pie
                                data={getAttendanceChartData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={60}
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
                        
                        <div className="space-y-2">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-3 border-green-500 rounded-lg p-2 shadow-sm">
                            <div className="text-green-700 text-xs font-semibold">Hadir</div>
                            <div className="text-lg font-bold text-green-900">{performanceData.hadir} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-3 border-red-500 rounded-lg p-2 shadow-sm">
                            <div className="text-red-700 text-xs font-semibold">Alfa</div>
                            <div className="text-lg font-bold text-red-900">{performanceData.alfa} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-3 border-yellow-500 rounded-lg p-2 shadow-sm">
                            <div className="text-yellow-700 text-xs font-semibold">Sakit</div>
                            <div className="text-lg font-bold text-yellow-900">{performanceData.sakit} hari</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-3 border-blue-500 rounded-lg p-2 shadow-sm">
                            <div className="text-blue-700 text-xs font-semibold">Izin</div>
                            <div className="text-lg font-bold text-blue-900">{performanceData.izin} hari</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 text-white text-center shadow-md">
                        <div className="text-emerald-100 text-xs font-semibold mb-1">PERSENTASE KEHADIRAN</div>
                        <div className="text-2xl font-black mb-1">{getAttendancePercentage()}%</div>
                        <div className="text-emerald-100 text-xs font-medium">dari {performanceData.total_days} hari</div>
                      </div>

                      {performanceData.materiCount > 0 && (
                        <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-3 border-purple-500 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-purple-700 text-xs font-semibold mb-0.5">Total Materi Diajarkan</div>
                              <div className="text-lg font-bold text-purple-900">{performanceData.materiCount} materi</div>
                            </div>
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Class Management Section - Show after verification */}
                {verifiedTeacher && verifiedTeacher.id === selectedTeacher.id && (
                  <div id="class-section" className="bg-white rounded-xl shadow-md p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Kelas yang Anda Kelola
                    </h3>
                    
                    {verifiedTeacher.classes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {verifiedTeacher.classes.map((cls) => (
                          <div 
                            key={cls.id} 
                            className="border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900">{cls.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${cls.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {cls.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                            {cls.description && (
                              <p className="text-sm text-gray-600 mb-4">{cls.description}</p>
                            )}
                            <button
                              onClick={() => handleManageClass(cls.id)}
                              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Kelola Kelas
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="font-semibold">Belum ada kelas yang ditugaskan</p>
                        <p className="text-sm mt-1">Hubungi admin untuk menambahkan kelas</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Password Verification Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setTeacherToVerify(null);
        }}
        teacher={teacherToVerify}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
