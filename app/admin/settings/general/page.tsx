'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState({
    tpqName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo: '',
    establishedYear: '',
    headmaster: '',
    vision: '',
    mission: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing settings
    setSettings({
      tpqName: 'TPQ Al-Ikhlas',
      address: 'Jl. Masjid No. 123, Jakarta Selatan',
      phone: '021-1234567',
      email: 'info@tpq-alikhlas.com',
      website: 'www.tpq-alikhlas.com',
      description: 'TPQ yang berdedikasi untuk pendidikan agama Islam berkualitas',
      logo: '/images/logo.png',
      establishedYear: '2010',
      headmaster: 'Ustadz Ahmad Wijaya',
      vision: 'Menjadi TPQ terdepan dalam pendidikan agama Islam yang berkualitas',
      mission: 'Mendidik generasi Muslim yang berakhlaq mulia dan berpengetahuan luas'
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Pengaturan berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pengaturan Umum</h1>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Dasar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama TPQ</label>
                <input
                  type="text"
                  value={settings.tpqName}
                  onChange={(e) => setSettings({...settings, tpqName: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama TPQ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alamat</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">No. Telepon</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({...settings, website: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan URL website"
                />
              </div>
            </div>
          </div>

          {/* Institutional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Institusi</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tahun Berdiri</label>
                <input
                  type="number"
                  value={settings.establishedYear}
                  onChange={(e) => setSettings({...settings, establishedYear: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tahun berdiri"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kepala TPQ</label>
                <input
                  type="text"
                  value={settings.headmaster}
                  onChange={(e) => setSettings({...settings, headmaster: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama kepala TPQ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({...settings, description: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Deskripsi singkat TPQ"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo TPQ</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Upload logo TPQ (format: JPG, PNG)</p>
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Visi & Misi</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Visi</label>
                <textarea
                  value={settings.vision}
                  onChange={(e) => setSettings({...settings, vision: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Masukkan visi TPQ"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Misi</label>
                <textarea
                  value={settings.mission}
                  onChange={(e) => setSettings({...settings, mission: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Masukkan misi TPQ"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}