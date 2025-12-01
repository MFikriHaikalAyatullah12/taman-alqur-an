'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function SecuritySettingsPage() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleSaveSettings = () => {
    alert('Pengaturan keamanan berhasil disimpan!');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pengaturan Keamanan</h1>
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Simpan Pengaturan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Policy */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Kebijakan Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Panjang Minimum</label>
                <input
                  type="number"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="6"
                  max="50"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    checked={requireUppercase}
                    onChange={(e) => setRequireUppercase(e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor="requireUppercase" className="text-sm">Wajib huruf besar</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    checked={requireNumbers}
                    onChange={(e) => setRequireNumbers(e.target.checked)}
                    className="mr-3"
                  />
                  <label htmlFor="requireNumbers" className="text-sm">Wajib angka</label>
                </div>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Manajemen Sesi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Timeout Sesi (menit)</label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Log */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Log Keamanan</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500">Log keamanan akan ditampilkan di sini</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}