'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminProfileHistoryPage() {
  const [historyData, setHistoryData] = useState({
    establishment_year: '',
    founder: '',
    background: '',
    milestones: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load history data - untuk saat ini menggunakan data dummy
    setHistoryData({
      establishment_year: '2020',
      founder: 'H. Ahmad Subhan',
      background: 'TPQ Al-Hikmah didirikan dengan visi untuk memberikan pendidikan Al-Quran yang berkualitas kepada generasi muda Islam.',
      milestones: [
        { year: '2020', event: 'Pendirian TPQ Al-Hikmah' },
        { year: '2021', event: 'Penambahan program Tahfidz' },
        { year: '2022', event: 'Peresmian gedung baru' },
        { year: '2023', event: 'Program digitalisasi pembelajaran' }
      ]
    });
    setIsLoading(false);
  }, []);

  const handleInputChange = (field, value) => {
    setHistoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setHistoryData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const addMilestone = () => {
    setHistoryData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { year: '', event: '' }]
    }));
  };

  const removeMilestone = (index) => {
    setHistoryData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Sejarah TPQ berhasil disimpan!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Gagal menyimpan data. Silakan coba lagi.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/profile/history">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/profile/history">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sejarah TPQ</h1>
            <p className="text-gray-600">Kelola informasi sejarah dan perkembangan TPQ</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Menyimpan...</span>
              </div>
            ) : (
              '💾 Simpan Perubahan'
            )}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-lg ${
            saveMessage.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Dasar</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Pendirian
              </label>
              <input
                type="text"
                value={historyData.establishment_year}
                onChange={(e) => handleInputChange('establishment_year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendiri
              </label>
              <input
                type="text"
                value={historyData.founder}
                onChange={(e) => handleInputChange('founder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Nama pendiri TPQ"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latar Belakang Pendirian
            </label>
            <textarea
              value={historyData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Ceritakan latar belakang dan motivasi pendirian TPQ..."
            />
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tonggak Sejarah</h2>
            <button
              onClick={addMilestone}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Tambah Tonggak
            </button>
          </div>

          <div className="space-y-4">
            {historyData.milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <input
                    type="text"
                    value={milestone.year}
                    onChange={(e) => handleMilestoneChange(index, 'year', e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-gray-900"
                    placeholder="Tahun"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={milestone.event}
                    onChange={(e) => handleMilestoneChange(index, 'event', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Deskripsi peristiwa penting..."
                  />
                </div>
                <button
                  onClick={() => removeMilestone(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {historyData.milestones.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>Belum ada tonggak sejarah yang ditambahkan.</p>
              <p className="text-sm">Klik "Tambah Tonggak" untuk menambah peristiwa penting.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
