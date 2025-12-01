'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminGalleryPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load photos data - dummy data
    const dummyPhotos = [
      {
        id: 1,
        title: 'Kegiatan Belajar Mengajar',
        category: 'pembelajaran',
        url: '/api/placeholder/300/200',
        upload_date: '2024-01-15',
        description: 'Suasana pembelajaran di kelas Iqro'
      },
      {
        id: 2,
        title: 'Wisuda Santri',
        category: 'acara',
        url: '/api/placeholder/300/200',
        upload_date: '2024-02-20',
        description: 'Wisuda santri yang telah menyelesaikan program'
      },
      {
        id: 3,
        title: 'Lomba Tahfidz',
        category: 'kompetisi',
        url: '/api/placeholder/300/200',
        upload_date: '2024-03-10',
        description: 'Kompetisi hafalan Al-Quran antar santri'
      }
    ];
    
    setPhotos(dummyPhotos);
    setIsLoading(false);
  }, []);

  const filteredPhotos = photos.filter(photo => 
    selectedCategory === 'all' || photo.category === selectedCategory
  );

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/gallery/photos">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/gallery/photos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Galeri Foto</h1>
            <p className="text-gray-600">Kelola koleksi foto kegiatan TPQ</p>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            📷 Upload Foto
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Foto
            </button>
            <button 
              onClick={() => setSelectedCategory('pembelajaran')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'pembelajaran' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pembelajaran
            </button>
            <button 
              onClick={() => setSelectedCategory('acara')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'acara' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Acara
            </button>
            <button 
              onClick={() => setSelectedCategory('kompetisi')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'kompetisi' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Kompetisi
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <span className="text-gray-500">📷 {photo.title}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {photo.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(photo.upload_date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada foto</h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? 'Belum ada foto yang diupload.' 
                : `Tidak ada foto di kategori ${selectedCategory}.`}
            </p>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              📷 Upload Foto Pertama
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}