'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function ScheduleExamsPage() {
  const [exams, setExams] = useState([
    { id: 1, title: 'Ujian Kenaikan Iqra 2', date: '2024-12-15', time: '09:00-11:00', level: 'Iqra 2', students: 15, status: 'Terjadwal' },
    { id: 2, title: 'Ujian Kenaikan Iqra 4', date: '2024-12-20', time: '09:00-11:00', level: 'Iqra 4', students: 12, status: 'Terjadwal' },
    { id: 3, title: 'Ujian Tilawah Al-Quran', date: '2024-12-25', time: '14:00-16:00', level: 'Al-Quran', students: 8, status: 'Terjadwal' },
    { id: 4, title: 'Ujian Hafalan 1 Juz', date: '2024-12-30', time: '14:00-17:00', level: 'Tahfidz', students: 10, status: 'Terjadwal' }
  ]);

  return (
    <AdminLayout currentPage="/admin/schedule/exams">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Ujian Kenaikan</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            📋 Jadwalkan Ujian
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid gap-4">
              {exams.map((exam) => (
                <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{exam.title}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {exam.status}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Tanggal:</span> {exam.date}
                        </div>
                        <div>
                          <span className="font-medium">Waktu:</span> {exam.time}
                        </div>
                        <div>
                          <span className="font-medium">Level:</span> {exam.level}
                        </div>
                        <div>
                          <span className="font-medium">Peserta:</span> {exam.students} santri
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}