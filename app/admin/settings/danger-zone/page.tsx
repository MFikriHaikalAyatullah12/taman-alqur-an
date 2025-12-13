'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function DangerZonePage() {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const adminDataString = localStorage.getItem('admin_data');
    if (adminDataString) {
      setAdminData(JSON.parse(adminDataString));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const handleDeleteAll = async () => {
    if (confirmText !== 'HAPUS SEMUA DATA') {
      alert('Harap ketik "HAPUS SEMUA DATA" dengan tepat untuk melanjutkan');
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/danger-zone/delete-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Semua data telah berhasil dihapus!');
        setShowConfirm(false);
        setConfirmText('');
        router.push('/admin/dashboard');
      } else {
        alert(data.error || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout currentPage="/admin/settings/danger-zone">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danger Zone</h1>
            <p className="text-gray-600">Tindakan berbahaya yang tidak dapat dibatalkan</p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-red-600 text-lg">🚨</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Perhatian!</h3>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Tindakan ini akan menghapus SEMUA data milik akun Anda</li>
                <li>• Data yang dihapus termasuk: siswa, pengajar, keuangan, pengaturan</li>
                <li>• Tindakan ini TIDAK dapat dibatalkan setelah dikonfirmasi</li>
                <li>• Pastikan Anda telah membuat backup jika diperlukan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Informasi Akun</h3>
          {adminData && (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nama:</span> {adminData.name}</p>
              <p><span className="font-medium">Email:</span> {adminData.email}</p>
              <p><span className="font-medium">TPQ:</span> {adminData.tpq_name || 'TPQ AN-NABA'}</p>
            </div>
          )}
        </div>

        {/* Delete Section */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            🗑️ Hapus Semua Data
          </h3>
          <p className="text-gray-700 mb-6">
            Dengan menghapus semua data, seluruh informasi yang terkait dengan akun TPQ Anda akan dihapus secara permanen dari database.
            Ini akan mengosongkan penyimpanan dan mengembalikan akun ke kondisi seperti baru didaftarkan.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
            >
              <span>🗑️</span>
              Hapus Semua Data
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium mb-2">Konfirmasi Penghapusan</p>
                <p className="text-yellow-700 text-sm mb-3">
                  Untuk melanjutkan, ketik <strong>"HAPUS SEMUA DATA"</strong> pada kolom di bawah:
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ketik: HAPUS SEMUA DATA"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmText('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAll}
                  disabled={isDeleting || confirmText !== 'HAPUS SEMUA DATA'}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <span>💥</span>
                      Hapus Semua Data
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recovery Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Setelah Penghapusan</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>• Akun Anda akan tetap aktif, namun semua data akan kosong</p>
            <p>• Anda dapat langsung mulai menambah data baru</p>
            <p>• Pengaturan akun (nama, email, password) tidak akan terhapus</p>
            <p>• Penyimpanan database akan kembali optimal</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}