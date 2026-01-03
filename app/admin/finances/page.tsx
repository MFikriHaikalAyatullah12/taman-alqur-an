'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
    date: '', // Will be set when mounted
    payment_method: 'cash',
    reference_number: ''
  });
  const [displayAmount, setDisplayAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize date when component mounts
  useEffect(() => {
    setMounted(true);
    if (!editData) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, []);

  // Format number dengan pemisah ribuan
  const formatNumber = (value: string) => {
    // Hapus semua karakter non-digit
    const numericValue = value.replace(/\D/g, '');
    
    // Format dengan pemisah ribuan
    if (numericValue === '') return '';
    
    return parseInt(numericValue).toLocaleString('id-ID');
  };

  // Handle perubahan input nominal
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Hapus semua karakter non-digit
    const numericValue = inputValue.replace(/\D/g, '');
    
    // Set nilai asli (tanpa format) untuk formData
    setFormData(prev => ({ ...prev, amount: numericValue }));
    
    // Set nilai dengan format untuk display
    setDisplayAmount(formatNumber(numericValue));
  };

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
      setDisplayAmount(formatNumber(editData.amount.toString()));
    } else if (mounted) {
      setFormData({
        type: 'income',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reference_number: ''
      });
      setDisplayAmount('');
    }
    setError('');
  }, [editData, isOpen, mounted]);

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
        setDisplayAmount('');
        
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-semibold">Rp</span>
                </div>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="0"
                  required
                />
              </div>
              {displayAmount && (
                <p className="mt-1 text-xs text-gray-500">
                  {formData.amount ? `Rp ${parseInt(formData.amount).toLocaleString('id-ID')}` : ''}
                </p>
              )}
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
  const [filterYear, setFilterYear] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editData, setEditData] = useState<Finance | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFilterYear(new Date().getFullYear().toString());
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchFinances();
    }
  }, [filterType, filterMonth, filterYear, mounted]);

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
      
      const response = await fetch(`/api/admin/finances?id=${financeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header dengan border dan background
    doc.setFillColor(46, 125, 50); // Hijau gelap
    doc.rect(0, 0, 210, 45, 'F');
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('TPQ AN-NABA', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('LAPORAN KEUANGAN', 105, 28, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const periodText = filterMonth 
      ? `Periode: ${months.find(m => m.value === filterMonth)?.label} ${filterYear}`
      : `Periode: Tahun ${filterYear}`;
    doc.text(periodText, 105, 37, { align: 'center' });
    
    // Summary Box dengan border dan shadow
    const summaryY = 55;
    
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, summaryY, 180, 45, 3, 3, 'F');
    
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, summaryY, 180, 45, 3, 3, 'S');
    
    // Summary Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text('RINGKASAN KEUANGAN', 20, summaryY + 8);
    
    // Summary Content dengan grid
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Pemasukan
    doc.setFont('helvetica', 'bold');
    doc.text('Total Pemasukan:', 20, summaryY + 18);
    doc.setTextColor(46, 125, 50);
    doc.text(`Rp ${summary.income.toLocaleString('id-ID')}`, 70, summaryY + 18);
    
    // Pengeluaran
    doc.setTextColor(60, 60, 60);
    doc.text('Total Pengeluaran:', 20, summaryY + 26);
    doc.setTextColor(220, 38, 38);
    doc.text(`Rp ${summary.expense.toLocaleString('id-ID')}`, 70, summaryY + 26);
    
    // Saldo - dengan background berbeda
    doc.setFillColor(summary.balance >= 0 ? 46 : 220, summary.balance >= 0 ? 125 : 38, summary.balance >= 0 ? 50 : 38);
    doc.roundedRect(15, summaryY + 32, 180, 10, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Saldo Akhir:', 20, summaryY + 39);
    doc.text(`Rp ${summary.balance.toLocaleString('id-ID')}`, 70, summaryY + 39);
    
    // Table title
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAIL TRANSAKSI', 20, summaryY + 55);
    
    // Table data
    const tableData = finances.map((finance, index) => [
      index + 1,
      new Date(finance.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      finance.category,
      finance.type === 'income' 
        ? `Rp ${finance.amount.toLocaleString('id-ID')}`
        : '-',
      finance.type === 'expense' 
        ? `Rp ${finance.amount.toLocaleString('id-ID')}`
        : '-',
      finance.description || '-'
    ]);
    
    // Table dengan styling lebih baik
    autoTable(doc, {
      startY: summaryY + 60,
      head: [['No', 'Tanggal', 'Tipe', 'Kategori', 'Pemasukan', 'Pengeluaran', 'Keterangan']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.1,
        lineColor: [255, 255, 255]
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [60, 60, 60],
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 28, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 35 },
        4: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: [46, 125, 50] },
        5: { cellWidth: 30, halign: 'right', fontStyle: 'bold', textColor: [220, 38, 38] },
        6: { cellWidth: 30 }
      },
      margin: { left: 15, right: 15 },
      didParseCell: function(data) {
        // Highlight income/expense cells
        if (data.column.index === 4 && data.cell.text[0] !== '-') {
          data.cell.styles.fillColor = [240, 253, 244];
        }
        if (data.column.index === 5 && data.cell.text[0] !== '-') {
          data.cell.styles.fillColor = [254, 242, 242];
        }
      }
    });
    
    // Footer dengan signature
    const finalY = (doc as any).lastAutoTable.finalY || summaryY + 60;
    
    // Footer box
    doc.setFillColor(245, 245, 245);
    doc.rect(0, finalY + 10, 210, 70, 'F');
    
    // Date printed
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 15, finalY + 20);
    
    // Signature section with box
    const signatureY = finalY + 30;
    const signatureX = 140;
    
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.3);
    doc.roundedRect(signatureX - 10, signatureY - 5, 60, 45, 2, 2, 'S');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`${new Date().toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    })}`, signatureX + 20, signatureY, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('YANG BERTANDA TANGAN,', signatureX + 20, signatureY + 7, { align: 'center' });
    doc.text('KEPALA TPQ', signatureX + 20, signatureY + 13, { align: 'center' });
    
    // Signature line
    doc.setDrawColor(100, 100, 100);
    doc.line(signatureX, signatureY + 30, signatureX + 40, signatureY + 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('( ..................................................... )', signatureX + 20, signatureY + 35, { align: 'center' });
    
    // Page border
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287, 'S');
    
    // Save PDF
    const fileName = filterMonth 
      ? `Laporan_Keuangan_${months.find(m => m.value === filterMonth)?.label}_${filterYear}.pdf`
      : `Laporan_Keuangan_${filterYear}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    // Prepare data
    const excelData = finances.map((finance, index) => ({
      'No': index + 1,
      'Tanggal': new Date(finance.date).toLocaleDateString('id-ID'),
      'Tipe': finance.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      'Kategori': finance.category,
      'Pemasukan (Rp)': finance.type === 'income' ? finance.amount : '',
      'Pengeluaran (Rp)': finance.type === 'expense' ? finance.amount : '',
      'Keterangan': finance.description || '-',
      'Metode Pembayaran': finance.payment_method || '-'
    }));
    
    // Add summary at the end
    excelData.push({});
    excelData.push({
      'No': '',
      'Tanggal': 'RINGKASAN',
      'Tipe': '',
      'Kategori': '',
      'Pemasukan (Rp)': '',
      'Pengeluaran (Rp)': '',
      'Keterangan': '',
      'Metode Pembayaran': ''
    });
    excelData.push({
      'No': '',
      'Tanggal': 'Total Pemasukan',
      'Tipe': '',
      'Kategori': '',
      'Pemasukan (Rp)': summary.income,
      'Pengeluaran (Rp)': '',
      'Keterangan': '',
      'Metode Pembayaran': ''
    });
    excelData.push({
      'No': '',
      'Tanggal': 'Total Pengeluaran',
      'Tipe': '',
      'Kategori': '',
      'Pemasukan (Rp)': '',
      'Pengeluaran (Rp)': summary.expense,
      'Keterangan': '',
      'Metode Pembayaran': ''
    });
    excelData.push({
      'No': '',
      'Tanggal': 'Saldo Akhir',
      'Tipe': '',
      'Kategori': '',
      'Pemasukan (Rp)': summary.balance,
      'Pengeluaran (Rp)': '',
      'Keterangan': '',
      'Metode Pembayaran': ''
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 15 }, // Tanggal
      { wch: 15 }, // Tipe
      { wch: 25 }, // Kategori
      { wch: 15 }, // Pemasukan
      { wch: 15 }, // Pengeluaran
      { wch: 30 }, // Keterangan
      { wch: 15 }  // Metode Pembayaran
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
    
    // Save file
    const fileName = filterMonth 
      ? `Laporan_Keuangan_${months.find(m => m.value === filterMonth)?.label}_${filterYear}.xlsx`
      : `Laporan_Keuangan_${filterYear}.xlsx`;
    XLSX.writeFile(wb, fileName);
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
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={exportToPDF}
              disabled={finances.length === 0}
              className="flex-1 sm:flex-initial px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              📄 Export PDF
            </button>
            <button 
              onClick={exportToExcel}
              disabled={finances.length === 0}
              className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              📊 Export Excel
            </button>
            <button 
              onClick={() => {
                setEditData(null);
                setIsAddModalOpen(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Tambah
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Pemasukan Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">💰</div>
                  <p className="text-green-100 font-medium">Total Pemasukan</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">
                  Rp {summary.income.toLocaleString('id-ID')}
                </p>
                <p className="text-green-200 text-sm">Bulan {filterMonth ? months.find(m => m.value === filterMonth)?.label : 'Ini'} {filterYear}</p>
              </div>
              <div className="text-4xl opacity-20">📈</div>
            </div>
          </div>
          
          {/* Pengeluaran Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">💸</div>
                  <p className="text-red-100 font-medium">Total Pengeluaran</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">
                  Rp {summary.expense.toLocaleString('id-ID')}
                </p>
                <p className="text-red-200 text-sm">Bulan {filterMonth ? months.find(m => m.value === filterMonth)?.label : 'Ini'} {filterYear}</p>
              </div>
              <div className="text-4xl opacity-20">📉</div>
            </div>
          </div>
          
          {/* Saldo Card */}
          <div className={`bg-gradient-to-br p-6 rounded-xl text-white shadow-lg ${
            summary.balance >= 0 
              ? 'from-blue-500 to-blue-600' 
              : 'from-orange-500 to-orange-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-2xl">{summary.balance >= 0 ? '💎' : '⚠️'}</div>
                  <p className={`font-medium ${
                    summary.balance >= 0 ? 'text-blue-100' : 'text-orange-100'
                  }`}>Saldo Akhir</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-1">
                  Rp {summary.balance.toLocaleString('id-ID')}
                </p>
                <p className={`text-sm ${
                  summary.balance >= 0 ? 'text-blue-200' : 'text-orange-200'
                }`}>
                  {summary.balance >= 0 ? '✅ Surplus' : '⚠️ Defisit'}
                </p>
              </div>
              <div className="text-4xl opacity-20">{summary.balance >= 0 ? '📊' : '⚡'}</div>
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
                  if (mounted) {
                    setFilterYear(new Date().getFullYear().toString());
                  }
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
          {finances.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Keuangan</h3>
              <p className="text-gray-500 mb-4">
                {filterMonth || filterYear !== new Date().getFullYear().toString() 
                  ? 'Tidak ada transaksi untuk periode yang dipilih'
                  : 'Mulai tambahkan transaksi pemasukan dan pengeluaran TPQ'
                }
              </p>
              <button
                onClick={() => {
                  setEditData(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ➕ Tambah Transaksi Pertama
              </button>
            </div>
          ) : (
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
          )}
        </div>

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