'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTpq } from '@/lib/TpqContext';

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
  
  let settings = { site_name: 'TPQ Al-Hikmah' };
  let refreshSettings = () => {};
  
  try {
    const tpqContext = useTpq();
    settings = tpqContext.settings;
    refreshSettings = tpqContext.refreshSettings;
  } catch (error) {
    console.warn('TpqContext not available, using defaults');
  }
  
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
        { href: '/admin/profile/info', icon: 'ℹ️', label: 'Informasi TPQ' },
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
        { href: '/admin/curriculum/materials', icon: '📋', label: 'Materi' },
        { href: '/admin/curriculum/methods', icon: '🎓', label: 'Metode Pembelajaran' }
      ]
    },
    {
      href: '/admin/schedule',
      icon: '📅',
      label: 'Jadwal & Kalender',
      children: [
        { href: '/admin/schedule/calendar', icon: '📅', label: 'Jadwal Mengaji' },
        { href: '/admin/schedule/classes', icon: '🕐', label: 'Jadwal Kelas' },
        { href: '/admin/schedule/events', icon: '🎉', label: 'Kegiatan' },
        { href: '/admin/schedule/exams', icon: '📝', label: 'Ujian & Evaluasi' }
      ]
    },
    {
      href: '/admin/payments',
      icon: '💰',
      label: 'Pembayaran',
      children: [
        { href: '/admin/payments/transactions', icon: '💳', label: 'Transaksi' },
        { href: '/admin/payments/donations', icon: '🤲', label: 'Donasi' },
        { href: '/admin/payments/reports', icon: '📊', label: 'Laporan Keuangan' }
      ]
    },
    {
      href: '/admin/contact',
      icon: '📞',
      label: 'Kontak & Pesan'
    },
    {
      href: '/admin/settings',
      icon: '⚙️',
      label: 'Pengaturan',
      children: [
        { href: '/admin/settings', icon: '🎛️', label: 'Pengaturan Umum' },
        { href: '/admin/settings/users', icon: '👥', label: 'Manajemen User' },
        { href: '/admin/settings/backup', icon: '💾', label: 'Backup Data' },
        { href: '/admin/settings/security', icon: '🔒', label: 'Keamanan' }
      ]
    }
  ];

  useEffect(() => {
    checkAuthStatus();
    // Selalu refresh settings di awal untuk mendapat data terbaru
    if (refreshSettings && typeof refreshSettings === 'function') {
      refreshSettings();
    }
  }, []);

  // Effect terpisah untuk update document title tanpa trigger refresh
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.site_name) {
      document.title = `${settings.site_name} - Admin Panel`;
    }
  }, [settings.site_name]);

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
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                {settings.site_name.charAt(0)}
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-800">{settings.site_name}</h1>
                <p className="text-xs text-gray-500">Panel Admin</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-base">{item.icon}</span>
                        {item.label}
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${isMenuExpanded(item.label) ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {isMenuExpanded(item.label) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(child.href)
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <span className="mr-3 text-sm">{child.icon}</span>
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
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="mr-3 text-lg">🚪</span>
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors" title="Lihat Website Publik">
                🌐 Website Publik
              </Link>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}