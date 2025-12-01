'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function GalleryUploadPage() {
  const [uploadType, setUploadType] = useState('photo');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    event: '',
    tags: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upload data:', { ...formData, type: uploadType });
    // Handle upload
  };

  return (
    <AdminLayout currentPage="/admin/gallery/upload">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setUploadType('photo')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'photo'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📷 Upload Foto
              </button>
              <button
                onClick={() => setUploadType('video')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'video'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎥 Upload Video
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File {uploadType === 'photo' ? 'Foto' : 'Video'} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-2">
                    <div className="text-4xl text-gray-400">
                      {uploadType === 'photo' ? '📷' : '🎥'}
                    </div>
                    <div className="text-gray-600">
                      <p className="font-medium">Klik untuk pilih file atau drag & drop</p>
                      <p className="text-sm">
                        {uploadType === 'photo'
                          ? 'Mendukung: JPG, PNG, JPEG (Maks: 5MB)'
                          : 'Mendukung: MP4, AVI, MOV (Maks: 100MB)'
                        }
                      </p>
                    </div>
                    <input
                      type="file"
                      accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                      className="hidden"
                      multiple={uploadType === 'photo'}
                    />
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Pilih File
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="pembelajaran">Pembelajaran</option>
                    <option value="acara">Acara</option>
                    <option value="kompetisi">Kompetisi</option>
                    <option value="kegiatan">Kegiatan Harian</option>
                    <option value="wisuda">Wisuda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acara/Event
                  </label>
                  <input
                    type="text"
                    value={formData.event}
                    onChange={(e) => handleInputChange('event', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Nama acara (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Pisahkan dengan koma (contoh: santri, belajar, iqra)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Deskripsi singkat tentang foto/video ini..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  ⬆️ Upload {uploadType === 'photo' ? 'Foto' : 'Video'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tips Upload</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Untuk Foto:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gunakan resolusi minimal 1080x720 pixels</li>
                <li>• Format yang disarankan: JPG atau PNG</li>
                <li>• Pastikan foto tidak blur dan pencahayaan cukup</li>
                <li>• Hindari watermark atau teks berlebihan</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Untuk Video:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gunakan resolusi minimal 720p (1280x720)</li>
                <li>• Format yang disarankan: MP4</li>
                <li>• Pastikan audio jernih dan tidak ada noise</li>
                <li>• Durasi ideal 30 detik - 10 menit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
