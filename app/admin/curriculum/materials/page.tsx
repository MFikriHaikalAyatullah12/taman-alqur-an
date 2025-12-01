'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CurriculumMaterialsPage() {
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Buku Iqra 1', type: 'Buku', level: 'Iqra 1', description: 'Buku pembelajaran huruf hijaiyah dasar', status: 'Tersedia', stock: 50 },
    { id: 2, title: 'Buku Iqra 2', type: 'Buku', level: 'Iqra 2', description: 'Buku pembelajaran dengan harokat fathah', status: 'Tersedia', stock: 45 },
    { id: 3, title: 'Al-Quran Mushaf', type: 'Mushaf', level: 'Al-Quran', description: 'Mushaf Al-Quran standar untuk pembelajaran', status: 'Tersedia', stock: 30 },
    { id: 4, title: 'Juz Amma', type: 'Buku', level: 'Tahfidz', description: 'Buku Juz Amma untuk hafalan', status: 'Tersedia', stock: 25 },
    { id: 5, title: 'Buku Tajwid', type: 'Buku', level: 'Al-Quran', description: 'Panduan ilmu tajwid lengkap', status: 'Perlu Restock', stock: 5 },
    { id: 6, title: 'Audio Murotal', type: 'Audio', level: 'Semua', description: 'Rekaman murotal untuk contoh bacaan', status: 'Digital', stock: 0 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tersedia': return 'bg-green-100 text-green-800';
      case 'Perlu Restock': return 'bg-red-100 text-red-800';
      case 'Digital': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout currentPage="/admin/curriculum/materials">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Materi Pembelajaran</h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              📚 Tambah Materi
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              📦 Kelola Stok
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Materi</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipe</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Stok</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{material.title}</h4>
                          <p className="text-sm text-gray-600">{material.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {material.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{material.level}</td>
                      <td className="py-3 px-4">
                        {material.type === 'Audio' ? (
                          <span className="text-blue-600">Digital</span>
                        ) : (
                          <span className={material.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                            {material.stock} unit
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(material.status)}`}>
                          {material.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            ✏️ Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">6</div>
            <div className="text-gray-600">Total Materi</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">155</div>
            <div className="text-gray-600">Total Stok</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">1</div>
            <div className="text-gray-600">Perlu Restock</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">1</div>
            <div className="text-gray-600">Materi Digital</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}