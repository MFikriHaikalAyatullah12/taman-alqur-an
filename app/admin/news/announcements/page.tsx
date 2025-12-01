'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function NewsAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Libur Hari Raya Idul Fitri 1445 H',
      content: 'TPQ Al-Hikmah akan libur pada tanggal 10-12 April 2024 dalam rangka perayaan Hari Raya Idul Fitri',
      priority: 'high',
      status: 'active',
      startDate: '2024-04-08',
      endDate: '2024-04-15',
      createdDate: '2024-04-01'
    },
    {
      id: 2,
      title: 'Pendaftaran Santri Baru Gelombang 2',
      content: 'Pendaftaran santri baru gelombang 2 dibuka mulai 1 Mei 2024. Tersedia program Iqra, Al-Quran, dan Tahfidz',
      priority: 'medium',
      status: 'active',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      createdDate: '2024-04-20'
    },
    {
      id: 3,
      title: 'Ujian Kenaikan Tingkat Semester Ganjil',
      content: 'Ujian kenaikan tingkat untuk semester ganjil akan dilaksanakan pada tanggal 15-20 Desember 2024',
      priority: 'high',
      status: 'scheduled',
      startDate: '2024-12-10',
      endDate: '2024-12-25',
      createdDate: '2024-11-15'
    },
    {
      id: 4,
      title: 'Program Tahfidz Intensif',
      content: 'Dibuka program tahfidz intensif untuk santri yang ingin menambah hafalan dengan bimbingan khusus',
      priority: 'low',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      createdDate: '2024-05-20'
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout currentPage="/admin/news/announcements">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pengumuman</h1>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            📢 Buat Pengumuman
          </button>
        </div>

        <div className="flex space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-black">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="scheduled">Terjadwal</option>
            <option value="expired">Berakhir</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-black">
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>
        </div>

        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{announcement.title}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority === 'high' ? 'Prioritas Tinggi' : 
                       announcement.priority === 'medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(announcement.status)}`}>
                      {announcement.status === 'active' ? 'Aktif' : 
                       announcement.status === 'scheduled' ? 'Terjadwal' : 'Berakhir'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{announcement.content}</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Mulai:</span> {announcement.startDate}
                    </div>
                    <div>
                      <span className="font-medium">Berakhir:</span> {announcement.endDate}
                    </div>
                    <div>
                      <span className="font-medium">Dibuat:</span> {announcement.createdDate}
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
                  <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistik Pengumuman</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{announcements.length}</div>
              <div className="text-gray-600">Total Pengumuman</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {announcements.filter(a => a.status === 'active').length}
              </div>
              <div className="text-gray-600">Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {announcements.filter(a => a.priority === 'high').length}
              </div>
              <div className="text-gray-600">Prioritas Tinggi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {announcements.filter(a => a.status === 'scheduled').length}
              </div>
              <div className="text-gray-600">Terjadwal</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}