'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AdminLoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('registered')) {
      setSuccess('Registrasi berhasil! Silakan login dengan akun Anda.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_data', JSON.stringify(data.admin));
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-3">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white">Login Admin</h2>
          <p className="text-blue-100 text-xs">Panel administrasi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-3 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg mb-3 text-xs">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-black"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-black"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-300 text-xs ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
              } text-white shadow-md`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Masuk...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-xs text-black">
              Belum punya akun?{' '}
              <Link 
                href="/admin/register" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Daftar
              </Link>
            </p>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link 
                href="/" 
                className="text-black hover:text-gray-700 text-xs"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
