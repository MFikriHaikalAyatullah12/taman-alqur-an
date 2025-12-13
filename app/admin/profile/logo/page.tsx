'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTpq } from '@/lib/TpqContext';

export default function AdminLogoPage() {
  const { settings, refreshSettings } = useTpq();
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLogo(settings.logo || '');
      setLogoPreview(settings.logo || '');
    }
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 2MB.');
        return;
      }

      setLogoFile(file);
      
      // Create canvas to compress image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 400x400)
        let { width, height } = img;
        const maxSize = 400;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        setLogoPreview(compressedDataUrl);
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      let logoBase64 = logo;

      // Convert file to base64 if new file is selected
      if (logoFile) {
        logoBase64 = logoPreview;
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_name: settings?.site_name || 'TPQ AN-NABA',
          logo: logoBase64
        })
      });

      if (response.ok) {
        // Force refresh settings immediately
        await refreshSettings();
        // Wait a bit then refresh again to ensure cache is updated
        setTimeout(() => {
          refreshSettings();
        }, 1000);
        alert('Logo berhasil diperbarui!');
        setLogoFile(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menyimpan logo');
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      alert('Terjadi kesalahan saat menyimpan logo');
    } finally {
      setIsSaving(false);
    }
  };

  const removeLogo = () => {
    setLogo('');
    setLogoPreview('');
    setLogoFile(null);
  };

  return (
    <AdminLayout currentPage="/admin/profile/logo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Logo</h1>
          <p className="text-gray-600">Upload logo TPQ AN-NABA sebagai identitas</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo TPQ AN-NABA
              </label>
              
              {/* Preview Logo */}
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="h-48 w-48 object-contain rounded-lg border border-gray-200 shadow-lg bg-white p-4"
                          style={{ imageRendering: 'crisp-edges' }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Preview Logo</p>
                        <p className="text-xs text-gray-500">Logo akan ditampilkan dengan kualitas tinggi</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Hapus Logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto h-48 w-48 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <span className="text-6xl text-gray-400">🏫</span>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 font-medium">Belum ada logo</p>
                        <p className="text-xs text-gray-400">Upload logo TPQ AN-NABA Anda untuk identitas yang profesional</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500 file:mr-4 file:py-3 file:px-6 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
                <p className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Format yang didukung:</span> JPG, PNG, GIF. 
                  <span className="font-medium">Maksimal:</span> 2MB. 
                  <span className="font-medium">Rekomendasi:</span> 400x400px untuk hasil terbaik.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tips Upload Logo:
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 font-bold">•</span>
                  <span>Gunakan <span className="font-medium">resolusi minimal 400x400 pixel</span> untuk kualitas terbaik</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 font-bold">•</span>
                  <span>Format <span className="font-medium">PNG dengan background transparan</span> ideal untuk fleksibilitas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 font-bold">•</span>
                  <span>Pastikan logo <span className="font-medium">terlihat jelas dan tajam</span> pada berbagai ukuran</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 font-bold">•</span>
                  <span>Hindari teks yang <span className="font-medium">terlalu kecil atau detail berlebihan</span></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2 font-bold">•</span>
                  <span>Logo akan <span className="font-medium">ditampilkan di header dan berbagai halaman</span> website</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Simpan Logo
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}