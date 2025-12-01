'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function NewsCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Pengumuman', slug: 'pengumuman', description: 'Kategori untuk pengumuman resmi TPQ', articleCount: 8, color: '#ef4444' },
    { id: 2, name: 'Kegiatan', slug: 'kegiatan', description: 'Dokumentasi dan info kegiatan TPQ', articleCount: 15, color: '#10b981' },
    { id: 3, name: 'Prestasi', slug: 'prestasi', description: 'Berita tentang prestasi santri dan TPQ', articleCount: 6, color: '#f59e0b' },
    { id: 4, name: 'Informasi', slug: 'informasi', description: 'Informasi umum seputar TPQ', articleCount: 12, color: '#3b82f6' },
    { id: 5, name: 'Tips & Edukasi', slug: 'tips-edukasi', description: 'Tips dan konten edukatif untuk orang tua', articleCount: 4, color: '#8b5cf6' },
    { id: 6, name: 'Agenda', slug: 'agenda', description: 'Jadwal dan agenda kegiatan mendatang', articleCount: 3, color: '#06b6d4' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#10b981'
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
      const category = {
        id: Date.now(),
        ...newCategory,
        slug,
        articleCount: 0
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', color: '#10b981' });
      setShowAddForm(false);
    }
  };

  return (
    <AdminLayout currentPage="/admin/news/categories">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kategori Berita</h1>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            🏷️ Tambah Kategori
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Kategori Baru</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Masukkan nama kategori"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✅ Simpan
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ❌ Batal
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Deskripsi singkat kategori ini"
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="h-2"
                style={{ backgroundColor: category.color }}
              ></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                    {category.articleCount} artikel
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{category.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-xs text-gray-500">{category.color}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Kategori</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-gray-600">Total Kategori</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {categories.reduce((sum, cat) => sum + cat.articleCount, 0)}
              </div>
              <div className="text-gray-600">Total Artikel</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(categories.reduce((sum, cat) => sum + cat.articleCount, 0) / categories.length)}
              </div>
              <div className="text-gray-600">Avg per Kategori</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {categories.find(c => c.articleCount === Math.max(...categories.map(c => c.articleCount)))?.name || 'N/A'}
              </div>
              <div className="text-gray-600">Terpopuler</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
