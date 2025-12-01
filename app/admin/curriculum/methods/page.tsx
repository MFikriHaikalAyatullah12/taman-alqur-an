'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CurriculumMethodsPage() {
  const [methods, setMethods] = useState([
    { 
      id: 1, 
      name: 'Metode Iqra', 
      description: 'Metode pembelajaran Al-Quran secara bertahap dari Iqra 1-6', 
      levels: ['Iqra 1', 'Iqra 2', 'Iqra 3', 'Iqra 4', 'Iqra 5', 'Iqra 6'],
      duration: '1.5-3 tahun',
      effectiveness: 85,
      students: 80
    },
    { 
      id: 2, 
      name: 'Metode Tilawati', 
      description: 'Metode pembelajaran dengan pendekatan lagu dan irama', 
      levels: ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6'],
      duration: '1-2 tahun',
      effectiveness: 78,
      students: 25
    },
    { 
      id: 3, 
      name: 'Metode Qiroati', 
      description: 'Metode pembelajaran langsung tanpa dieja', 
      levels: ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6'],
      duration: '1-2.5 tahun',
      effectiveness: 80,
      students: 20
    },
    { 
      id: 4, 
      name: 'Metode Tahfidz', 
      description: 'Metode khusus untuk menghafal Al-Quran', 
      levels: ['Juz 30', 'Juz 29', 'Juz 28', 'Lanjutan'],
      duration: 'Berkelanjutan',
      effectiveness: 90,
      students: 15
    }
  ]);

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 85) return 'text-green-600';
    if (effectiveness >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AdminLayout currentPage="/admin/curriculum/methods">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Metode Pembelajaran</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Metode
          </button>
        </div>

        <div className="grid gap-6">
          {methods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="font-bold text-xl text-gray-900">{method.name}</h3>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {method.students} santri
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Tingkatan:</h4>
                      <div className="flex flex-wrap gap-1">
                        {method.levels.map((level, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Durasi Target:</h4>
                      <p className="text-gray-600">{method.duration}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Efektivitas:</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`text-2xl font-bold ${getEffectivenessColor(method.effectiveness)}`}>
                          {method.effectiveness}%
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${method.effectiveness}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                    📋 Detail
                  </button>
                  <button className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded text-sm hover:bg-yellow-200">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Metode Pembelajaran</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{methods.length}</div>
              <div className="text-gray-600">Total Metode</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {methods.reduce((sum, method) => sum + method.students, 0)}
              </div>
              <div className="text-gray-600">Total Santri</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(methods.reduce((sum, method) => sum + method.effectiveness, 0) / methods.length)}%
              </div>
              <div className="text-gray-600">Avg Efektivitas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {methods.find(m => m.effectiveness === Math.max(...methods.map(m => m.effectiveness)))?.name.split(' ')[1] || 'N/A'}
              </div>
              <div className="text-gray-600">Metode Terbaik</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}