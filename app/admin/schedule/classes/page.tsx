'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function ScheduleClassesPage() {
  const [classes, setClasses] = useState([
    { id: 1, time: '15:00-17:00', class: 'Iqra 1-2', teacher: 'Ustadz Ahmad', students: 15, room: 'Ruang A' },
    { id: 2, time: '15:00-17:00', class: 'Iqra 3-4', teacher: 'Ustadzah Fatimah', students: 12, room: 'Ruang B' },
    { id: 3, time: '16:00-18:00', class: 'Al-Quran', teacher: 'Ustadz Yusuf', students: 8, room: 'Ruang C' },
    { id: 4, time: '16:00-18:00', class: 'Tahfidz', teacher: 'Ustadzah Aminah', students: 10, room: 'Ruang D' }
  ]);

  return (
    <AdminLayout currentPage="/admin/schedule/classes">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Mengaji</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Jadwal
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{cls.class}</h3>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {cls.time}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {cls.room}
                        </span>
                      </div>
                      <p className="text-gray-600">Pengajar: {cls.teacher}</p>
                      <p className="text-gray-600">Jumlah Santri: {cls.students}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                        ✏️ Edit
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}