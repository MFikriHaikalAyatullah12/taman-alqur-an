'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Achievement {
  id: number;
  title: string;
  year: string;
  category: string;
  description: string;
}

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    year: '', // Will be set when mounted
    category: '',
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const categories = ['Kompetisi', 'Institusional', 'Penghargaan', 'Prestasi Santri', 'Akreditasi', 'Sertifikasi'];

  useEffect(() => {
    setMounted(true);
    // Set default year when component mounts
    setFormData(prev => ({
      ...prev,
      year: new Date().getFullYear().toString()
    }));
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Anda harus login terlebih dahulu');
        return;
      }

      const response = await fetch('/api/admin/achievements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok) {
        setAchievements(result.data);
      } else {
        console.error('Failed to fetch achievements:', result.error);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <AdminLayout currentPage="/admin/profile/achievements">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const handleAdd = () => {
    setEditingAchievement(null);
    setFormData({
      title: '',
      year: mounted ? new Date().getFullYear().toString() : '',
      category: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      year: achievement.year,
      category: achievement.category,
      description: achievement.description
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Anda harus login terlebih dahulu');
        return;
      }

      const url = '/api/admin/achievements';
      const method = editingAchievement ? 'PUT' : 'POST';
      const payload = editingAchievement 
        ? { id: editingAchievement.id, ...formData }
        : formData;

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
        alert(result.message);
        await fetchAchievements(); // Refresh data
        setShowModal(false);
      } else {
        alert(result.error || 'Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Anda harus login terlebih dahulu');
        return;
      }

      const response = await fetch(`/api/admin/achievements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        await fetchAchievements(); // Refresh data
        setShowDeleteConfirm(null);
      } else {
        alert(result.error || 'Gagal menghapus prestasi');
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
      alert('Terjadi kesalahan saat menghapus prestasi');
    }
  };

  return (
    <AdminLayout currentPage="/admin/profile/achievements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Prestasi TPQ</h1>
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            🏆 Tambah Prestasi
          </button>
        </div>

        <div className="grid gap-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🏆</span>
                    <h3 className="font-bold text-xl text-gray-900">{achievement.title}</h3>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium mb-2">{achievement.category}</p>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => handleEdit(achievement)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(achievement.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingAchievement ? '✏️ Edit Prestasi' : '🏆 Tambah Prestasi'}
                </h2>
                <p className="text-yellow-100 text-sm mt-1">
                  {editingAchievement ? 'Ubah informasi prestasi TPQ' : 'Tambahkan prestasi baru TPQ'}
                </p>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏆 Judul Prestasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: Juara 1 Lomba MTQ Tingkat Kecamatan"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📅 Tahun <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        📋 Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Deskripsi Prestasi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                      placeholder="Jelaskan detail prestasi yang diraih..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.title || !formData.year || !formData.category || !formData.description}
                  className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  💾 {editingAchievement ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🗑️ Konfirmasi Hapus
                </h2>
                <p className="text-red-100 text-sm mt-1">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Apakah Anda yakin ingin menghapus prestasi ini?</p>
                    <p className="text-gray-600 text-sm mt-1">Data yang dihapus tidak dapat dikembalikan</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}