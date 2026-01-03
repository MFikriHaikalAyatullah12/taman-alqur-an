'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Schedule {
  id: number;
  title: string;
  description: string;
  activity_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  teacher_in_charge: string;
  participants: string;
  notes: string;
}

interface ScheduleFormData {
  title: string;
  description: string;
  activity_type: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  teacher_in_charge: string;
  participants: string;
  notes: string;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    description: '',
    activity_type: 'Pembelajaran',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    start_time: '08:00',
    end_time: '10:00',
    location: '',
    teacher_in_charge: '',
    participants: '',
    notes: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, [selectedMonth]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `/api/admin/schedules?month=${selectedMonth}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('admin_token');
      const url = '/api/admin/schedules';
      const method = editSchedule ? 'PUT' : 'POST';
      const body = editSchedule 
        ? JSON.stringify({ ...formData, id: editSchedule.id })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        alert(editSchedule ? 'Jadwal berhasil diupdate' : 'Jadwal berhasil ditambahkan');
        setShowAddModal(false);
        setEditSchedule(null);
        resetForm();
        fetchSchedules();
      } else {
        alert('Gagal menyimpan jadwal');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditSchedule(schedule);
    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      activity_type: schedule.activity_type || 'Pembelajaran',
      start_date: schedule.start_date,
      end_date: schedule.end_date || '',
      start_time: schedule.start_time || '08:00',
      end_time: schedule.end_time || '10:00',
      location: schedule.location || '',
      teacher_in_charge: schedule.teacher_in_charge || '',
      participants: schedule.participants || '',
      notes: schedule.notes || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/schedules', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Jadwal berhasil dihapus');
        fetchSchedules();
      } else {
        alert('Gagal menghapus jadwal');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      activity_type: 'Pembelajaran',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      start_time: '08:00',
      end_time: '10:00',
      location: '',
      teacher_in_charge: '',
      participants: '',
      notes: ''
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TPQ AN-NABA', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('JADWAL KEGIATAN', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const monthYear = new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { 
      month: 'long', 
      year: 'numeric' 
    });
    doc.text(`Periode: ${monthYear}`, 105, 32, { align: 'center' });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 36, 190, 36);
    
    // Table data
    const tableData = schedules.map((schedule, index) => [
      index + 1,
      new Date(schedule.start_date).toLocaleDateString('id-ID'),
      schedule.start_time ? schedule.start_time.substring(0, 5) : '-',
      schedule.end_time ? schedule.end_time.substring(0, 5) : '-',
      schedule.title,
      schedule.activity_type || '-',
      schedule.location || '-',
      schedule.teacher_in_charge || '-'
    ]);
    
    // Table
    autoTable(doc, {
      startY: 40,
      head: [['No', 'Tanggal', 'Waktu Mulai', 'Waktu Selesai', 'Kegiatan', 'Jenis', 'Lokasi', 'Penanggung Jawab']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 35 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
        7: { cellWidth: 30 }
      },
      margin: { left: 10, right: 10 }
    });
    
    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 105, finalY + 10, { align: 'center' });
    
    // Signature section
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Mengetahui,', 140, finalY + 20);
    doc.text('Kepala TPQ AN-NABA', 140, finalY + 25);
    
    doc.text('(_____________________)', 140, finalY + 45);
    
    // Save PDF
    doc.save(`Jadwal_Kegiatan_${monthYear.replace(' ', '_')}.pdf`);
  };

  const activityTypes = [
    'Pembelajaran',
    'Hafalan',
    'Ujian',
    'Kegiatan Khusus',
    'Rapat',
    'Pelatihan',
    'Lainnya'
  ];

  return (
    <AdminLayout currentPage="/admin/schedules">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📅 Penjadwalan Kegiatan</h1>
            <p className="text-gray-600">Kelola jadwal dan kegiatan TPQ</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              disabled={schedules.length === 0}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              📄 Export PDF
            </button>
            <button
              onClick={() => {
                setEditSchedule(null);
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              ➕ Tambah Jadwal
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Pilih Bulan:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <div className="ml-auto text-sm text-gray-600">
              Total: <span className="font-bold">{schedules.length}</span> jadwal
            </div>
          </div>
        </div>

        {/* Schedules List */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : schedules.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{schedule.title}</h3>
                      <p className="text-sm text-blue-100">{schedule.activity_type}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                      {new Date(schedule.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {schedule.description && (
                    <p className="text-sm text-gray-600">{schedule.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">⏰ Waktu:</span>
                      <p className="font-medium text-gray-900">
                        {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                      </p>
                    </div>
                    {schedule.location && (
                      <div>
                        <span className="text-gray-500">📍 Lokasi:</span>
                        <p className="font-medium text-gray-900">{schedule.location}</p>
                      </div>
                    )}
                    {schedule.teacher_in_charge && (
                      <div>
                        <span className="text-gray-500">👨‍🏫 Penanggung Jawab:</span>
                        <p className="font-medium text-gray-900">{schedule.teacher_in_charge}</p>
                      </div>
                    )}
                    {schedule.participants && (
                      <div>
                        <span className="text-gray-500">👥 Peserta:</span>
                        <p className="font-medium text-gray-900">{schedule.participants}</p>
                      </div>
                    )}
                  </div>
                  
                  {schedule.notes && (
                    <div className="pt-3 border-t">
                      <span className="text-xs text-gray-500">📝 Catatan:</span>
                      <p className="text-sm text-gray-600">{schedule.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Jadwal</h3>
            <p className="text-gray-600 mb-4">Tambahkan jadwal kegiatan untuk bulan ini</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              ➕ Tambah Jadwal Pertama
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editSchedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditSchedule(null);
                    resetForm();
                  }} 
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Kegiatan *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Contoh: Pembelajaran Tahfidz"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kegiatan</label>
                    <select
                      value={formData.activity_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, activity_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      {activityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Contoh: Ruang Kelas A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Selesai</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Penanggung Jawab</label>
                    <input
                      type="text"
                      value={formData.teacher_in_charge}
                      onChange={(e) => setFormData(prev => ({ ...prev, teacher_in_charge: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Nama pengajar/penanggung jawab"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peserta</label>
                    <input
                      type="text"
                      value={formData.participants}
                      onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Contoh: Semua Santri, Kelas A, dll"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Detail kegiatan..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Catatan tambahan..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditSchedule(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {editSchedule ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
