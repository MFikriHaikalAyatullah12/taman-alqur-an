'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Teacher {
  id: number;
  name: string;
  specialization: string;
}

interface Class {
  id: number;
  name: string;
}

interface Material {
  id: number;
  teacher_id: number;
  teacher_name: string;
  material_date: string;
  material_topic: string;
  material_description: string;
  class_name: string;
  duration_minutes: number;
}

interface MaterialFormData {
  teacher_id: number;
  material_date: string;
  material_topic: string;
  material_description: string;
  class_name: string;
  duration_minutes: number;
}

export default function TeacherMaterialsPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<MaterialFormData>({
    teacher_id: 0,
    material_date: new Date().toISOString().split('T')[0],
    material_topic: '',
    material_description: '',
    class_name: '',
    duration_minutes: 60
  });

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchMaterials();
    }
  }, [selectedTeacher, selectedMonth]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const teacherList = data.teachers || [];
        setTeachers(teacherList);
        if (teacherList.length > 0 && !selectedTeacher) {
          setSelectedTeacher(teacherList[0].id);
          setFormData(prev => ({ ...prev, teacher_id: teacherList[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchMaterials = async () => {
    if (!selectedTeacher) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `/api/admin/teacher-materials?teacher_id=${selectedTeacher}&month=${selectedMonth}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMaterials(data.materials || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teacher-materials', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          teacher_id: selectedTeacher
        }),
      });

      if (response.ok) {
        alert('Materi berhasil ditambahkan');
        setShowAddModal(false);
        setFormData({
          teacher_id: selectedTeacher || 0,
          material_date: new Date().toISOString().split('T')[0],
          material_topic: '',
          material_description: '',
          class_name: '',
          duration_minutes: 60
        });
        fetchMaterials();
      } else {
        alert('Gagal menambahkan materi');
      }
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!confirm('Yakin ingin menghapus materi ini?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/teacher-materials', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ material_id: materialId }),
      });

      if (response.ok) {
        alert('Materi berhasil dihapus');
        fetchMaterials();
      } else {
        alert('Gagal menghapus materi');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <AdminLayout currentPage="/admin/teachers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📚 Materi Pengajar</h1>
            <p className="text-gray-600">Kelola materi yang diajarkan oleh pengajar</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            ← Kembali
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pengajar</label>
              <select
                value={selectedTeacher || ''}
                onChange={(e) => {
                  const teacherId = parseInt(e.target.value);
                  setSelectedTeacher(teacherId);
                  setFormData(prev => ({ ...prev, teacher_id: teacherId }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowAddModal(true)}
                disabled={!selectedTeacher}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                ➕ Tambah Materi
              </button>
            </div>
          </div>
        </div>

        {/* Materials List */}
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : materials.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tanggal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Topik Materi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Deskripsi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kelas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Durasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(material.material_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {material.material_topic}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {material.material_description || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {material.class_name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {material.duration_minutes} menit
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                Total: <span className="font-bold">{materials.length}</span> materi pada bulan ini
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Materi</h3>
            <p className="text-gray-600 mb-4">
              Tambahkan materi yang diajarkan untuk bulan yang dipilih
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!selectedTeacher}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              ➕ Tambah Materi Pertama
            </button>
          </div>
        )}

        {/* Add Material Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tambah Materi Baru</h2>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                  <input
                    type="date"
                    value={formData.material_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topik Materi *</label>
                  <input
                    type="text"
                    value={formData.material_topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Contoh: Hafalan Juz 30, Tajwid Mad"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.material_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, material_description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Detail materi yang diajarkan..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kelas</label>
                    <select
                      value={formData.class_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, class_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durasi (menit)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      min="15"
                      step="15"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Simpan
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
