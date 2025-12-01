'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminVisionMissionPage() {
  const [visionMissionData, setVisionMissionData] = useState({
    vision: '',
    mission: [],
    values: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load vision mission data - untuk saat ini menggunakan data dummy
    setVisionMissionData({
      vision: 'Menjadi lembaga pendidikan Al-Quran terdepan yang mencetak generasi Qurani yang berakhlak mulia dan berwawasan luas.',
      mission: [
        'Menyelenggarakan pendidikan Al-Quran dengan metode yang mudah dan menyenangkan',
        'Membentuk karakter islami yang kuat pada setiap santri',
        'Mengintegrasikan nilai-nilai Al-Quran dalam kehidupan sehari-hari',
        'Menciptakan lingkungan belajar yang kondusif dan islami'
      ],
      values: [
        'Kejujuran dan Integritas',
        'Kedisiplinan dalam Beribadah',
        'Kasih Sayang dan Toleransi',
        'Keunggulan dalam Pembelajaran',
        'Tanggung Jawab Sosial'
      ]
    });
    setIsLoading(false);
  }, []);

  const handleVisionChange = (value) => {
    setVisionMissionData(prev => ({
      ...prev,
      vision: value
    }));
  };

  const handleMissionChange = (index, value) => {
    setVisionMissionData(prev => ({
      ...prev,
      mission: prev.mission.map((item, i) => i === index ? value : item)
    }));
  };

  const handleValueChange = (index, value) => {
    setVisionMissionData(prev => ({
      ...prev,
      values: prev.values.map((item, i) => i === index ? value : item)
    }));
  };

  const addMission = () => {
    setVisionMissionData(prev => ({
      ...prev,
      mission: [...prev.mission, '']
    }));
  };

  const removeMission = (index) => {
    setVisionMissionData(prev => ({
      ...prev,
      mission: prev.mission.filter((_, i) => i !== index)
    }));
  };

  const addValue = () => {
    setVisionMissionData(prev => ({
      ...prev,
      values: [...prev.values, '']
    }));
  };

  const removeValue = (index) => {
    setVisionMissionData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Visi & Misi berhasil disimpan!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Gagal menyimpan data. Silakan coba lagi.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="/admin/profile/vision-mission">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="/admin/profile/vision-mission">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visi & Misi</h1>
            <p className="text-gray-600">Kelola visi, misi, dan nilai-nilai TPQ</p>
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

        {/* Vision */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">🎯</span>
            Visi
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pernyataan Visi TPQ
            </label>
            <textarea
              value={visionMissionData.vision}
              onChange={(e) => handleVisionChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan visi TPQ..."
            />
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">🎯</span>
              Misi
            </h2>
            <button
              onClick={addMission}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ➕ Tambah Misi
            </button>
          </div>

          <div className="space-y-4">
            {visionMissionData.mission.map((mission, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    value={mission}
                    onChange={(e) => handleMissionChange(index, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Masukkan poin misi..."
                  />
                </div>
                <button
                  onClick={() => removeMission(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {visionMissionData.mission.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>Belum ada misi yang ditambahkan.</p>
              <p className="text-sm">Klik "Tambah Misi" untuk menambah poin misi.</p>
            </div>
          )}
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">⭐</span>
              Nilai-Nilai
            </h2>
            <button
              onClick={addValue}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              ➕ Tambah Nilai
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {visionMissionData.values.map((value, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Masukkan nilai-nilai TPQ..."
                  />
                </div>
                <button
                  onClick={() => removeValue(index)}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {visionMissionData.values.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">⭐</div>
              <p>Belum ada nilai-nilai yang ditambahkan.</p>
              <p className="text-sm">Klik "Tambah Nilai" untuk menambah nilai-nilai TPQ.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
