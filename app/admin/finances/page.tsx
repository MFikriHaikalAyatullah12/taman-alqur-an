'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Finance {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  payment_method?: string;
  reference_number?: string;
  created_at: string;
}

interface Summary {
  income: number;
  expense: number;
  balance: number;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (finance: Finance) => void;
  editData?: Finance | null;
}

function AddFinanceModal({ isOpen, onClose, onSave, editData }: AddModalProps) {
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_number: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const incomeCategories = [
    'SPP/Biaya Pendidikan',
    'Donasi',
    'Infaq',
    'Zakat',
    'Sedekah',
    'Acara/Event',
    'Penjualan',
    'Hibah',
    'Lain-lain'
  ];

  const expenseCategories = [
    'Gaji Guru/Staff',
    'Biaya Operasional',
    'Listrik & Air',
    'Internet & Telepon',
    'Alat Tulis Kantor',
    'Buku & Materi',
    'Kebersihan',
    'Transportasi',
    'Pemeliharaan',
    'Konsumsi',
    'Acara/Event',
    'Lain-lain'
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type,
        category: editData.category,
        amount: editData.amount.toString(),
        description: editData.description || '',
        date: editData.date,
        payment_method: editData.payment_method || 'cash',
        reference_number: editData.reference_number || ''
      });
    } else {
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reference_number: ''
      });
    }
    setError('');
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Validasi
      if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0) {
        setError('Kategori dan jumlah wajib diisi dengan benar');
        setIsSaving(false);
        return;
      }

      const token = localStorage.getItem('admin_token');
      if (!token) {
        setError('Anda harus login terlebih dahulu');
        setIsSaving(false);
        return;
      }

      const url = '/api/admin/finances';
      const method = editData ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        ...(editData ? { id: editData.id } : {})
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        // Panggil onSave dengan data yang berhasil disimpan
        onSave(result.data);
        
        // Reset form
        setFormData({
          type: 'income',
          category: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          payment_method: 'cash',
          reference_number: ''
        });
        
        // Tutup modal
        onClose();
        
        // Tampilkan pesan sukses
        alert(result.message || `Data ${formData.type === 'income' ? 'pemasukan' : 'pengeluaran'} berhasil disimpan`);
      } else {
        setError(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving finance:', error);
      setError('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Edit Data Keuangan' : 'Tambah Data Keuangan'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'income' | 'expense',
                  category: '' // Reset category when changing type
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value="income">💰 Pemasukan</option>
                <option value="expense">💸 Pengeluaran</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value="">Pilih Kategori</option>
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="cash">💵 Tunai</option>
                <option value="transfer">🏦 Transfer Bank</option>
                <option value="ewallet">📱 E-Wallet</option>
                <option value="check">📝 Cek</option>
                <option value="other">🔄 Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. Referensi</label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="No. transaksi/kwitansi/nota"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Keterangan tambahan (opsional)..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 ${
                formData.type === 'income' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isSaving ? 'Menyimpan...' : (editData ? 'Perbarui' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminFinancesPage() {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState<Finance | null>(null);

  useEffect(() => {
    fetchFinances();
  }, [filterType, filterMonth, filterYear]);

  const fetchFinances = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        type: filterType,
        ...(filterMonth && { month: filterMonth }),
        ...(filterYear && { year: filterYear })
      });

      const response = await fetch(`/api/admin/finances?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setFinances(result.data || []);
        setSummary(result.summary || { income: 0, expense: 0, balance: 0 });
      } else {
        console.error('Failed to fetch finances');
      }
    } catch (error) {
      console.error('Error fetching finances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFinance = async (financeId: number, description: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus transaksi "${description}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      
      // Simpan data yang akan dihapus untuk update summary
      const financeToDelete = finances.find(f => f.id === financeId);
      
      const response = await fetch('/api/admin/finances', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ financeId })
      });

      if (response.ok) {
        // Update list secara realtime
        setFinances(prev => prev.filter(finance => finance.id !== financeId));
        
        // Update summary secara realtime
        if (financeToDelete) {
          setSummary(prev => {
            const income = financeToDelete.type === 'income' 
              ? prev.income - financeToDelete.amount 
              : prev.income;
            const expense = financeToDelete.type === 'expense' 
              ? prev.expense - financeToDelete.amount 
              : prev.expense;
            
            return {
              income,
              expense,
              balance: income - expense
            };
          });
        }
        
        alert('Data keuangan berhasil dihapus');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error deleting finance:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleSaveFinance = async (savedFinance: Finance) => {
    // Update data segera (optimistic update)
    if (editData) {
      // Edit existing
      setFinances(prev => prev.map(f => f.id === savedFinance.id ? savedFinance : f));
      
      // Update summary secara realtime untuk edit
      const oldAmount = editData.amount;
      const newAmount = savedFinance.amount;
      const oldType = editData.type;
      const newType = savedFinance.type;
      
      setSummary(prev => {
        let income = prev.income;
        let expense = prev.expense;
        
        // Remove old amount
        if (oldType === 'income') {
          income -= oldAmount;
        } else {
          expense -= oldAmount;
        }
        
        // Add new amount
        if (newType === 'income') {
          income += newAmount;
        } else {
          expense += newAmount;
        }
        
        return {
          income,
          expense,
          balance: income - expense
        };
      });
    } else {
      // Add new
      setFinances(prev => [savedFinance, ...prev]);
      
      // Update summary secara realtime untuk add
      setSummary(prev => {
        const income = savedFinance.type === 'income' 
          ? prev.income + savedFinance.amount 
          : prev.income;
        const expense = savedFinance.type === 'expense' 
          ? prev.expense + savedFinance.amount 
          : prev.expense;
        
        return {
          income,
          expense,
          balance: income - expense
        };
      });
    }
    
    setEditData(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    return type === 'income' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getTypeIcon = (type: string) => {
    return type === 'income' ? '📈' : '📉';
  };

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' }
  ];

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/finances">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/finances">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Keuangan</h1>
            <p className="text-gray-600">Kelola pemasukan dan pengeluaran TPQ</p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button 
              onClick={() => {
                setEditData(null);
                setIsAddModalOpen(true);
              }}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors btn-touch"
            >
              ➕ Tambah Transaksi
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Total Pemasukan</p>
                <p className="text-xl sm:text-3xl font-bold">{formatCurrency(summary.income)}</p>
              </div>
              <div className="text-2xl sm:text-4xl">📈</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs sm:text-sm">Total Pengeluaran</p>
                <p className="text-xl sm:text-3xl font-bold">{formatCurrency(summary.expense)}</p>
              </div>
              <div className="text-2xl sm:text-4xl">📉</div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r p-4 sm:p-6 rounded-lg text-white ${
            summary.balance >= 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm">Saldo</p>
                <p className="text-xl sm:text-3xl font-bold">{formatCurrency(summary.balance)}</p>
              </div>
              <div className="text-2xl sm:text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="all">Semua</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Semua Bulan</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterType('all');
                  setFilterMonth('');
                  setFilterYear(new Date().getFullYear().toString());
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Finance Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal & Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {finances.map((finance) => (
                  <tr key={finance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getTypeIcon(finance.type)}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(finance.type)}`}>
                            {finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{finance.category}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(finance.date).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {finance.description || '-'}
                      </div>
                      {finance.reference_number && (
                        <div className="text-xs text-gray-500">
                          Ref: {finance.reference_number}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-lg font-semibold ${
                        finance.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {finance.type === 'income' ? '+' : '-'}{formatCurrency(finance.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {finance.payment_method === 'cash' && '💵 Tunai'}
                        {finance.payment_method === 'transfer' && '🏦 Transfer'}
                        {finance.payment_method === 'ewallet' && '📱 E-Wallet'}
                        {finance.payment_method === 'check' && '📝 Cek'}
                        {finance.payment_method === 'other' && '🔄 Lainnya'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => {
                          setEditData(finance);
                          setIsAddModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteFinance(finance.id, finance.category)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {finances.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada data keuangan</h3>
            <p className="text-gray-600">Mulai dengan menambahkan transaksi pertama Anda</p>
          </div>
        )}

        <AddFinanceModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditData(null);
          }}
          onSave={handleSaveFinance}
          editData={editData}
        />
      </div>
    </AdminLayout>
  );
}