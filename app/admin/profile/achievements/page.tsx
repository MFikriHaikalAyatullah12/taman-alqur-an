'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Juara 1 Lomba MTQ Tingkat Kecamatan', year: '2024', category: 'Kompetisi', description: 'Santri TPQ meraih juara 1 dalam lomba Musabaqah Tilawatil Quran tingkat kecamatan' },
    { id: 2, title: 'Akreditasi A dari Kemenag', year: '2023', category: 'Institusional', description: 'TPQ mendapat akreditasi A dari Kementerian Agama' },
    { id: 3, title: 'Best TPQ Award', year: '2023', category: 'Penghargaan', description: 'Mendapat penghargaan TPQ terbaik dari Yayasan Pendidikan Islam' },
    { id: 4, title: 'Hafidz Cilik Terbaik', year: '2024', category: 'Prestasi Santri', description: '5 santri berhasil menyelesaikan hafalan 5 juz Al-Quran' }
  ]);

  return (
    <AdminLayout currentPage="/admin/profile/achievements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Prestasi TPQ</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
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
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                    ✏️ Edit
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                    🗑️ Hapus
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