'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCurriculumPage() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load curriculum data - dummy data
    const dummyPrograms = [
      {
        id: 1,
        name: 'Program Iqro',
        description: 'Pembelajaran dasar membaca Al-Quran dengan metode Iqro',
        levels: ['Iqro 1', 'Iqro 2', 'Iqro 3', 'Iqro 4', 'Iqro 5', 'Iqro 6'],
        duration: '6-12 bulan',
        target_age: '4-8 tahun'
      },
      {
        id: 2,
        name: 'Program Al-Quran',
        description: 'Pembelajaran membaca Al-Quran 30 Juz dengan tajwid yang benar',
        levels: ['Juz 1-5', 'Juz 6-10', 'Juz 11-15', 'Juz 16-20', 'Juz 21-25', 'Juz 26-30'],
        duration: '2-3 tahun',
        target_age: '8+ tahun'
      },
      {
        id: 3,
        name: 'Program Tahfidz',
        description: 'Program menghafal Al-Quran dengan metode yang mudah dan efektif',
        levels: ['1 Juz', '2 Juz', '5 Juz', '10 Juz', '15 Juz', '30 Juz'],
        duration: '3-5 tahun',
        target_age: '8+ tahun'
      }
    ];
    
    setPrograms(dummyPrograms);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/curriculum">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/curriculum">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Kurikulum</h1>
            <p className="text-gray-600">Kelola program pembelajaran TPQ</p>
          </div>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Program
          </button>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 text-sm">{program.description}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Target Usia:</span>
                  <span className="ml-2 text-sm text-gray-900">{program.target_age}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Durasi:</span>
                  <span className="ml-2 text-sm text-gray-900">{program.duration}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tingkatan:</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {program.levels.map((level, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors">
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}