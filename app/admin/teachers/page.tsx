'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load teachers data - untuk saat ini menggunakan data dummy
    const dummyTeachers = [
      {
        id: 1,
        name: 'Ustadz Ahmad Subhan',
        email: 'ahmad@tpq.com',
        phone: '081234567890',
        specialization: 'Tahfidz Al-Quran',
        experience_years: 8,
        education: 'S1 Pendidikan Agama Islam',
        status: 'active',
        photo_url: '',
        bio: 'Berpengalaman dalam mengajar tahfidz dengan metode yang mudah dipahami'
      },
      {
        id: 2,
        name: 'Ustadzah Siti Aminah',
        email: 'siti@tpq.com',
        phone: '081234567891',
        specialization: 'Tajwid dan Qiraat',
        experience_years: 5,
        education: 'S1 Ilmu Al-Quran dan Tafsir',
        status: 'active',
        photo_url: '',
        bio: 'Ahli dalam bidang tajwid dan qiraat dengan sertifikasi internasional'
      },
      {
        id: 3,
        name: 'Ustadz Muhammad Ridho',
        email: 'ridho@tpq.com',
        phone: '081234567892',
        specialization: 'Fiqh dan Hadits',
        experience_years: 12,
        education: 'S2 Syariah',
        status: 'active',
        photo_url: '',
        bio: 'Berpengalaman mengajar fiqh dan hadits untuk berbagai tingkatan'
      }
    ];

    setTeachers(dummyTeachers);
    setIsLoading(false);
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || teacher.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/teachers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/teachers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Pengajar</h1>
            <p className="text-gray-600">Kelola informasi ustadz dan ustadzah</p>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Pengajar
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Pengajar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Nama atau spesialisasi..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                🔍 Filter
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {teacher.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{teacher.name}</h3>
                <p className="text-green-600 text-sm">{teacher.specialization}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-16 text-gray-500">Email:</span>
                  <span className="text-gray-900">{teacher.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-gray-500">Phone:</span>
                  <span className="text-gray-900">{teacher.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-gray-500">Exp:</span>
                  <span className="text-gray-900">{teacher.experience_years} tahun</span>
                </div>
                <div className="flex items-center">
                  <span className="w-16 text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    teacher.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {teacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">{teacher.bio}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada pengajar</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Tidak ditemukan pengajar dengan kriteria tersebut.' 
                : 'Belum ada data pengajar yang ditambahkan.'}
            </p>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              ➕ Tambah Pengajar Pertama
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Pengajar</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.filter(t => t.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata Pengalaman</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.length ? Math.round(teachers.reduce((sum, t) => sum + t.experience_years, 0) / teachers.length) : 0} tahun
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">🎓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spesialisasi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(teachers.map(t => t.specialization)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
