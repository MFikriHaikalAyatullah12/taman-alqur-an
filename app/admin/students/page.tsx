'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Student {
  id: number;
  name: string;
  birth_place: string;
  birth_date: string;
  parent_name: string;
  parent_phone: string;
  status: string;
  class_id?: number;
  class_name?: string;
  created_at: string;
}

interface Class {
  id: number;
  name: string;
  teacher_in_charge: string;
  student_count: number;
}

interface FormData {
  name: string;
  birth_place: string;
  birth_date: string;
  parent_name: string;
  parent_phone: string;
  class_id: string;
}

const AddStudentModal = ({ 
  isOpen, 
  onClose, 
  onStudentAdded,
  classes
}: { 
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
  classes: Class[];
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birth_place: '',
    birth_date: '',
    parent_name: '',
    parent_phone: '',
    class_id: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      birth_place: '',
      birth_date: '',
      parent_name: '',
      parent_phone: '',
      class_id: ''
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          class_id: formData.class_id || null
        }),
      });

      if (response.ok) {
        resetForm();
        onStudentAdded();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Gagal menambahkan santri');
      }
    } catch (error) {
      console.error('Error saving student:', error);
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
          <h2 className="text-2xl font-bold text-gray-900">Tambah Santri Baru</h2>
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
            <label className="block text-sm font-medium text-black mb-2">Nama Santri *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Masukkan nama lengkap santri"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Kelas</label>
            <select
              value={formData.class_id}
              onChange={(e) => setFormData(prev => ({ ...prev, class_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Pilih Kelas (Opsional)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.teacher_in_charge}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Tempat Lahir *</label>
              <input
                type="text"
                value={formData.birth_place}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_place: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Contoh: Jakarta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Tanggal Lahir *</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Nama Ayah *</label>
            <input
              type="text"
              value={formData.parent_name}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Nama ayah santri"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">No. Telp Orang Tua *</label>
            <input
              type="tel"
              value={formData.parent_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, parent_phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="08123456789"
              required
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

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

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const url = selectedClass === 'all' 
        ? '/api/admin/students' 
        : `/api/admin/students?classId=${selectedClass}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentAdded = () => {
    fetchStudents();
    fetchClasses(); // Refresh class count
  };

  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus santri "${studentName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId })
      });

      if (response.ok) {
        setStudents(prev => prev.filter(student => student.id !== studentId));
        alert(`Santri ${studentName} berhasil dihapus`);
        fetchClasses(); // Refresh class count
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menghapus santri');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/export-excel', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_TPQ_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Gagal mengunduh laporan');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Terjadi kesalahan saat mengunduh laporan');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parent_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout currentPage="/admin/students">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Data Santri</h1>
            <p className="text-gray-600">Kelola data santri TPQ</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/students/classes"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              🏫 Kelola Kelas
            </Link>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📥 Export Excel
            </button>
          </div>
        </div>

        {/* Info: Santri ditambahkan oleh guru */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-blue-500 text-xl">ℹ️</span>
          <div>
            <p className="text-blue-800 font-medium">Santri ditambahkan oleh Guru</p>
            <p className="text-blue-700 text-sm">Data santri ditambahkan oleh guru melalui Portal Guru. Admin dapat melihat, mengelola, atau mengeluarkan santri dari kelas.</p>
          </div>
        </div>

        {/* Classes Card Grid */}
        {classes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">📚 Daftar Kelas</h2>
              <Link
                href="/admin/students/classes"
                className="text-blue-600 hover:underline text-sm"
              >
                Kelola Semua Kelas →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {classes.map((classItem) => (
                <Link 
                  key={classItem.id} 
                  href={`/admin/students/classes/${classItem.id}`}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all border-2 border-blue-100 hover:border-blue-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-500 text-white w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-md">
                      🏫
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                      {classItem.student_count} santri
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{classItem.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <span>👨‍🏫</span> {classItem.teacher_in_charge || 'Belum ada'}
                  </p>
                  <div className="text-sm text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                    Kelola Kelas <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {classes.length === 0 && (
          <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Kelas</h3>
            <p className="text-gray-600 mb-4">Buat kelas pertama untuk mulai mengelola santri Anda</p>
            <Link
              href="/admin/students/classes"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Buat Kelas Pertama
            </Link>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama santri atau ayah..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="all">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">TTL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Nama Ayah</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">No. Telp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {student.class_name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {student.birth_place}, {new Date(student.birth_date).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.parent_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.parent_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        {searchTerm ? 'Tidak ada santri yang sesuai dengan pencarian' : 'Belum ada data santri'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentAdded={handleStudentAdded}
        classes={classes}
      />
    </AdminLayout>
  );
}
