'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function StudentRegistrationsPage() {
  const [registrations, setRegistrations] = useState([
    { id: 1, name: 'Ahmad Fadhil', parent: 'Budi Santoso', phone: '081234567890', level: 'Iqra 1', status: 'Pending', date: '2024-12-01' },
    { id: 2, name: 'Siti Aisyah', parent: 'Dewi Sartika', phone: '081234567891', level: 'Iqra 2', status: 'Approved', date: '2024-12-02' },
    { id: 3, name: 'Muhammad Rifki', parent: 'Agus Wijaya', phone: '081234567892', level: 'Al-Quran', status: 'Pending', date: '2024-12-03' },
    { id: 4, name: 'Fatimah Zahra', parent: 'Sri Mulyani', phone: '081234567893', level: 'Tahfidz', status: 'Rejected', date: '2024-12-04' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout currentPage="/admin/students/registrations">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pendaftaran Santri</h1>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-black">
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{registration.name}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(registration.status)}`}>
                      {registration.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Orang Tua:</span> {registration.parent}
                    </div>
                    <div>
                      <span className="font-medium">Telepon:</span> {registration.phone}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {registration.level}
                    </div>
                    <div>
                      <span className="font-medium">Tanggal:</span> {registration.date}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200">
                    📋 Detail
                  </button>
                  {registration.status === 'Pending' && (
                    <>
                      <button className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200">
                        ✅ Terima
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200">
                        ❌ Tolak
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}