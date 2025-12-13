'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface OrgMember {
  id: number;
  position: string;
  name: string;
  image: string;
  description: string;
}

export default function OrganizationPage() {
  const [mounted, setMounted] = useState(false);
  const [orgStructure, setOrgStructure] = useState<OrgMember[]>([
    { id: 1, position: 'Kepala TPQ', name: 'Ustadz Ahmad Fauzi', image: 'https://ui-avatars.com/api/?name=AF&background=4ade80&color=ffffff&size=150&rounded=true', description: 'Memimpin dan mengawasi seluruh kegiatan TPQ' },
    { id: 2, position: 'Wakil Kepala', name: 'Ustadzah Siti Fatimah', image: 'https://ui-avatars.com/api/?name=SF&background=22c55e&color=ffffff&size=150&rounded=true', description: 'Membantu kepala dalam mengelola TPQ' },
    { id: 3, position: 'Koordinator Pendidikan', name: 'Ustadz Muhammad Yusuf', image: 'https://ui-avatars.com/api/?name=MY&background=16a34a&color=ffffff&size=150&rounded=true', description: 'Mengkoordinasi program pembelajaran' },
    { id: 4, position: 'Bendahara', name: 'Ustadzah Aminah', image: 'https://ui-avatars.com/api/?name=A&background=15803d&color=ffffff&size=150&rounded=true', description: 'Mengelola keuangan TPQ' },
    { id: 5, position: 'Sekretaris', name: 'Ustadz Abdul Rahman', image: 'https://ui-avatars.com/api/?name=AR&background=166534&color=ffffff&size=150&rounded=true', description: 'Mengelola administrasi TPQ' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<OrgMember | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    name: '',
    image: 'https://ui-avatars.com/api/?name=USER&background=4ade80&color=ffffff&size=150&rounded=true',
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      position: '',
      name: '',
      image: 'https://ui-avatars.com/api/?name=USER&background=4ade80&color=ffffff&size=150&rounded=true',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (member: OrgMember) => {
    setEditingMember(member);
    setFormData({
      position: member.position,
      name: member.name,
      image: member.image,
      description: member.description
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingMember) {
      setOrgStructure(prev => prev.map(member => 
        member.id === editingMember.id 
          ? { ...member, ...formData }
          : member
      ));
    } else {
      const newId = Math.max(...orgStructure.map(m => m.id), 0) + 1;
      setOrgStructure(prev => [...prev, { id: newId, ...formData }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setOrgStructure(prev => prev.filter(member => member.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <AdminLayout currentPage="/admin/profile/organization">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Struktur Organisasi</h1>
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            ➕ Tambah Posisi
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgStructure.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center border-4 border-green-100">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <div className="w-full space-y-2 mb-4">
                  <h3 className="font-bold text-lg text-gray-900 break-words leading-tight">{member.name}</h3>
                  <p className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-block">{member.position}</p>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{member.description}</p>
                </div>
                <div className="flex space-x-2 justify-center w-full">
                  <button 
                    onClick={() => handleEdit(member)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(member.id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors font-medium"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingMember ? '✏️ Edit Posisi' : '➕ Tambah Posisi'}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {editingMember ? 'Ubah informasi posisi organisasi' : 'Tambahkan posisi baru dalam organisasi'}
                </p>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📋 Posisi/Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: Kepala TPQ, Wakil Kepala, Bendahara"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📝 Deskripsi Tugas <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                      placeholder="Jelaskan tugas dan tanggung jawab posisi ini..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.position || !formData.name || !formData.description}
                  className="px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  💾 {editingMember ? 'Update' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🗑️ Konfirmasi Hapus
                </h2>
                <p className="text-red-100 text-sm mt-1">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Apakah Anda yakin ingin menghapus posisi ini?</p>
                    <p className="text-gray-600 text-sm mt-1">Data yang dihapus tidak dapat dikembalikan</p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  ❌ Batal
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}