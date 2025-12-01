'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function CurriculumPage() {
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data kurikulum
    setCurriculum([
      {
        id: 1,
        level: 'Tingkat Dasar',
        description: 'Pengenalan huruf hijaiyah dan bacaan dasar Al-Quran',
        topics: ['Huruf Hijaiyah', 'Harakat', 'Bacaan Pendek', 'Doa Sehari-hari']
      },
      {
        id: 2,
        level: 'Tingkat Menengah',
        description: 'Membaca Al-Quran dengan tajwid yang benar',
        topics: ['Tajwid Dasar', 'Makharijul Huruf', 'Sifat Huruf', 'Hukum Nun Sukun']
      },
      {
        id: 3,
        level: 'Tingkat Lanjut',
        description: 'Hafalan Al-Quran dan pemahaman tafsir',
        topics: ['Tahfidz Juz 30', 'Tafsir Sederhana', 'Akhlak Islam', 'Fiqh Anak']
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PublicLayout currentPage="/curriculum">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/curriculum">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Kurikulum TPQ
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Program pembelajaran Al-Quran yang terstruktur dan sistematis
            </p>
          </div>

          {/* Curriculum Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {curriculum.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-600 mb-3">
                    {item.level}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-3">Materi Pembelajaran:</h4>
                  {item.topics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                    Detail Kurikulum
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}