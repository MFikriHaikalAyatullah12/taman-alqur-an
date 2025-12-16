'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Class {
  id: number;
  name: string;
  teacher_in_charge: string;
  description: string;
  is_active: boolean;
  student_count: number;
  created_at: string;
}

interface ClassFormData {
  name: string;
  teacher_in_charge: string;
  description: string;
}

const ClassModal = ({ 
  isOpen, 
  onClose, 
  onClassSaved,
  editClass
}: { 
  isOpen: boolean;
  onClose: () => void;
  onClassSaved: () => void;
  editClass?: Class | null;
}) => {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    teacher_in_charge: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editClass) {
      setFormData({
        name: editClass.name,
        teacher_in_charge: editClass.teacher_in_charge || '',
        description: editClass.description || ''
      });
    } else {
      resetForm();
    }
  }, [editClass, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      teacher_in_charge: '',
      description: ''
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = '/api/admin/classes';
      const method = editClass ? 'PUT' : 'POST';
      const body = editClass 
        ? JSON.stringify({ ...formData, classId: editClass.id, is_active: editClass.is_active })
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
        resetForm();
        onClassSaved();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal menyimpan kelas');
      }
    } catch (error) {
      console.error('Error saving class:', error);
      setError('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editClass ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nama Kelas *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Contoh: Kelas A, Kelas Iqro 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Penanggung Jawab / Ustadz
            </label>
            <input
              type="text"
              value={formData.teacher_in_charge}
              onChange={(e) => setFormData(prev => ({ ...prev, teacher_in_charge: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Nama ustadz/ustadzah yang mengajar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Deskripsi singkat tentang kelas ini"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      } else {
        console.error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassSaved = () => {
    fetchClasses();
    setEditClass(null);
  };

  const handleEditClass = (classItem: Class) => {
    setEditClass(classItem);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId: number, className: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas "${className}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/classes', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ classId })
      });

      if (response.ok) {
        setClasses(prev => prev.filter(c => c.id !== classId));
        alert(`Kelas ${className} berhasil dihapus`);
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menghapus kelas');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleToggleActive = async (classItem: Class) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/classes', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          classId: classItem.id,
          name: classItem.name,
          teacher_in_charge: classItem.teacher_in_charge,
          description: classItem.description,
          is_active: !classItem.is_active
        })
      });

      if (response.ok) {
        fetchClasses();
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengubah status kelas');
      }
    } catch (error) {
      console.error('Error toggling class status:', error);
      alert('Terjadi kesalahan');
    }
  };

  const filteredClasses = classes.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.teacher_in_charge && c.teacher_in_charge.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout currentPage="/admin/students">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🏫 Kelola Kelas</h1>
            <p className="text-gray-600">Manajemen kelas dan ruang belajar TPQ</p>
          </div>
          <button
            onClick={() => {
              setEditClass(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
          >
            + Tambah Kelas Baru
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Cari nama kelas atau ustadz..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'Kelas Tidak Ditemukan' : 'Belum Ada Kelas'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Coba gunakan kata kunci lain' : 'Buat kelas pertama untuk mulai mengelola santri'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                + Buat Kelas Pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
              >
                {/* Header dengan warna */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{classItem.name}</h3>
                    <button
                      onClick={() => handleToggleActive(classItem)}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        classItem.is_active 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      {classItem.is_active ? '✓ Aktif' : 'Nonaktif'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100">
                    <span>👨‍🏫</span>
                    <span className="text-sm">{classItem.teacher_in_charge || 'Belum ada penanggung jawab'}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  {classItem.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{classItem.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👨‍🎓</span>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{classItem.student_count}</p>
                        <p className="text-xs text-gray-500">Santri</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      Dibuat: {new Date(classItem.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = `/admin/students/classes/${classItem.id}`}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      📋 Kelola
                    </button>
                    <button
                      onClick={() => handleEditClass(classItem)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.id, classItem.name)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditClass(null);
        }}
        onClassSaved={handleClassSaved}
        editClass={editClass}
      />
    </AdminLayout>
  );
}
