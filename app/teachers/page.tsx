'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data ustadz
    setTeachers([
      {
        id: 1,
        name: 'Ustadz Ahmad Fauzi',
        position: 'Kepala TPQ',
        education: 'S1 Pendidikan Agama Islam',
        experience: '10 Tahun',
        specialization: 'Tahfidz & Tajwid',
        description: 'Berpengalaman dalam pengajaran Al-Quran dan pembinaan akhlak santri'
      },
      {
        id: 2,
        name: 'Ustadzah Siti Aminah',
        position: 'Guru Tahfidz',
        education: 'Pondok Modern Darussalam',
        experience: '8 Tahun',
        specialization: 'Tahfidz Al-Quran',
        description: 'Hafidz 30 Juz dengan sanad yang jelas dan metode mengajar yang menyenangkan'
      },
      {
        id: 3,
        name: 'Ustadz Muhammad Ridho',
        position: 'Guru Tajwid',
        education: 'S1 Ilmu Al-Quran dan Tafsir',
        experience: '7 Tahun',
        specialization: 'Ilmu Tajwid & Qiraat',
        description: 'Ahli dalam ilmu tajwid dengan metode pembelajaran yang mudah dipahami'
      },
      {
        id: 4,
        name: 'Ustadzah Fatimah',
        position: 'Guru Iqro',
        education: 'S1 Pendidikan Guru Madrasah Ibtidaiyah',
        experience: '6 Tahun',
        specialization: 'Pembelajaran Iqro & Dasar',
        description: 'Sabar dan telaten dalam mengajar anak-anak tingkat pemula'
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PublicLayout currentPage="/teachers">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/teachers">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ustadz & Ustadzah
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tim pengajar yang berpengalaman dan berkompeten dalam bidang Al-Quran
            </p>
          </div>

          {/* Teachers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-3">
                      {teacher.position}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">📚 Pendidikan:</span>
                        <span>{teacher.education}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">⏰ Pengalaman:</span>
                        <span>{teacher.experience}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">🎯 Spesialisasi:</span>
                        <span>{teacher.specialization}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                      {teacher.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {teacher.specialization.split(' & ').map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bergabunglah dengan TPQ Al-Hikmah
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Dapatkan bimbingan terbaik dari ustadz dan ustadzah yang berpengalaman dalam pembelajaran Al-Quran
              </p>
              <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}