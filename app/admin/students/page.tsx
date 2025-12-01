'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    // Load students data - untuk saat ini menggunakan data dummy
    const dummyStudents = [
      {
        id: 1,
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@email.com',
        phone: '081234567890',
        address: 'Jl. Masjid No. 123',
        birth_date: '2010-05-15',
        parent_name: 'Bapak Usman',
        parent_phone: '081234567891',
        level: 'Iqro 3',
        status: 'active',
        enrollment_date: '2023-01-15',
        progress: 75
      },
      {
        id: 2,
        name: 'Fatimah Zahra',
        email: 'fatimah@email.com',
        phone: '081234567892',
        address: 'Jl. Pondok No. 456',
        birth_date: '2012-08-20',
        parent_name: 'Ibu Salmah',
        parent_phone: '081234567893',
        level: 'Al-Quran Juz 5',
        status: 'active',
        enrollment_date: '2023-02-01',
        progress: 60
      },
      {
        id: 3,
        name: 'Muhammad Hasan',
        email: 'hasan@email.com',
        phone: '081234567894',
        address: 'Jl. Islamic No. 789',
        birth_date: '2011-12-10',
        parent_name: 'Bapak Abdullah',
        parent_phone: '081234567895',
        level: 'Iqro 6',
        status: 'active',
        enrollment_date: '2023-03-10',
        progress: 85
      },
      {
        id: 4,
        name: 'Aisyah Putri',
        email: 'aisyah@email.com',
        phone: '081234567896',
        address: 'Jl. Quran No. 321',
        birth_date: '2013-03-25',
        parent_name: 'Ibu Khadijah',
        parent_phone: '081234567897',
        level: 'Iqro 2',
        status: 'graduated',
        enrollment_date: '2022-09-15',
        progress: 100
      }
    ];

    setStudents(dummyStudents);
    setIsLoading(false);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.level.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchLevel = filterLevel === 'all' || student.level.includes(filterLevel);
    return matchSearch && matchStatus && matchLevel;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Aktif';
      case 'graduated': return 'Lulus';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/students">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Santri</h1>
            <p className="text-gray-600">Kelola informasi santri TPQ</p>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Santri
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Santri
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Nama atau tingkatan..."
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
                <option value="graduated">Lulus</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tingkatan
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="all">Semua Tingkatan</option>
                <option value="Iqro">Iqro</option>
                <option value="Al-Quran">Al-Quran</option>
                <option value="Tahfidz">Tahfidz</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                🔍 Filter
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Santri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orang Tua
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.level}</div>
                      <div className="text-sm text-gray-500">
                        Sejak {new Date(student.enrollment_date).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.parent_name}</div>
                      <div className="text-sm text-gray-500">{student.parent_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        <button className="text-green-600 hover:text-green-900">Detail</button>
                        <button className="text-purple-600 hover:text-purple-900">Progress</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada santri</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterLevel !== 'all'
                ? 'Tidak ditemukan santri dengan kriteria tersebut.' 
                : 'Belum ada data santri yang ditambahkan.'}
            </p>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              ➕ Tambah Santri Pertama
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
                <p className="text-sm text-gray-600">Total Santri</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
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
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-xl">🎓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lulus</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.status === 'graduated').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rata-rata Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
