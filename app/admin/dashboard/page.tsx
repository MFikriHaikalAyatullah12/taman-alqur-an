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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
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
        setLastRefresh(new Date());
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
      <div className="space-y-6">
        {/* Header dengan tombol refresh */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Ringkasan data TPQ secara realtime</p>
            <p className="text-sm text-gray-500">Terakhir diperbarui: {lastRefresh.toLocaleTimeString('id-ID')}</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            disabled={isLoading}
          >
            <span className={isLoading ? "animate-spin" : ""}>🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Students Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Total Santri</p>
                <p className="text-2xl sm:text-3xl font-bold">{dashboardData?.students.total || 0}</p>
                <p className="text-blue-100 text-xs">Aktif: {dashboardData?.students.active || 0}</p>
              </div>
              <div className="text-2xl sm:text-4xl">👨‍🎓</div>
            </div>
          </div>
          
          {/* Teachers Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total Pengajar</p>
                <p className="text-2xl sm:text-3xl font-bold">{dashboardData?.teachers.total || 0}</p>
                <p className="text-green-100 text-xs">Rata-rata {dashboardData?.teachers.avgExperience || 0} tahun</p>
              </div>
              <div className="text-2xl sm:text-4xl">👨‍🏫</div>
            </div>
          </div>
          
          {/* Income Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 sm:p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Pemasukan Bulan Ini</p>
                <p className="text-lg sm:text-xl font-bold">
                  Rp {(dashboardData?.finances.income || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-purple-100 text-xs">{dashboardData?.finances.transactions || 0} transaksi</p>
              </div>
              <div className="text-2xl sm:text-4xl">💰</div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className={`bg-gradient-to-r p-4 sm:p-6 rounded-lg text-white ${
            (dashboardData?.finances.balance || 0) >= 0 
              ? 'from-teal-500 to-teal-600' 
              : 'from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs sm:text-sm">Saldo Bulan Ini</p>
                <p className="text-lg sm:text-xl font-bold">
                  Rp {(dashboardData?.finances.balance || 0).toLocaleString('id-ID')}
                </p>
                <p className="text-teal-100 text-xs">
                  {(dashboardData?.finances.balance || 0) >= 0 ? 'Surplus' : 'Defisit'}
                </p>
              </div>
              <div className="text-2xl sm:text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Detailed Finance Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Ringkasan Keuangan Bulan Ini</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                Rp {(dashboardData?.finances.income || 0).toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500">Total Pemasukan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                Rp {(dashboardData?.finances.expense || 0).toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500">Total Pengeluaran</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                (dashboardData?.finances.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                Rp {(dashboardData?.finances.balance || 0).toLocaleString('id-ID')}
              </div>
              <div className="text-sm text-gray-500">Saldo Akhir</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Aksi Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/admin/students" className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">👨‍🎓</div>
              <div className="text-sm font-medium text-blue-800">Kelola Santri</div>
            </a>
            <a href="/admin/teachers" className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
              <div className="text-2xl mb-2">👨‍🏫</div>
              <div className="text-sm font-medium text-green-800">Kelola Pengajar</div>
            </a>
            <a href="/admin/finances" className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium text-purple-800">Kelola Keuangan</div>
            </a>
            <a href="/admin/settings" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-gray-800">Pengaturan</div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}