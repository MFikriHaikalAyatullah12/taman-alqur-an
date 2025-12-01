'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data berita terbaru
    setNews([
      {
        id: 1,
        title: 'Pendaftaran Santri Baru Tahun Ajaran 2024/2025',
        excerpt: 'TPQ Al-Hikmah membuka pendaftaran santri baru untuk tahun ajaran 2024/2025 dengan kuota terbatas.',
        content: 'Pendaftaran dibuka mulai tanggal 1 Januari hingga 31 Maret 2024...',
        author: 'Admin',
        date: '2024-01-15',
        category: 'Pengumuman',
        image: '/api/placeholder/400/250'
      },
      {
        id: 2,
        title: 'Kegiatan Wisuda Santri TPQ Al-Hikmah',
        excerpt: 'Alhamdulillah, sebanyak 45 santri berhasil menyelesaikan program tahfidz juz 30.',
        content: 'Acara wisuda dilaksanakan di aula TPQ dengan dihadiri wali santri...',
        author: 'Admin',
        date: '2024-01-10',
        category: 'Kegiatan',
        image: '/api/placeholder/400/250'
      },
      {
        id: 3,
        title: 'Lomba Tahfidz Antar TPQ Se-Jakarta',
        excerpt: 'Santri TPQ Al-Hikmah meraih juara 1 dalam lomba tahfidz tingkat DKI Jakarta.',
        content: 'Prestasi membanggakan diraih oleh Muhammad Arif, santri kelas tahfidz...',
        author: 'Admin',
        date: '2024-01-05',
        category: 'Prestasi',
        image: '/api/placeholder/400/250'
      },
      {
        id: 4,
        title: 'Program Buka Bersama Ramadhan 1445H',
        excerpt: 'TPQ Al-Hikmah mengadakan buka bersama dengan seluruh santri dan wali santri.',
        content: 'Kegiatan buka bersama diisi dengan tilawah dan kajian singkat...',
        author: 'Admin',
        date: '2024-01-01',
        category: 'Kegiatan',
        image: '/api/placeholder/400/250'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PublicLayout currentPage="/news">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/news">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Berita & Artikel
            </h1>
            <p className="text-xl text-gray-600">
              Informasi terbaru seputar kegiatan TPQ Al-Hikmah
            </p>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <span className="text-gray-500 text-center">
                    📰<br />
                    {item.title.substring(0, 30)}...
                  </span>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.category === 'Pengumuman' ? 'bg-red-100 text-red-800' :
                      item.category === 'Kegiatan' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Oleh {item.author}
                    </span>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300">
              Muat Berita Lainnya
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}