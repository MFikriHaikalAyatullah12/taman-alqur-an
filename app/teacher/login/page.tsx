'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/teacher-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('teacher_token', data.token);
        localStorage.setItem('teacher_name', data.teacher.name);
        router.push('/teacher/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-300 opacity-10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Creative Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 bg-white opacity-30 rounded-3xl blur-lg transform rotate-6 scale-110"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-white via-emerald-50 to-teal-100 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-110">
              <svg className="w-12 h-12 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 drop-shadow-2xl tracking-tight">Portal Guru TPQ</h1>
          <p className="text-emerald-50 text-lg font-semibold">Masuk untuk melihat performa Anda</p>
        </div>

        {/* Custom Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-10 rounded-tr-full"></div>
          
          {/* Stylish Info Box */}
          <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-l-4 border-emerald-500 px-5 py-4 rounded-r-xl text-sm shadow-sm">
            <p className="font-bold text-emerald-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Akun Default Guru:
            </p>
            <div className="ml-7 space-y-1 text-gray-700">
              <p><span className="font-semibold text-gray-900">Email:</span> <span className="font-mono bg-white px-2 py-0.5 rounded text-gray-900">gurutpq@gmail.com</span></p>
              <p><span className="font-semibold text-gray-900">Password:</span> <span className="font-mono bg-white px-2 py-0.5 rounded text-gray-900">1234567890</span></p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-r-xl text-sm font-medium shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white font-medium"
                placeholder="gurutpq@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white font-medium"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 shadow-xl hover:shadow-2xl hover:scale-105'
              } relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  'Masuk'
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/admin/login" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Login Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
