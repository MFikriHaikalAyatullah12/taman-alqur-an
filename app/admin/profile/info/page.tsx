'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTpq } from '@/lib/TpqContext';

export default function AdminProfileInfoPage() {
  const { settings, updateSettings, refreshSettings } = useTpq();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    whatsapp_message: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        whatsapp: settings.whatsapp || '',
        whatsapp_message: settings.whatsapp_message || 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ'
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateGlobalTpqReferences = async (newTpqName: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Update nama di title dan meta
      if (typeof document !== 'undefined') {
        document.title = `${newTpqName} - Admin Panel`;
      }
      
      // Update localStorage admin data
      const adminData = localStorage.getItem('admin_data');
      if (adminData) {
        const admin = JSON.parse(adminData);
        admin.tpqName = newTpqName;
        localStorage.setItem('admin_data', JSON.stringify(admin));
      }

      // Call API untuk update global references
      await fetch('/api/admin/update-global-references', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newTpqName }),
      });

    } catch (error) {
      console.log('Warning: Could not update all references');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update context settings terlebih dahulu
        updateSettings(formData);
        
        // Update semua referensi nama TPQ di seluruh sistem
        await updateGlobalTpqReferences(formData.site_name);
        
        // Force refresh semua komponen yang menggunakan TpqContext
        setTimeout(() => {
          refreshSettings();
        }, 1000);
        
        setSaveMessage('✅ Informasi TPQ berhasil disimpan dan nama diupdate di seluruh sistem!');
        setTimeout(() => setSaveMessage(''), 3000);
        
      } else {
        console.error('API Error:', result);
        setSaveMessage(`❌ Gagal menyimpan: ${result.error || 'Unknown error'}`);
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('❌ Terjadi kesalahan saat menyimpan');
      setTimeout(() => setSaveMessage(''), 5000);
    }
    setIsSaving(false);
  };

  return (
    <AdminLayout currentPage="/admin/profile/info">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Informasi TPQ</h1>
            <p className="text-gray-600 mt-1">Kelola informasi dasar dan kontak TPQ Anda</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            saveMessage.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Informasi Dasar */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama TPQ *
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: TPQ Al-Hikmah"
              />
              <p className="text-xs text-gray-500 mt-1">Nama ini akan ditampilkan di seluruh website</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi TPQ
              </label>
              <textarea
                value={formData.site_description}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Deskripsi singkat tentang TPQ Anda..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Alamat lengkap TPQ..."
              />
            </div>
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="021-12345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="info@tpq.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="628123456789"
              />
              <p className="text-xs text-gray-500 mt-1">Untuk tombol floating WhatsApp di website</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Default WhatsApp
              </label>
              <textarea
                value={formData.whatsapp_message}
                onChange={(e) => handleInputChange('whatsapp_message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Pesan yang akan muncul saat pengunjung klik tombol WhatsApp"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">👁️ Preview</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Nama TPQ:</strong> {formData.site_name || 'Belum diisi'}</p>
            <p><strong>Deskripsi:</strong> {formData.site_description || 'Belum diisi'}</p>
            <p><strong>Alamat:</strong> {formData.address || 'Belum diisi'}</p>
            <p><strong>Kontak:</strong> {formData.phone || 'Belum diisi'} | {formData.email || 'Belum diisi'}</p>
            {formData.whatsapp && (
              <p><strong>WhatsApp:</strong> {formData.whatsapp}</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}