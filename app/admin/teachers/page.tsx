'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Image from 'next/image';

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience_years: number;
  education: string;
  status: string;
  bio: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
}

interface EditModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
}

const AddTeacherModal = ({ isOpen, onClose, onSave }: AddModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience_years: 0,
    education: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
        setFormData({
          name: '',
          email: '',
          phone: '',
          specialization: '',
          experience_years: 0,
          education: '',
          bio: ''
        });
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menambahkan pengajar');
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tambah Pengajar Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Pilih Spesialisasi</option>
                <option value="Tahfidz">Tahfidz</option>
                <option value="Tilawah">Tilawah</option>
                <option value="Tajwid">Tajwid</option>
                <option value="Fiqh">Fiqh</option>
                <option value="Akhlak">Akhlak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman (Tahun)</label>
              <input
                type="number"
                value={formData.experience_years}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Contoh: S1 Pendidikan Agama Islam"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografi</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Ceritakan tentang latar belakang dan keahlian pengajar..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Tambah Pengajar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditTeacherModal = ({ teacher, isOpen, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
    }
  }, [teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/teachers/${teacher?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengupdate pengajar');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Pengajar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
              <select
                value={formData.specialization || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Pilih Spesialisasi</option>
                <option value="Tahfidz">Tahfidz</option>
                <option value="Tilawah">Tilawah</option>
                <option value="Tajwid">Tajwid</option>
                <option value="Fiqh">Fiqh</option>
                <option value="Akhlak">Akhlak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pengalaman (Tahun)</label>
              <input
                type="number"
                value={formData.experience_years || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
              <input
                type="text"
                value={formData.education || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Contoh: S1 Pendidikan Agama Islam"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografi</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Ceritakan tentang latar belakang dan keahlian pengajar..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teachers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTeachers(result.data || []);
      } else {
        console.error('Failed to fetch teachers');
        // Fallback to mock data if API fails
        setTeachers([
          {
            id: 1,
            name: 'Ahmad Rahman',
            email: 'ahmad@email.com',
            phone: '081234567890',
            specialization: 'Tahfidz',
            experience_years: 5,
            education: 'S1 Pendidikan Agama Islam',
            status: 'Aktif',
            bio: 'Pengajar berpengalaman dalam bidang tahfidz dan tilawah'
          },
          {
            id: 2,
            name: 'Fatimah Ali',
            email: 'fatimah@email.com',
            phone: '081987654321',
            specialization: 'Tajwid',
            experience_years: 3,
            education: 'S1 Pendidikan Agama Islam',
            status: 'Aktif',
            bio: 'Ahli dalam mengajarkan tajwid dan qiraah'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers(prev => [newTeacher, ...prev]);
    fetchTeachers(); // Refresh list from server
  };

  const handleEditTeacher = (updatedTeacher: Teacher) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === updatedTeacher.id ? updatedTeacher : teacher
    ));
    fetchTeachers(); // Refresh list from server
  };

  const handleDeleteTeacher = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengajar ini?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/admin/teachers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setTeachers(teachers.filter(teacher => teacher.id !== id));
        } else {
          const error = await response.json();
          alert(error.error || 'Gagal menghapus pengajar');
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Terjadi kesalahan');
      }
    }
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTeacher(null);
  };

  return (
    <AdminLayout currentPage="/admin/teachers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengajar</h1>
            <p className="text-gray-600">Kelola data pengajar TPQ AN-NABA</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Tambah Pengajar</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau spesialisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Teachers Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">{filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <span className="text-base sm:text-lg font-bold text-white">
                        {teacher.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">{teacher.name}</h3>
                    <p className="text-blue-100 text-xs sm:text-sm truncate">{teacher.education}</p>
                  </div>
                  <div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      teacher.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-4 sm:px-6 py-4 space-y-3 sm:space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <span className="text-gray-400">📧</span>
                    <span className="text-gray-600 truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <span className="text-gray-400">📞</span>
                    <span className="text-gray-600">{teacher.phone}</span>
                  </div>
                </div>

                {/* Specialization */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-500">Spesialisasi:</span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {teacher.specialization}
                  </span>
                </div>

                {/* Experience */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-500">Pengalaman:</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    🎓 {teacher.experience_years} tahun
                  </span>
                </div>

                {/* Bio */}
                {teacher.bio && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600 line-clamp-2">{teacher.bio}</p>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(teacher)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>🗑️</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada data pengajar</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan pengajar pertama Anda</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Tambah Pengajar
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pengajar</p>
                <p className="text-2xl font-bold text-blue-600">{teachers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pengajar Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {teachers.filter(t => t.status === 'Aktif').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rata-rata Pengalaman</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teachers.length > 0 ? Math.round(teachers.reduce((sum, t) => sum + t.experience_years, 0) / teachers.length) : 0} tahun
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddTeacherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTeacher}
      />

      <EditTeacherModal
        teacher={selectedTeacher}
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSave={handleEditTeacher}
      />
    </AdminLayout>
  );
}
