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
  const [mounted, setMounted] = useState(false);
  
  let settings = { site_name: 'TPQ AN-NABA' };
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
        { href: '/admin/profile/organization', icon: '👥', label: 'Struktur Organisasi' },
        { href: '/admin/profile/achievements', icon: '🏆', label: 'Prestasi' }
      ]
    },
    {
      href: '/admin/teachers',
      icon: '👨‍🏫',
      label: 'Pengajar',
      children: [
        { href: '/admin/teachers', icon: '👥', label: 'Data Pengajar' }
      ]
    },
    {
      href: '/admin/students',
      icon: '👨‍🎓',
      label: 'Santri',
      children: [
        { href: '/admin/students', icon: '📋', label: 'Data Santri' }
      ]
    },
    {
      href: '/admin/finances',
      icon: '💰',
      label: 'Keuangan',
      children: [
        { href: '/admin/finances', icon: '📊', label: 'Pemasukan & Pengeluaran' }
      ]
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuthStatus();
      // Selalu refresh settings di awal untuk mendapat data terbaru
      if (refreshSettings && typeof refreshSettings === 'function') {
        refreshSettings();
      }
    }
  }, [mounted]);

  // Effect terpisah untuk update document title tanpa trigger refresh
  useEffect(() => {
    if (mounted && typeof document !== 'undefined' && settings.site_name) {
      document.title = `${settings.site_name} - Admin Panel`;
    }
  }, [mounted, settings.site_name]);

  const checkAuthStatus = async () => {
    try {
      if (typeof window === 'undefined') return;
      
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
    }
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-64 bg-white shadow-xl lg:shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 min-w-0">
              {settings && (settings as any)?.logo ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white border-2 border-blue-200 shadow-sm flex-shrink-0">
                  <img 
                    src={(settings as any).logo} 
                    alt="Logo TPQ AN-NABA" 
                    className="w-full h-full object-contain p-1"
                    style={{ imageRendering: 'crisp-edges' } as React.CSSProperties}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div 
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-full h-full rounded-lg flex items-center justify-center font-bold text-lg shadow-md"
                    style={{ display: 'none' }}
                  >
                    🏫
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
                  🏫
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-base sm:text-lg text-gray-800 truncate leading-tight">TPQ AN-NABA</h1>
                <p className="text-xs text-blue-600 font-medium">Panel Admin</p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg btn-touch"
              aria-label="Tutup menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm">
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

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-4 space-y-1 overflow-y-auto smooth-scroll">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors btn-touch"
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${isMenuExpanded(item.label) ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {isMenuExpanded(item.label) && (
                      <div className="ml-4 sm:ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors btn-touch ${
                              isActive(child.href)
                                ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <span className="mr-3 text-sm">{child.icon}</span>
                            <span className="truncate">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors btn-touch ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Logout button */}
          <div className="px-2 sm:px-4 pb-2 sm:pb-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors btn-touch"
            >
              <span className="mr-3 text-lg">🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 safe-area-top">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg btn-touch"
                aria-label="Buka menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {currentPage.includes('dashboard') && 'Dashboard'}
                  {currentPage.includes('students') && 'Data Santri'}
                  {currentPage.includes('teachers') && 'Data Pengajar'}
                  {currentPage.includes('finances') && 'Keuangan'}
                  {currentPage.includes('profile') && 'Profil TPQ'}

                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 safe-area-bottom">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}