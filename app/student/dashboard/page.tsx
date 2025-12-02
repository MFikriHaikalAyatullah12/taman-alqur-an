'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';

interface StudentDashboardData {
  student: {
    id: number;
    student_id: string;
    full_name: string;
    current_level: string;
    photo?: string;
  };
  progress: {
    current_curriculum: string;
    completion_percentage: number;
    current_page: number;
    total_pages: number;
    last_assessment_score?: number;
  };
  schedule: any[];
  recent_news: any[];
  announcements: any[];
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Check authentication first
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        router.push('/admin/login');
        return;
      }

      const user = await authResponse.json();
      if (user.role !== 'student' && user.role !== 'parent') {
        router.push('/');
        return;
      }

      // Simulate API call with demo data
      setTimeout(() => {
        setDashboardData({
          student: {
            id: 1,
            student_id: 'TPQ20240001',
            full_name: 'Ahmad Fauzi',
            current_level: 'Iqra 4',
            photo: undefined
          },
          progress: {
            current_curriculum: 'Iqra 4',
            completion_percentage: 75,
            current_page: 30,
            total_pages: 40,
            last_assessment_score: 85
          },
          schedule: [
            {
              id: 1,
              title: 'Mengaji Iqra 4',
              time: '15:30',
              teacher: 'Ustadz Ahmad',
              location: 'Ruang A'
            },
            {
              id: 2,
              title: 'Tahsin Al-Quran',
              time: '16:30',
              teacher: 'Ustadzah Siti',
              location: 'Ruang B'
            }
          ],
          recent_news: [
            {
              id: 1,
              title: 'Pengumuman Ujian Kenaikan Jilid',
              excerpt: 'Ujian kenaikan jilid akan dilaksanakan minggu depan...',
              date: '2024-01-15'
            },
            {
              id: 2,
              title: 'Tips Belajar Mengaji di Rumah',
              excerpt: 'Berikut adalah tips untuk membantu anak belajar mengaji...',
              date: '2024-01-10'
            }
          ],
          announcements: [
            {
              id: 1,
              title: 'Libur Hari Raya Idul Fitri',
              content: 'TPQ akan libur selama 1 minggu untuk perayaan Idul Fitri',
              date: '2024-01-20',
              type: 'info'
            },
            {
              id: 2,
              title: 'Reminder: Pembayaran SPP',
              content: 'Jangan lupa untuk melunasi SPP bulan ini',
              date: '2024-01-18',
              type: 'reminder'
            }
          ]
        });
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error fetching student data:', error);
      setIsLoading(false);
      router.push('/admin/login');
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'reminder':
        return '⏰';
      case 'warning':
        return '⚠️';
      default:
        return '📢';
    }
  };

  if (isLoading) {
    return (
      <PublicLayout currentPage="/student/dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!dashboardData) {
    return (
      <PublicLayout currentPage="/student/dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h2>
            <p className="text-gray-600">Tidak dapat memuat data dashboard santri.</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const { student, progress, schedule, recent_news, announcements } = dashboardData;

  return (
    <PublicLayout currentPage="/student/dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                {student.photo ? (
                  <img
                    src={student.photo}
                    alt={student.full_name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {student.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  Selamat Datang, {student.full_name}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  ID Santri: {student.student_id} • Level: {student.current_level}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Progress Belajar</h3>
              <span className="text-2xl">📚</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Halaman saat ini</span>
                <span className="font-medium">{progress.current_page} dari {progress.total_pages}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(progress.completion_percentage)}`}
                  style={{ width: `${progress.completion_percentage}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">{progress.completion_percentage}%</span>
                <p className="text-sm text-gray-600">Selesai</p>
              </div>
            </div>
          </div>

          {/* Assessment Score */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Nilai Terakhir</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {progress.last_assessment_score || '-'}
              </div>
              <p className="text-sm text-gray-600">
                {progress.last_assessment_score 
                  ? progress.last_assessment_score >= 80 
                    ? 'Sangat Baik' 
                    : progress.last_assessment_score >= 70 
                    ? 'Baik' 
                    : 'Perlu Ditingkatkan'
                  : 'Belum ada penilaian'
                }
              </p>
            </div>
          </div>

          {/* Current Level */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Level Saat Ini</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 mb-2">
                {student.current_level}
              </div>
              <p className="text-sm text-gray-600">
                Tingkat pembelajaran
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📅</span>
              Jadwal Hari Ini
            </h2>
            
            {schedule.length > 0 ? (
              <div className="space-y-4">
                {schedule.map((item: any) => (
                  <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.teacher} • {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📋</span>
                <p className="text-gray-500">Tidak ada jadwal untuk hari ini</p>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📢</span>
              Pengumuman
            </h2>
            
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{getAnnouncementIcon(announcement.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {announcement.content}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(announcement.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📭</span>
                <p className="text-gray-500">Tidak ada pengumuman terbaru</p>
              </div>
            )}
          </div>

          {/* Recent News */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📰</span>
              Berita Terbaru
            </h2>
            
            {recent_news.length > 0 ? (
              <div className="space-y-4">
                {recent_news.map((news: any) => (
                  <div key={news.id} className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {news.excerpt}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(news.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))}
                <div className="pt-4">
                  <a href="/news" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Lihat semua berita →
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📄</span>
                <p className="text-gray-500">Belum ada berita terbaru</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Aksi Cepat
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/student/progress"
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📊</span>
                <h3 className="font-semibold text-gray-900 text-sm">Lihat Progress</h3>
              </a>
              
              <a
                href="/student/schedule"
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📅</span>
                <h3 className="font-semibold text-gray-900 text-sm">Jadwal Lengkap</h3>
              </a>
              
              <a
                href="/student/payments"
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">💰</span>
                <h3 className="font-semibold text-gray-900 text-sm">Pembayaran</h3>
              </a>
              
              <a
                href="/contact"
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
                <h3 className="font-semibold text-gray-900 text-sm">Hubungi Ustadz</h3>
              </a>
            </div>
          </div>
        </div>

        {/* Academic Calendar Preview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📆</span>
            Kalender Akademik
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15 Jan</div>
              <div className="text-sm font-medium text-gray-900">Ujian Kenaikan</div>
              <div className="text-xs text-gray-600">Iqra 4 → Iqra 5</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">22 Jan</div>
              <div className="text-sm font-medium text-gray-900">Wisuda Santri</div>
              <div className="text-xs text-gray-600">Khatam Al-Quran</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">01 Feb</div>
              <div className="text-sm font-medium text-gray-900">Semester Baru</div>
              <div className="text-xs text-gray-600">2024/2025 Genap</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}