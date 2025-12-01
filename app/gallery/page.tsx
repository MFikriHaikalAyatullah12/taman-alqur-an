'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function GalleryPage() {
  const [gallery, setGallery] = useState({
    photos: [],
    videos: []
  });
  const [activeTab, setActiveTab] = useState('photos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data galeri dummy - di masa depan bisa diambil dari API
    const galleryData = {
      photos: [
        { id: 1, title: 'Kegiatan Belajar', image: '/api/placeholder/300/200', category: 'Pembelajaran' },
        { id: 2, title: 'Wisuda Santri', image: '/api/placeholder/300/200', category: 'Acara' },
        { id: 3, title: 'Lomba Tahfidz', image: '/api/placeholder/300/200', category: 'Kompetisi' },
        { id: 4, title: 'Kegiatan Ramadhan', image: '/api/placeholder/300/200', category: 'Acara' },
        { id: 5, title: 'Belajar Kelompok', image: '/api/placeholder/300/200', category: 'Pembelajaran' },
        { id: 6, title: 'Outdoor Learning', image: '/api/placeholder/300/200', category: 'Pembelajaran' }
      ],
      videos: [
        { id: 1, title: 'Profil TPQ Al-Hikmah', thumbnail: '/api/placeholder/300/200', duration: '5:30' },
        { id: 2, title: 'Kegiatan Belajar Mengajar', thumbnail: '/api/placeholder/300/200', duration: '3:45' },
        { id: 3, title: 'Testimoni Orang Tua', thumbnail: '/api/placeholder/300/200', duration: '4:20' }
      ]
    };
    
    setGallery(galleryData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PublicLayout currentPage="/gallery">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/gallery">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Galeri TPQ
            </h1>
            <p className="text-xl text-gray-600">
              Dokumentasi kegiatan dan momen berharga di TPQ Al-Hikmah
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'photos'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📷 Foto Kegiatan
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'videos'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                🎥 Video
              </button>
            </div>
          </div>

          {/* Photo Gallery */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.photos?.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <span className="text-gray-500">📷 {photo.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{photo.title}</h3>
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {photo.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Gallery */}
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.videos?.map((video) => (
                <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎥</div>
                        <span className="text-gray-500">{video.title}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg">
                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}