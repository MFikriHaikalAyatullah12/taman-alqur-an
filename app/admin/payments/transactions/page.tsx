'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function PaymentTransactionsPage() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      student: 'Ahmad Fadhil',
      parent: 'Budi Santoso',
      type: 'SPP Bulanan',
      amount: 100000,
      month: 'November 2024',
      status: 'Lunas',
      paymentDate: '2024-11-05',
      method: 'Transfer Bank'
    },
    {
      id: 2,
      student: 'Siti Aisyah',
      parent: 'Dewi Sartika',
      type: 'SPP Bulanan',
      amount: 100000,
      month: 'November 2024',
      status: 'Tertunggak',
      paymentDate: null,
      method: null
    },
    {
      id: 3,
      student: 'Muhammad Rifki',
      parent: 'Agus Wijaya',
      type: 'Biaya Pendaftaran',
      amount: 150000,
      month: null,
      status: 'Lunas',
      paymentDate: '2024-10-15',
      method: 'Cash'
    },
    {
      id: 4,
      student: null,
      parent: 'Sri Mulyani',
      type: 'Donasi',
      amount: 500000,
      month: null,
      status: 'Lunas',
      paymentDate: '2024-11-01',
      method: 'Transfer Bank'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('2024-11');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [newTransaction, setNewTransaction] = useState({
    student: '',
    parent: '',
    type: '',
    amount: 0,
    month: '',
    method: ''
  });

  const filteredTransactions = transactions.filter(transaction => {
    if (statusFilter !== 'all' && transaction.status.toLowerCase() !== statusFilter) return false;
    if (typeFilter !== 'all') {
      const typeMap: { [key: string]: string } = {
        'spp': 'SPP Bulanan',
        'pendaftaran': 'Biaya Pendaftaran',
        'donasi': 'Donasi'
      };
      if (transaction.type !== typeMap[typeFilter]) return false;
    }
    return true;
  });

  const handleAddTransaction = () => {
    const id = Math.max(...transactions.map(t => t.id)) + 1;
    const newTrans = {
      id,
      ...newTransaction,
      status: 'Lunas',
      paymentDate: new Date().toISOString().split('T')[0]
    };
    setTransactions([...transactions, newTrans]);
    setShowAddModal(false);
    setNewTransaction({ student: '', parent: '', type: '', amount: 0, month: '', method: '' });
  };

  const markAsPaid = (id: number) => {
    setTransactions(transactions.map(t => 
      t.id === id 
        ? { ...t, status: 'Lunas', paymentDate: new Date().toISOString().split('T')[0], method: 'Transfer Bank' }
        : t
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas': return 'bg-green-100 text-green-800';
      case 'Tertunggak': return 'bg-red-100 text-red-800';
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout currentPage="/admin/payments/transactions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Pembayaran</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              💰 Tambah Transaksi
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              📄 Export Data
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="lunas">Lunas</option>
            <option value="tertunggak">Tertunggak</option>
            <option value="menunggu">Menunggu Konfirmasi</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Semua Jenis</option>
            <option value="spp">SPP Bulanan</option>
            <option value="pendaftaran">Biaya Pendaftaran</option>
            <option value="donasi">Donasi</option>
          </select>
          <input
            type="month"
            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Santri</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Orang Tua</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Jenis</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Jumlah</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tanggal Bayar</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-gray-900 font-medium">
                          {transaction.student || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{transaction.parent}</td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-medium">{transaction.type}</span>
                          {transaction.month && (
                            <div className="text-sm text-gray-500">{transaction.month}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="text-gray-900">
                            {transaction.paymentDate || '-'}
                          </span>
                          {transaction.method && (
                            <div className="text-sm text-gray-500">{transaction.method}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { setSelectedTransaction(transaction); setShowDetailModal(true); }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📋 Detail
                          </button>
                          {transaction.status === 'Tertunggak' && (
                            <button 
                              onClick={() => markAsPaid(transaction.id)}
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              💰 Bayar
                            </button>
                          )}
                          <button 
                            onClick={() => window.print()}
                            className="text-purple-600 hover:text-purple-800 text-sm"
                          >
                            📝 Cetak
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

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(transactions.filter(t => t.status === 'Lunas').reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <div className="text-gray-600">Total Pemasukan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(transactions.filter(t => t.status === 'Tertunggak').reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <div className="text-gray-600">Total Tunggakan</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{transactions.length}</div>
            <div className="text-gray-600">Total Transaksi</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {transactions.filter(t => t.status === 'Lunas').length}
            </div>
            <div className="text-gray-600">Transaksi Lunas</div>
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Tambah Transaksi Baru</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nama Santri"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.student}
                  onChange={(e) => setNewTransaction({...newTransaction, student: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Nama Orang Tua"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.parent}
                  onChange={(e) => setNewTransaction({...newTransaction, parent: e.target.value})}
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                >
                  <option value="">Pilih Jenis Pembayaran</option>
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Biaya Pendaftaran">Biaya Pendaftaran</option>
                  <option value="Donasi">Donasi</option>
                </select>
                <input
                  type="number"
                  placeholder="Jumlah"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseInt(e.target.value)})}
                />
                <input
                  type="text"
                  placeholder="Bulan/Periode"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.month}
                  onChange={(e) => setNewTransaction({...newTransaction, month: e.target.value})}
                />
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTransaction.method}
                  onChange={(e) => setNewTransaction({...newTransaction, method: e.target.value})}
                >
                  <option value="">Metode Pembayaran</option>
                  <option value="Cash">Cash</option>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddTransaction}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Detail Transaksi</h3>
              <div className="space-y-3">
                <div><strong>ID:</strong> {selectedTransaction.id}</div>
                <div><strong>Santri:</strong> {selectedTransaction.student || '-'}</div>
                <div><strong>Orang Tua:</strong> {selectedTransaction.parent}</div>
                <div><strong>Jenis:</strong> {selectedTransaction.type}</div>
                <div><strong>Jumlah:</strong> {formatCurrency(selectedTransaction.amount)}</div>
                <div><strong>Status:</strong> {selectedTransaction.status}</div>
                <div><strong>Tanggal Bayar:</strong> {selectedTransaction.paymentDate || '-'}</div>
                <div><strong>Metode:</strong> {selectedTransaction.method || '-'}</div>
                {selectedTransaction.month && (
                  <div><strong>Periode:</strong> {selectedTransaction.month}</div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}