'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function ScheduleEventsPage() {
  const [events, setEvents] = useState([
    { id: 1, title: 'Peringatan Maulid Nabi', date: '2024-12-20', time: '14:00-16:00', type: 'Keagamaan', participants: 50, location: 'Aula TPQ' },
    { id: 2, title: 'Wisuda Santri', date: '2024-12-25', time: '09:00-12:00', type: 'Akademik', participants: 30, location: 'Aula TPQ' },
    { id: 3, title: 'Buka Bersama Ramadhan', date: '2025-03-15', time: '17:30-19:00', type: 'Sosial', participants: 100, location: 'Halaman TPQ' },
    { id: 4, title: 'Lomba Tahfidz Antar Santri', date: '2025-01-10', time: '08:00-12:00', type: 'Kompetisi', participants: 40, location: 'Ruang Utama' }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Keagamaan': return 'bg-green-100 text-green-800';
      case 'Akademik': return 'bg-blue-100 text-blue-800';
      case 'Sosial': return 'bg-purple-100 text-purple-800';
      case 'Kompetisi': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout currentPage="/admin/schedule/events">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kegiatan Khusus</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            🎉 Tambah Kegiatan
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid gap-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Tanggal:</span> {event.date}
                        </div>
                        <div>
                          <span className="font-medium">Waktu:</span> {event.time}
                        </div>
                        <div>
                          <span className="font-medium">Lokasi:</span> {event.location}
                        </div>
                        <div>
                          <span className="font-medium">Peserta:</span> {event.participants} orang
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