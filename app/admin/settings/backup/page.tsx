'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface BackupItem {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'auto' | 'manual';
  status: 'success' | 'failed' | 'in-progress';
}

export default function BackupSettingsPage() {
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: 'B001',
      name: 'backup_20240115_auto.sql',
      size: '25.6 MB',
      date: '2024-01-15 02:00:00',
      type: 'auto',
      status: 'success'
    },
    {
      id: 'B002',
      name: 'backup_20240114_manual.sql',
      size: '24.8 MB',
      date: '2024-01-14 15:30:00',
      type: 'manual',
      status: 'success'
    },
    {
      id: 'B003',
      name: 'backup_20240113_auto.sql',
      size: '23.9 MB',
      date: '2024-01-13 02:00:00',
      type: 'auto',
      status: 'failed'
    }
  ]);

  const [autoBackup, setAutoBackup] = useState({
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retention: '30'
  });

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  const createManualBackup = async () => {
    setIsCreatingBackup(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup: BackupItem = {
        id: `B${Date.now()}`,
        name: `backup_${new Date().toISOString().split('T')[0]}_manual.sql`,
        size: '25.1 MB',
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        type: 'manual',
        status: 'success'
      };
      
      setBackups([newBackup, ...backups]);
      alert('Backup berhasil dibuat!');
    } catch (error) {
      alert('Gagal membuat backup');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const downloadBackup = (backupId: string) => {
    // Simulate download
    const backup = backups.find(b => b.id === backupId);
    if (backup) {
      alert(`Mengunduh ${backup.name}`);
    }
  };

  const deleteBackup = (backupId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus backup ini?')) {
      setBackups(backups.filter(b => b.id !== backupId));
    }
  };

  const restoreBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (backup && confirm(`Apakah Anda yakin ingin mengembalikan data dari ${backup.name}? Ini akan mengganti semua data yang ada.`)) {
      alert('Proses restore dimulai. Harap tunggu...');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'auto' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Backup Data</h1>
          <button
            onClick={createManualBackup}
            disabled={isCreatingBackup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isCreatingBackup ? 'Membuat Backup...' : 'Buat Backup Manual'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Auto Backup Settings */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pengaturan Backup Otomatis</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={autoBackup.enabled}
                  onChange={(e) => setAutoBackup({...autoBackup, enabled: e.target.checked})}
                  className="mr-3"
                />
                <label htmlFor="autoBackup" className="font-medium">Aktifkan Backup Otomatis</label>
              </div>
              
              {autoBackup.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frekuensi</label>
                    <select
                      value={autoBackup.frequency}
                      onChange={(e) => setAutoBackup({...autoBackup, frequency: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Waktu Backup</label>
                    <input
                      type="time"
                      value={autoBackup.time}
                      onChange={(e) => setAutoBackup({...autoBackup, time: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Simpan Backup Selama (hari)</label>
                    <input
                      type="number"
                      value={autoBackup.retention}
                      onChange={(e) => setAutoBackup({...autoBackup, retention: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="365"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Backup lama akan dihapus otomatis setelah periode ini
                    </p>
                  </div>
                </>
              )}
              
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Simpan Pengaturan
              </button>
            </div>
          </div>

          {/* Backup Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Statistik Backup</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Backup</h3>
                <p className="text-2xl font-bold text-blue-600">{backups.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Backup Berhasil</h3>
                <p className="text-2xl font-bold text-green-600">
                  {backups.filter(b => b.status === 'success').length}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Backup Gagal</h3>
                <p className="text-2xl font-bold text-red-600">
                  {backups.filter(b => b.status === 'failed').length}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Ukuran</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {backups.reduce((total, backup) => {
                    const size = parseFloat(backup.size.replace(' MB', ''));
                    return total + size;
                  }, 0).toFixed(1)} MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Riwayat Backup</h2>
            <p className="text-gray-600 text-sm mt-1">
              Daftar semua backup yang telah dibuat
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ukuran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map((backup) => (
                  <tr key={backup.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {backup.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                        {backup.type === 'auto' ? 'Otomatis' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                        {backup.status === 'success' ? 'Berhasil' : 
                         backup.status === 'failed' ? 'Gagal' : 'Proses'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {backup.status === 'success' && (
                        <>
                          <button
                            onClick={() => downloadBackup(backup.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => restoreBackup(backup.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Restore
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}