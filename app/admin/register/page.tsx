'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/admin-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: '', // Will be set in admin panel
          address: '' // Will be set in admin panel
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect ke login dengan pesan sukses
        router.push('/admin/login?registered=true');
      } else {
        setError(data.error || 'Gagal mendaftar');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Daftar Admin</h2>
          <p className="text-blue-100 text-xs">Buat akun admin</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-4">
          {error && (
            <div className="mb-3 p-2 rounded-md bg-red-100 border border-red-300 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
                placeholder="Nama lengkap"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
                  placeholder="Min. 6"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Konfirmasi *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
                  placeholder="Ulangi"
                />
              </div>
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
                  <span>Mendaftar...</span>
                </div>
              ) : (
                'Daftar Admin'
              )}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-600">
              Sudah punya akun?{' '}
              <Link 
                href="/admin/login" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
