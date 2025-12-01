'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function OrganizationPage() {
  const [orgStructure, setOrgStructure] = useState([
    { id: 1, position: 'Kepala TPQ', name: 'Ustadz Ahmad Fauzi', image: '/api/placeholder/150/150', description: 'Memimpin dan mengawasi seluruh kegiatan TPQ' },
    { id: 2, position: 'Wakil Kepala', name: 'Ustadzah Siti Fatimah', image: '/api/placeholder/150/150', description: 'Membantu kepala dalam mengelola TPQ' },
    { id: 3, position: 'Koordinator Pendidikan', name: 'Ustadz Muhammad Yusuf', image: '/api/placeholder/150/150', description: 'Mengkoordinasi program pembelajaran' },
    { id: 4, position: 'Bendahara', name: 'Ustadzah Aminah', image: '/api/placeholder/150/150', description: 'Mengelola keuangan TPQ' },
    { id: 5, position: 'Sekretaris', name: 'Ustadz Abdul Rahman', image: '/api/placeholder/150/150', description: 'Mengelola administrasi TPQ' }
  ]);

  return (
    <AdminLayout currentPage="/admin/profile/organization">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Struktur Organisasi</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Posisi
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgStructure.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
              <p className="text-green-600 font-medium mb-2">{member.position}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
              <div className="mt-4 flex space-x-2 justify-center">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                  ✏️ Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}