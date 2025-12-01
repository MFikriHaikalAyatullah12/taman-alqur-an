'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  pendingRegistrations: number;
  activePrograms: number;
  monthlyRevenue: number;
  recentActivities: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    pendingRegistrations: 0,
    activePrograms: 0,
    monthlyRevenue: 0,
    recentActivities: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call with demo data
      setTimeout(() => {
        setStats({
          totalStudents: 125,
          totalTeachers: 15,
          pendingRegistrations: 8,
          activePrograms: 6,
          monthlyRevenue: 12500000,
          recentActivities: [
            {
              id: 1,
              type: 'student_registration',
              message: 'Ahmad Fauzi mendaftar sebagai santri baru',
              time: '2 jam yang lalu'
            },
            {
              id: 2,
              type: 'payment',
              message: 'Pembayaran SPP dari Siti Nurhaliza',
              time: '3 jam yang lalu'
            },
            {
              id: 3,
              type: 'progress',
              message: 'Muhammad Ali menyelesaikan Iqra 4',
              time: '5 jam yang lalu'
            },
            {
              id: 4,
              type: 'event',
              message: 'Jadwal ujian kenaikan jilid telah ditambahkan',
              time: '1 hari yang lalu'
            },
            {
              id: 5,
              type: 'news',
              message: 'Artikel "Tips Mengaji di Rumah" telah dipublikasi',
              time: '2 hari yang lalu'
            }
          ]
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Tambah Santri',
      description: 'Daftarkan santri baru',
      icon: '👨‍🎓',
      href: '/admin/students/add',
      color: 'bg-blue-500'
    },
    {
      title: 'Buat Artikel',
      description: 'Tulis berita atau pengumuman',
      icon: '✍️',
      href: '/admin/news/create',
      color: 'bg-green-500'
    },
    {
      title: 'Upload Galeri',
      description: 'Tambah foto/video kegiatan',
      icon: '📷',
      href: '/admin/gallery/upload',
      color: 'bg-purple-500'
    },
    {
      title: 'Buat Jadwal',
      description: 'Tambah kegiatan baru',
      icon: '📅',
      href: '/admin/schedule/events',
      color: 'bg-orange-500'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student_registration':
        return '👨‍🎓';
      case 'payment':
        return '💰';
      case 'progress':
        return '📊';
      case 'event':
        return '📅';
      case 'news':
        return '📰';
      default:
        return 'ℹ️';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang di Admin Panel! 👋
          </h1>
          <p className="text-white/90 text-lg">
            Kelola TPQ Al-Hikmah dengan mudah dan efisien
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Santri</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl">👨‍🎓</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">+12%</span>
              <span className="text-gray-500 text-sm ml-1">dari bulan lalu</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengajar</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-2xl">👨‍🏫</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">+2</span>
              <span className="text-gray-500 text-sm ml-1">pengajar baru</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendaftaran Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingRegistrations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-2xl">📝</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-500 text-sm font-medium">Perlu review</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendapatan Bulan Ini</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">+8%</span>
              <span className="text-gray-500 text-sm ml-1">dari target</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="group p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activities and Overview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              {stats.recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a href="/admin/activities" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Lihat semua aktivitas →
              </a>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Hari Ini</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600">📚</span>
                  <span className="text-sm font-medium text-gray-900">Kelas Hari Ini</span>
                </div>
                <span className="text-sm font-bold text-blue-600">8 Kelas</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600">👨‍🎓</span>
                  <span className="text-sm font-medium text-gray-900">Santri Hadir</span>
                </div>
                <span className="text-sm font-bold text-green-600">98 dari 105</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-600">📝</span>
                  <span className="text-sm font-medium text-gray-900">Ujian Terjadwal</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">3 Ujian</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-600">🎉</span>
                  <span className="text-sm font-medium text-gray-900">Event Mendatang</span>
                </div>
                <span className="text-sm font-bold text-purple-600">Wisuda Santri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Jadwal Minggu Ini</h2>
          <div className="grid grid-cols-7 gap-4">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-sm font-medium ${
                  index === new Date().getDay() - 1 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {new Date().getDate() + index - new Date().getDay() + 1}
                </div>
                {index < 5 && (
                  <div className="mt-1 text-xs text-green-600">
                    {index < 3 ? '8 kelas' : index === 3 ? '6 kelas' : '4 kelas'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}