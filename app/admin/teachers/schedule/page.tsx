'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function TeacherSchedulePage() {
  const [schedules, setSchedules] = useState([
    { id: 1, teacher: 'Ustadz Ahmad', day: 'Senin', time: '15:00-17:00', class: 'Iqra 1-2', students: 15 },
    { id: 2, teacher: 'Ustadzah Fatimah', day: 'Senin', time: '15:00-17:00', class: 'Iqra 3-4', students: 12 },
    { id: 3, teacher: 'Ustadz Yusuf', day: 'Selasa', time: '15:00-17:00', class: 'Al-Quran', students: 8 },
    { id: 4, teacher: 'Ustadzah Aminah', day: 'Rabu', time: '15:00-17:00', class: 'Tahfidz', students: 10 },
    { id: 5, teacher: 'Ustadz Rahman', day: 'Kamis', time: '15:00-17:00', class: 'Iqra 5-6', students: 14 }
  ]);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <AdminLayout currentPage="/admin/teachers/schedule">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Mengajar</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            ➕ Tambah Jadwal
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Hari</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Waktu</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Pengajar</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Kelas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Santri</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {schedule.day}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{schedule.time}</td>
                      <td className="py-3 px-4 text-gray-900">{schedule.teacher}</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {schedule.class}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{schedule.students} santri</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            ✏️ Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}