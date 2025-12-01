'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

interface MenuItem {
  href: string;
  icon: string;
  label: string;
  children?: MenuItem[];
}

export default function AdminLayout({ children, currentPage = '' }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [tpqName, setTpqName] = useState('TPQ Al-Hikmah');
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      href: '/admin/dashboard',
      icon: '🏠',
      label: 'Dashboard'
    },
    {
      href: '/admin/profile',
      icon: '🏢',
      label: 'Profil TPQ',
      children: [
        { href: '/admin/profile/history', icon: '📜', label: 'Sejarah' },
        { href: '/admin/profile/vision-mission', icon: '🎯', label: 'Visi & Misi' },
        { href: '/admin/profile/organization', icon: '👥', label: 'Struktur Organisasi' },
        { href: '/admin/profile/achievements', icon: '🏆', label: 'Prestasi' }
      ]
    },
    {
      href: '/admin/teachers',
      icon: '👨‍🏫',
      label: 'Pengajar',
      children: [
        { href: '/admin/teachers', icon: '👥', label: 'Data Pengajar' },
        { href: '/admin/teachers/schedule', icon: '📅', label: 'Jadwal Mengajar' },
        { href: '/admin/teachers/add', icon: '➕', label: 'Tambah Pengajar' }
      ]
    },
    {
      href: '/admin/students',
      icon: '👨‍🎓',
      label: 'Santri',
      children: [
        { href: '/admin/students', icon: '📋', label: 'Data Santri' },
        { href: '/admin/students/registrations', icon: '📝', label: 'Pendaftaran' },
        { href: '/admin/students/progress', icon: '📊', label: 'Progress Belajar' },
        { href: '/admin/students/add', icon: '➕', label: 'Tambah Santri' }
      ]
    },
    {
      href: '/admin/curriculum',
      icon: '📚',
      label: 'Kurikulum',
      children: [
        { href: '/admin/curriculum', icon: '📖', label: 'Program Pembelajaran' },
        { href: '/admin/curriculum/levels', icon: '🎚️', label: 'Tingkatan' },
        { href: '/admin/curriculum/materials', icon: '📄', label: 'Materi' },
        { href: '/admin/curriculum/methods', icon: '🎯', label: 'Metode' }
      ]
    },
    {
      href: '/admin/schedule',
      icon: '📅',
      label: 'Jadwal & Kalender',
      children: [
        { href: '/admin/schedule/classes', icon: '🕐', label: 'Jadwal Mengaji' },
        { href: '/admin/schedule/exams', icon: '📝', label: 'Ujian Kenaikan' },
        { href: '/admin/schedule/events', icon: '🎉', label: 'Kegiatan Khusus' },
        { href: '/admin/schedule/calendar', icon: '📆', label: 'Kalender Akademik' }
      ]
    },
    {
      href: '/admin/gallery',
      icon: '🖼️',
      label: 'Galeri',
      children: [
        { href: '/admin/gallery/photos', icon: '📷', label: 'Foto' },
        { href: '/admin/gallery/videos', icon: '🎥', label: 'Video' },
        { href: '/admin/gallery/events', icon: '🎊', label: 'Dokumentasi Acara' },
        { href: '/admin/gallery/upload', icon: '⬆️', label: 'Upload Media' }
      ]
    },
    {
      href: '/admin/news',
      icon: '📰',
      label: 'Berita & Artikel',
      children: [
        { href: '/admin/news', icon: '📰', label: 'Semua Berita' },
        { href: '/admin/news/create', icon: '✍️', label: 'Tulis Artikel' },
        { href: '/admin/news/announcements', icon: '📢', label: 'Pengumuman' },
        { href: '/admin/news/categories', icon: '🏷️', label: 'Kategori' }
      ]
    },
    {
      href: '/admin/payments',
      icon: '💰',
      label: 'Pembayaran',
      children: [
        { href: '/admin/payments/transactions', icon: '💳', label: 'Transaksi' },
        { href: '/admin/payments/spp', icon: '💵', label: 'SPP Santri' },
        { href: '/admin/payments/donations', icon: '🤲', label: 'Donasi' },
        { href: '/admin/payments/reports', icon: '📊', label: 'Laporan Keuangan' }
      ]
    },
    {
      href: '/admin/contact',
      icon: '📞',
      label: 'Kontak & Lokasi',
      children: [
        { href: '/admin/contact/messages', icon: '💬', label: 'Pesan Masuk' },
        { href: '/admin/contact/info', icon: 'ℹ️', label: 'Info Kontak' },
        { href: '/admin/contact/location', icon: '📍', label: 'Lokasi' },
        { href: '/admin/contact/hours', icon: '🕐', label: 'Jam Operasional' }
      ]
    },
    {
      href: '/admin/testimonials',
      icon: '⭐',
      label: 'Testimoni',
      children: [
        { href: '/admin/testimonials', icon: '💬', label: 'Semua Testimoni' },
        { href: '/admin/testimonials/pending', icon: '⏳', label: 'Menunggu Persetujuan' },
        { href: '/admin/testimonials/featured', icon: '🌟', label: 'Testimoni Unggulan' }
      ]
    },
    {
      href: '/admin/settings',
      icon: '⚙️',
      label: 'Pengaturan',
      children: [
        { href: '/admin/settings/general', icon: '🔧', label: 'Umum' },
        { href: '/admin/settings/users', icon: '👥', label: 'Pengguna' },
        { href: '/admin/settings/backup', icon: '💾', label: 'Backup Data' },
        { href: '/admin/settings/security', icon: '🔒', label: 'Keamanan' }
      ]
    }
  ];

  useEffect(() => {
    // Check if admin is authenticated
    checkAuthStatus();
    loadTpqSettings();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const adminData = localStorage.getItem('admin_data');
      
      if (!token || !adminData) {
        router.push('/admin/login');
        return;
      }

      const admin = JSON.parse(adminData);
      setUser(admin);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    }
  };

  const loadTpqSettings = async () => {
    try {
      const response = await fetch('/api/public/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.site_name) {
          setTpqName(settings.site_name);
        }
      }
    } catch (error) {
      console.error('Error loading TPQ settings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    router.push('/admin/login');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev: string[]) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isMenuExpanded = (label: string) => expandedMenus.includes(label);
  const isActive = (href: string) => currentPage === href || currentPage.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">{tpqName}</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.full_name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.full_name || 'Administrator'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-0">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isMenuExpanded(item.label) ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {isMenuExpanded(item.label) && (
                    <div className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(child.href)
                              ? 'bg-green-100 text-green-800 border-r-4 border-green-500'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-3">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-100 text-green-800 border-r-4 border-green-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span className="mr-3 text-lg">🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Admin Panel {tpqName}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick actions */}
              <Link
                href="/"
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="Lihat Website Publik"
              >
                🌐 Website Publik
              </Link>
              
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}