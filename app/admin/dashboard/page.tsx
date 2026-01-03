'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface DashboardData {
  students: {
    total: number;
    active: number;
  };
  teachers: {
    total: number;
    avgExperience: number;
  };
  finances: {
    income: number;
    expense: number;
    balance: number;
    transactions: number;
  };
  lastUpdated: string;
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastRefresh(new Date());
    fetchDashboardData();
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setDashboardData(result.data);
        if (mounted) {
          setLastRefresh(new Date());
        }
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  if (isLoading && !dashboardData) {
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
      <div className="space-y-4">
        {/* Hero Header Section - Compact */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white drop-shadow-lg">Dashboard TPQ</h1>
              </div>
              <p className="text-white text-opacity-90 text-sm font-medium">Ringkasan data TPQ secara realtime</p>
              {mounted && lastRefresh && (
                <p className="text-xs text-white text-opacity-75 mt-0.5">
                  Terakhir: {lastRefresh.toLocaleTimeString('id-ID')}
                </p>
              )}
            </div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 backdrop-blur-sm group flex items-center space-x-2 border border-white border-opacity-30 text-sm"
              disabled={isLoading}
            >
              <span className={`text-lg ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}>🔄</span>
              <span className="text-white font-bold hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
          {/* Students Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-4 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">👨‍🎓</span>
                    <p className="text-blue-100 text-xs font-semibold">Total Santri</p>
                  </div>
                  <p className="text-3xl md:text-4xl font-black mb-1">{dashboardData?.students.total || 0}</p>
                  <p className="text-blue-100 text-xs">Aktif: {dashboardData?.students.active || 0}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Teachers Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-4 rounded-xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-tr-full"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl">👨‍🏫</span>
                    <p className="text-green-100 text-xs font-semibold">Total Pengajar</p>
                  </div>
                  <p className="text-3xl md:text-4xl font-black mb-1">{dashboardData?.teachers.total || 0}</p>
                  <p className="text-green-100 text-xs">Rata-rata {dashboardData?.teachers.avgExperience || 0} tahun</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Balance Card - Compact */}
          <div className={`lg:col-span-12 bg-gradient-to-r p-4 rounded-xl text-white shadow-lg relative overflow-hidden ${
            (dashboardData?.finances.balance || 0) >= 0 
              ? 'from-teal-500 via-cyan-600 to-blue-600' 
              : 'from-red-500 via-pink-600 to-rose-600'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-xl mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-xs font-semibold text-white text-opacity-75 mb-1">Saldo Bulan Ini</p>
                <p className="text-2xl md:text-3xl font-black mb-1">
                  Rp {(dashboardData?.finances.balance || 0).toLocaleString('id-ID')}
                </p>
                <div className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <p className="text-xs font-bold">
                    {(dashboardData?.finances.balance || 0) >= 0 ? '✅ Surplus' : '⚠️ Defisit'}
                  </p>
                </div>
              </div>
              
              <div className="border-l border-white border-opacity-20 pl-3">
                <p className="text-xs font-semibold text-white text-opacity-75 mb-1">Pemasukan</p>
                <p className="text-xl md:text-2xl font-black mb-0.5">
                  Rp {(dashboardData?.finances.income || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-white text-opacity-75">{dashboardData?.finances.transactions || 0} transaksi</p>
              </div>
              
              <div className="border-l border-white border-opacity-20 pl-3">
                <p className="text-xs font-semibold text-white text-opacity-75 mb-1">Pengeluaran</p>
                <p className="text-xl md:text-2xl font-black">
                  Rp {(dashboardData?.finances.expense || 0).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Finance Summary - Compact */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-emerald-500">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-gray-900">Ringkasan Keuangan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl transform group-hover:scale-105 transition-transform"></div>
              <div className="relative p-3 md:p-4 text-center">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-2xl md:text-3xl font-black text-green-600 mb-0.5">
                  Rp {(dashboardData?.finances.income || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Total Pemasukan</div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl transform group-hover:scale-105 transition-transform"></div>
              <div className="relative p-3 md:p-4 text-center">
                <div className="text-2xl mb-1">💸</div>
                <div className="text-2xl md:text-3xl font-black text-red-600 mb-0.5">
                  Rp {(dashboardData?.finances.expense || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Total Pengeluaran</div>
              </div>
            </div>
            <div className="relative group">
              <div className={`absolute inset-0 rounded-xl transform group-hover:scale-105 transition-transform ${
                (dashboardData?.finances.balance || 0) >= 0 ? 'bg-gradient-to-br from-blue-100 to-cyan-100' : 'bg-gradient-to-br from-red-100 to-rose-100'
              }`}></div>
              <div className="relative p-3 md:p-4 text-center">
                <div className="text-2xl mb-1">💼</div>
                <div className={`text-2xl md:text-3xl font-black mb-0.5 ${
                  (dashboardData?.finances.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  Rp {(dashboardData?.finances.balance || 0).toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-gray-600 font-semibold">Saldo Akhir</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-gray-900">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/admin/students" className="group relative overflow-hidden p-4 bg-white rounded-xl text-center hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">👨‍🎓</div>
                <div className="text-xs font-black text-blue-800">Kelola Santri</div>
              </div>
            </a>
            <a href="/admin/teachers" className="group relative overflow-hidden p-4 bg-white rounded-xl text-center hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-green-500">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">👨‍🏫</div>
                <div className="text-xs font-black text-green-800">Kelola Pengajar</div>
              </div>
            </a>
            <a href="/admin/finances" className="group relative overflow-hidden p-4 bg-white rounded-xl text-center hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">💰</div>
                <div className="text-xs font-black text-purple-800">Kelola Keuangan</div>
              </div>
            </a>
            <a href="/admin/settings" className="group relative overflow-hidden p-4 bg-white rounded-xl text-center hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-transparent hover:border-gray-500">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">⚙️</div>
                <div className="text-xs font-black text-gray-800">Pengaturan</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}