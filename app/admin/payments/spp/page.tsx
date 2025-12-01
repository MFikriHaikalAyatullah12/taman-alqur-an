'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function PaymentsSppPage() {
  const [sppData, setSppData] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'Ahmad Fadhil',
      level: 'Iqra 3',
      monthlyFee: 100000,
      payments: {
        'Jan': 'Lunas',
        'Feb': 'Lunas',
        'Mar': 'Lunas',
        'Apr': 'Lunas',
        'May': 'Lunas',
        'Jun': 'Lunas',
        'Jul': 'Lunas',
        'Aug': 'Lunas',
        'Sep': 'Lunas',
        'Oct': 'Lunas',
        'Nov': 'Lunas',
        'Dec': 'Belum'
      }
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Siti Aisyah',
      level: 'Iqra 5',
      monthlyFee: 100000,
      payments: {
        'Jan': 'Lunas',
        'Feb': 'Lunas',
        'Mar': 'Lunas',
        'Apr': 'Lunas',
        'May': 'Lunas',
        'Jun': 'Lunas',
        'Jul': 'Lunas',
        'Aug': 'Lunas',
        'Sep': 'Lunas',
        'Oct': 'Tertunggak',
        'Nov': 'Tertunggak',
        'Dec': 'Belum'
      }
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Muhammad Rifki',
      level: 'Al-Quran',
      monthlyFee: 120000,
      payments: {
        'Jan': 'Lunas',
        'Feb': 'Lunas',
        'Mar': 'Lunas',
        'Apr': 'Lunas',
        'May': 'Lunas',
        'Jun': 'Lunas',
        'Jul': 'Lunas',
        'Aug': 'Lunas',
        'Sep': 'Lunas',
        'Oct': 'Lunas',
        'Nov': 'Lunas',
        'Dec': 'Belum'
      }
    }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas': return 'bg-green-500';
      case 'Tertunggak': return 'bg-red-500';
      case 'Belum': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'Lunas': return '✓';
      case 'Tertunggak': return '!';
      case 'Belum': return '-';
      default: return '-';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalPaid = (student: any) => {
    return Object.values(student.payments).filter(status => status === 'Lunas').length * student.monthlyFee;
  };

  const calculateTotalArrears = (student: any) => {
    return Object.values(student.payments).filter(status => status === 'Tertunggak').length * student.monthlyFee;
  };

  return (
    <AdminLayout currentPage="/admin/payments/spp">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SPP Santri</h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              💰 Catat Pembayaran
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              📄 Export SPP
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 min-w-[200px]">Santri</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">SPP/Bulan</th>
                    {months.map(month => (
                      <th key={month} className="text-center py-3 px-2 font-semibold text-gray-900 min-w-[40px]">
                        {month}
                      </th>
                    ))}
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sppData.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{student.studentName}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{student.level}</td>
                      <td className="py-3 px-4 text-gray-900">{formatCurrency(student.monthlyFee)}</td>
                      {months.map(month => (
                        <td key={month} className="py-3 px-2 text-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              getPaymentStatusColor(student.payments[month])
                            }`}
                            title={`${month}: ${student.payments[month]}`}
                          >
                            {getPaymentStatusText(student.payments[month])}
                          </div>
                        </td>
                      ))}
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="text-green-600 font-medium">
                            Lunas: {formatCurrency(calculateTotalPaid(student))}
                          </div>
                          {calculateTotalArrears(student) > 0 && (
                            <div className="text-red-600 font-medium">
                              Tunggakan: {formatCurrency(calculateTotalArrears(student))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            📋 Detail
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            💰 Bayar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Keterangan Status</h2>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-600">Lunas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-sm text-gray-600">Tertunggak</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white text-xs font-bold">-</span>
              </div>
              <span className="text-sm text-gray-600">Belum Jatuh Tempo</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(sppData.reduce((sum, student) => sum + calculateTotalPaid(student), 0))}
            </div>
            <div className="text-gray-600">Total Terkumpul</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(sppData.reduce((sum, student) => sum + calculateTotalArrears(student), 0))}
            </div>
            <div className="text-gray-600">Total Tunggakan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{sppData.length}</div>
            <div className="text-gray-600">Total Santri</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {sppData.filter(student => Object.values(student.payments).includes('Tertunggak')).length}
            </div>
            <div className="text-gray-600">Santri Tunggakan</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}