'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function GalleryEventsPage() {
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: 'Wisuda Santri 2024', 
      date: '2024-11-30', 
      photos: 25, 
      videos: 3, 
      description: 'Dokumentasi wisuda santri tahun 2024',
      thumbnail: '/api/placeholder/300/200'
    },
    { 
      id: 2, 
      title: 'Lomba Tahfidz Antar TPQ', 
      date: '2024-11-15', 
      photos: 18, 
      videos: 2, 
      description: 'Kompetisi tahfidz tingkat kecamatan',
      thumbnail: '/api/placeholder/300/200'
    },
    { 
      id: 3, 
      title: 'Peringatan Maulid Nabi', 
      date: '2024-10-20', 
      photos: 30, 
      videos: 4, 
      description: 'Perayaan maulid Nabi Muhammad SAW',
      thumbnail: '/api/placeholder/300/200'
    },
    { 
      id: 4, 
      title: 'Buka Bersama Ramadhan', 
      date: '2024-04-15', 
      photos: 22, 
      videos: 1, 
      description: 'Kegiatan buka puasa bersama santri dan orang tua',
      thumbnail: '/api/placeholder/300/200'
    }
  ]);

  return (
    <AdminLayout currentPage="/admin/gallery/events">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dokumentasi Acara</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            🎉 Tambah Acara
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <span>📷</span>
                      <span>{event.photos} foto</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🎥</span>
                      <span>{event.videos} video</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    🖼️ Lihat Galeri
                  </button>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200">
                      ✏️ Edit
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Dokumentasi</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{events.length}</div>
              <div className="text-gray-600">Total Acara</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {events.reduce((sum, event) => sum + event.photos, 0)}
              </div>
              <div className="text-gray-600">Total Foto</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {events.reduce((sum, event) => sum + event.videos, 0)}
              </div>
              <div className="text-gray-600">Total Video</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round((events.reduce((sum, event) => sum + event.photos, 0) + events.reduce((sum, event) => sum + event.videos, 0)) / events.length)}
              </div>
              <div className="text-gray-600">Avg per Acara</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}