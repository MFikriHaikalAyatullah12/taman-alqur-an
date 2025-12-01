'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Load news data - dummy data
    const dummyNews = [
      {
        id: 1,
        title: 'Pembukaan Pendaftaran Santri Baru 2024',
        excerpt: 'TPQ Al-Hikmah membuka pendaftaran santri baru untuk tahun ajaran 2024/2025',
        content: 'Lorem ipsum dolor sit amet...',
        category: 'pengumuman',
        status: 'published',
        author: 'Admin TPQ',
        publish_date: '2024-01-15',
        views: 150
      },
      {
        id: 2,
        title: 'Kegiatan Khataman Al-Quran Santri',
        excerpt: 'Alhamdulillah, 15 santri berhasil menyelesaikan bacaan Al-Quran 30 Juz',
        content: 'Lorem ipsum dolor sit amet...',
        category: 'berita',
        status: 'published',
        author: 'Ustadz Ahmad',
        publish_date: '2024-02-20',
        views: 89
      },
      {
        id: 3,
        title: 'Program Tahfidz Intensif Ramadhan',
        excerpt: 'Akan dilaksanakan program tahfidz intensif selama bulan Ramadhan',
        content: 'Lorem ipsum dolor sit amet...',
        category: 'program',
        status: 'draft',
        author: 'Ustadzah Siti',
        publish_date: '2024-03-10',
        views: 0
      }
    ];
    
    setNews(dummyNews);
    setIsLoading(false);
  }, []);

  const filteredNews = news.filter(article => 
    filterStatus === 'all' || article.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'published': return 'Dipublikasi';
      case 'draft': return 'Draft';
      case 'archived': return 'Diarsipkan';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/news">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/news">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Berita & Artikel</h1>
            <p className="text-gray-600">Kelola konten berita dan artikel TPQ</p>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ✍️ Tulis Artikel
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-black"
            >
              <option value="all">Semua Status</option>
              <option value="published">Dipublikasi</option>
              <option value="draft">Draft</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredNews.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(article.status)}`}>
                        {getStatusText(article.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>👤 {article.author}</span>
                      <span>📅 {new Date(article.publish_date).toLocaleDateString('id-ID')}</span>
                      <span>👁️ {article.views} views</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
                      View
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada artikel</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all' 
                ? 'Belum ada artikel yang dibuat.' 
                : `Tidak ada artikel dengan status ${getStatusText(filterStatus)}.`}
            </p>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              ✍️ Tulis Artikel Pertama
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">📰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Artikel</p>
                <p className="text-2xl font-bold text-gray-900">{news.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dipublikasi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.filter(n => n.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 text-xl">📝</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.filter(n => n.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">👁️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.reduce((sum, n) => sum + n.views, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}