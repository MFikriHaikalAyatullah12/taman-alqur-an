'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function StudentProgressPage() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Ahmad Fadhil', level: 'Iqra 3', progress: 75, attendance: 90, lastTest: 85, nextTarget: 'Iqra 4' },
    { id: 2, name: 'Siti Aisyah', level: 'Iqra 5', progress: 60, attendance: 95, lastTest: 78, nextTarget: 'Iqra 6' },
    { id: 3, name: 'Muhammad Rifki', level: 'Al-Quran', progress: 40, attendance: 85, lastTest: 82, nextTarget: 'Juz 2' },
    { id: 4, name: 'Fatimah Zahra', level: 'Tahfidz', progress: 80, attendance: 100, lastTest: 90, nextTarget: 'Juz 3' }
  ]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <AdminLayout currentPage="/admin/students/progress">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Progress Belajar Santri</h1>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-black">
              <option value="all">Semua Level</option>
              <option value="iqra">Iqra 1-6</option>
              <option value="quran">Al-Quran</option>
              <option value="tahfidz">Tahfidz</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                  <p className="text-gray-600">Level: {student.level}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Target: {student.nextTarget}
                </span>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Progress Materi</span>
                    <span className="text-sm font-medium">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Kehadiran</span>
                    <span className="text-sm font-medium">{student.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(student.attendance)}`}
                      style={{ width: `${student.attendance}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Nilai Terakhir</span>
                    <span className="text-sm font-medium">{student.lastTest}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(student.lastTest)}`}
                      style={{ width: `${student.lastTest}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                    📋 Detail
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200">
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}