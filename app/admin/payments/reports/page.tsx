'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface ReportData {
  month: string;
  sppIncome: number;
  donationsIncome: number;
  totalIncome: number;
  operationalExpense: number;
  teacherSalary: number;
  maintenanceExpense: number;
  totalExpense: number;
  netIncome: number;
}

export default function PaymentReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const monthlyData: ReportData[] = [
    {
      month: 'Januari',
      sppIncome: 15000000,
      donationsIncome: 2500000,
      totalIncome: 17500000,
      operationalExpense: 3000000,
      teacherSalary: 8000000,
      maintenanceExpense: 1500000,
      totalExpense: 12500000,
      netIncome: 5000000
    },
    {
      month: 'Februari',
      sppIncome: 14500000,
      donationsIncome: 1800000,
      totalIncome: 16300000,
      operationalExpense: 2800000,
      teacherSalary: 8000000,
      maintenanceExpense: 2000000,
      totalExpense: 12800000,
      netIncome: 3500000
    },
    {
      month: 'Maret',
      sppIncome: 15500000,
      donationsIncome: 3200000,
      totalIncome: 18700000,
      operationalExpense: 3200000,
      teacherSalary: 8000000,
      maintenanceExpense: 1000000,
      totalExpense: 12200000,
      netIncome: 6500000
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const totalSppIncome = monthlyData.reduce((sum, data) => sum + data.sppIncome, 0);
  const totalDonationsIncome = monthlyData.reduce((sum, data) => sum + data.donationsIncome, 0);
  const totalIncome = monthlyData.reduce((sum, data) => sum + data.totalIncome, 0);
  const totalExpense = monthlyData.reduce((sum, data) => sum + data.totalExpense, 0);
  const totalNetIncome = monthlyData.reduce((sum, data) => sum + data.netIncome, 0);

  const downloadReport = (format: 'pdf' | 'excel') => {
    // Implementation for downloading reports
    console.log(`Downloading ${format} report for ${selectedYear}`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <div className="flex gap-2">
            <button
              onClick={() => downloadReport('pdf')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Download PDF
            </button>
            <button
              onClick={() => downloadReport('excel')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Periode</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Bulanan</option>
                <option value="quarterly">Triwulan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Pemasukan</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            <div className="text-sm text-gray-500 mt-2">
              <div>SPP: {formatCurrency(totalSppIncome)}</div>
              <div>Donasi: {formatCurrency(totalDonationsIncome)}</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Pengeluaran</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Keuntungan Bersih</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalNetIncome)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Margin Keuntungan</h3>
            <p className="text-2xl font-bold text-purple-600">
              {((totalNetIncome / totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Financial Report Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Laporan Keuangan {selectedYear}</h2>
            <p className="text-gray-600 text-sm mt-1">
              Rincian pemasukan dan pengeluaran per bulan
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bulan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SPP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pemasukan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengeluaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keuntungan Bersih
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyData.map((data) => (
                  <tr key={data.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(data.sppIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(data.donationsIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(data.totalIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(data.totalExpense)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {formatCurrency(data.netIncome)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    TOTAL
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(totalSppIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatCurrency(totalDonationsIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                    {formatCurrency(totalExpense)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {formatCurrency(totalNetIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rincian Pengeluaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(monthlyData.reduce((sum, data) => sum + data.operationalExpense, 0))}
              </div>
              <div className="text-gray-600">Operasional</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(monthlyData.reduce((sum, data) => sum + data.teacherSalary, 0))}
              </div>
              <div className="text-gray-600">Gaji Guru</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(monthlyData.reduce((sum, data) => sum + data.maintenanceExpense, 0))}
              </div>
              <div className="text-gray-600">Pemeliharaan</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}