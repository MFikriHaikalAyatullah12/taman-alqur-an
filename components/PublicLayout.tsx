'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTpq } from '@/lib/TpqContext';
import WhatsAppFloat from './WhatsAppFloat';

interface PublicLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  showAuth?: boolean;
}

export default function PublicLayout({ children, currentPage = '', showAuth = true }: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { settings, refreshSettings } = useTpq();
  const router = useRouter();

  useEffect(() => {
    if (showAuth) {
      checkAuthStatus();
    }
    // Selalu refresh settings untuk mendapat data terbaru
    refreshSettings();
  }, [showAuth]);

  // Effect terpisah untuk update document title
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.site_name) {
      document.title = `${settings.site_name} - Taman Pendidikan Al-Quran`;
    }
  }, [settings.site_name]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      // User not logged in, which is fine for public pages
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const navigationItems = [
    { href: '/', label: 'Beranda', icon: '🏠' },
    { href: '/about', label: 'Tentang', icon: 'ℹ️' },
    { href: '/programs', label: 'Program', icon: '📚' },
    { href: '/teachers', label: 'Pengajar', icon: '👨‍🏫' },
    { href: '/news', label: 'Berita', icon: '📰' },
    { href: '/gallery', label: 'Galeri', icon: '🖼️' },
    { href: '/contact', label: 'Kontak', icon: '📞' },
  ];

  const isActive = (href: string) => currentPage === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-800">{settings.site_name}</h1>
                <p className="text-xs text-gray-500">Taman Pendidikan Al-Quran</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user.role === 'student' && (
                    <Link
                      href="/student/dashboard"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Dashboard Santri
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{user.full_name || user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                showAuth && (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/registration"
                      className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      Daftar
                    </Link>
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                      Masuk
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name || user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    {user.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-blue-600 font-medium"
                      >
                        🔧 Admin Panel
                      </Link>
                    )}
                    
                    {user.role === 'student' && (
                      <Link
                        href="/student/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-green-600 font-medium"
                      >
                        📊 Dashboard Santri
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 font-medium"
                    >
                      🚪 Keluar
                    </button>
                  </div>
                ) : (
                  showAuth && (
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <Link
                        href="/registration"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-green-600 font-medium border border-green-600 rounded-md text-center mx-3"
                      >
                        📝 Daftar
                      </Link>
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-md text-center mx-3"
                      >
                        🔑 Masuk
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{settings.site_name}</h3>
                  <p className="text-sm text-gray-300">Taman Pendidikan Al-Quran</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Memberikan pendidikan Al-Quran berkualitas untuk membentuk generasi yang berakhlak mulia dan berprestasi.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-2xl">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-2xl">
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-2xl">
                  📹
                </a>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors text-2xl">
                  💬
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Program</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/programs/iqra" className="hover:text-green-400 transition-colors">Iqra 1-6</Link></li>
                <li><Link href="/programs/quran" className="hover:text-green-400 transition-colors">Al-Quran</Link></li>
                <li><Link href="/programs/tahfidz" className="hover:text-green-400 transition-colors">Tahfidz</Link></li>
                <li><Link href="/programs/tahsin" className="hover:text-green-400 transition-colors">Tahsin</Link></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-green-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="/teachers" className="hover:text-green-400 transition-colors">Pengajar</Link></li>
                <li><Link href="/gallery" className="hover:text-green-400 transition-colors">Galeri</Link></li>
                <li><Link href="/news" className="hover:text-green-400 transition-colors">Berita</Link></li>
                <li><Link href="/testimonials" className="hover:text-green-400 transition-colors">Testimoni</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center space-x-3">
                <span className="text-green-400">📍</span>
                <span className="text-gray-300">Jl. Pendidikan No. 123, Jakarta Selatan</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">📞</span>
                <span className="text-gray-300">021-12345678</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400">✉️</span>
                <span className="text-gray-300">info@tpqalhikmah.com</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {settings.site_name}. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Float */}
      <WhatsAppFloat />
    </div>
  );
}