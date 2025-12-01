'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Donation {
  id: string;
  donorName: string;
  donorContact: string;
  amount: number;
  type: 'infaq' | 'zakat' | 'wakaf' | 'general';
  purpose: string;
  date: string;
  status: 'pending' | 'confirmed' | 'used';
  note?: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: 'D001',
      donorName: 'Bapak Ahmad',
      donorContact: '081234567890',
      amount: 500000,
      type: 'infaq',
      purpose: 'Renovasi Masjid',
      date: '2024-01-15',
      status: 'confirmed',
      note: 'Untuk perbaikan atap'
    },
    {
      id: 'D002',
      donorName: 'Ibu Siti',
      donorContact: 'siti@email.com',
      amount: 200000,
      type: 'zakat',
      purpose: 'Bantuan Anak Yatim',
      date: '2024-01-10',
      status: 'used',
      note: 'Sudah disalurkan untuk 5 anak'
    },
    {
      id: 'D003',
      donorName: 'Donatur Anonim',
      donorContact: '-',
      amount: 1000000,
      type: 'wakaf',
      purpose: 'Pembangunan Perpustakaan',
      date: '2024-01-05',
      status: 'pending',
      note: 'Menunggu konfirmasi transfer'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredDonations = selectedType === 'all' 
    ? donations 
    : donations.filter(donation => donation.type === selectedType);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'infaq': return 'Infaq';
      case 'zakat': return 'Zakat';
      case 'wakaf': return 'Wakaf';
      case 'general': return 'Donasi Umum';
      default: return type;
    }
  };

  const totalAmount = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const confirmedAmount = filteredDonations
    .filter(d => d.status === 'confirmed' || d.status === 'used')
    .reduce((sum, donation) => sum + donation.amount, 0);
  const usedAmount = filteredDonations
    .filter(d => d.status === 'used')
    .reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manajemen Donasi</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tambah Donasi
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Donasi</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Donasi Terkonfirmasi</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(confirmedAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Donasi Tersalurkan</h3>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(usedAmount)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Saldo Tersisa</h3>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(confirmedAmount - usedAmount)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="font-medium">Filter Jenis:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis</option>
              <option value="infaq">Infaq</option>
              <option value="zakat">Zakat</option>
              <option value="wakaf">Wakaf</option>
              <option value="general">Donasi Umum</option>
            </select>
          </div>
        </div>

        {/* Add Donation Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4">
              <h2 className="text-lg font-bold mb-3">Tambah Donasi Baru</h2>
              <form className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Donatur</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Masukkan nama donatur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Kontak</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="No. telp atau email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Donasi</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                      <option value="infaq">Infaq</option>
                      <option value="zakat">Zakat</option>
                      <option value="wakaf">Wakaf</option>
                      <option value="general">Donasi Umum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jumlah</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Masukkan jumlah donasi"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tujuan</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Tujuan donasi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catatan</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                    placeholder="Catatan tambahan (opsional)"
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Daftar Donasi</h2>
            <p className="text-gray-600 text-sm mt-1">
              Total: {filteredDonations.length} donasi
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donatur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tujuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {donation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeLabel(donation.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(donation.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {donation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        {donation.status === 'pending' ? 'Menunggu' : 
                         donation.status === 'confirmed' ? 'Terkonfirmasi' : 
                         'Tersalurkan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Konfirmasi
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}