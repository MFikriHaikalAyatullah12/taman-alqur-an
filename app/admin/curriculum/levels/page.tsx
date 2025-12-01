'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CurriculumLevelsPage() {
  const [levels, setLevels] = useState([
    { id: 1, name: 'Iqra 1', description: 'Pengenalan huruf hijaiyah dasar', students: 25, duration: '3-6 bulan', prerequisites: 'Tidak ada' },
    { id: 2, name: 'Iqra 2', description: 'Bacaan dengan harokat fathah', students: 20, duration: '3-6 bulan', prerequisites: 'Lulus Iqra 1' },
    { id: 3, name: 'Iqra 3', description: 'Bacaan dengan harokat kasroh dan dhommah', students: 18, duration: '3-6 bulan', prerequisites: 'Lulus Iqra 2' },
    { id: 4, name: 'Iqra 4', description: 'Bacaan panjang dan tanwin', students: 15, duration: '3-6 bulan', prerequisites: 'Lulus Iqra 3' },
    { id: 5, name: 'Iqra 5', description: 'Waqaf dan bacaan mad', students: 12, duration: '4-8 bulan', prerequisites: 'Lulus Iqra 4' },
    { id: 6, name: 'Iqra 6', description: 'Bacaan gharib dan persiapan Al-Quran', students: 10, duration: '4-8 bulan', prerequisites: 'Lulus Iqra 5' },
    { id: 7, name: 'Al-Quran', description: 'Membaca Al-Quran dengan tajwid', students: 15, duration: '1-2 tahun', prerequisites: 'Lulus Iqra 6' },
    { id: 8, name: 'Tahfidz', description: 'Menghafal Al-Quran', students: 8, duration: 'Berkelanjutan', prerequisites: 'Lancar Al-Quran' }
  ]);

  return (
    <AdminLayout currentPage="/admin/curriculum/levels">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tingkatan Pembelajaran</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Tingkatan
          </button>
        </div>

        <div className="grid gap-6">
          {levels.map((level) => (
            <div key={level.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="font-bold text-xl text-gray-900">{level.name}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {level.students} santri
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Durasi:</span>
                      <p className="text-gray-600">{level.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Prasyarat:</span>
                      <p className="text-gray-600">{level.prerequisites}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-green-600 font-medium">Aktif</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                    📋 Detail
                  </button>
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}