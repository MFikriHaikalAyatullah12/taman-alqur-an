'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function GalleryVideosPage() {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Profil TPQ Al-Hikmah', thumbnail: '/api/placeholder/300/200', duration: '5:30', views: 150, uploadDate: '2024-11-15' },
    { id: 2, title: 'Kegiatan Belajar Mengajar', thumbnail: '/api/placeholder/300/200', duration: '3:45', views: 89, uploadDate: '2024-11-20' },
    { id: 3, title: 'Lomba Tahfidz Santri', thumbnail: '/api/placeholder/300/200', duration: '8:20', views: 200, uploadDate: '2024-11-25' },
    { id: 4, title: 'Wisuda Santri 2024', thumbnail: '/api/placeholder/300/200', duration: '12:15', views: 300, uploadDate: '2024-11-30' },
    { id: 5, title: 'Testimoni Orang Tua', thumbnail: '/api/placeholder/300/200', duration: '4:20', views: 120, uploadDate: '2024-12-01' },
    { id: 6, title: 'Kegiatan Ramadhan', thumbnail: '/api/placeholder/300/200', duration: '6:45', views: 180, uploadDate: '2024-12-05' }
  ]);

  return (
    <AdminLayout currentPage="/admin/gallery/videos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Video</h1>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              🎥 Upload Video
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2">
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-1 rounded">
                    ✏️
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>👁️ {video.views} views</span>
                  <span>{video.uploadDate}</span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    📋 Lihat Detail
                  </button>
                  <div className="flex space-x-2">
                    <button className="text-yellow-600 hover:text-yellow-800 text-sm">
                      ✏️ Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Video</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{videos.length}</div>
              <div className="text-gray-600">Total Video</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {videos.reduce((sum, video) => sum + video.views, 0)}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(videos.reduce((sum, video) => sum + video.views, 0) / videos.length)}
              </div>
              <div className="text-gray-600">Avg Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">85%</div>
              <div className="text-gray-600">Engagement</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}