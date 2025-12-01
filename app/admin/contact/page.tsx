'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useTpq } from '@/lib/TpqContext';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
  reply?: string;
  replyDate?: string;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'C001',
      name: 'Ahmad Wijaya',
      email: 'ahmad@email.com',
      phone: '081234567890',
      subject: 'Informasi Pendaftaran',
      message: 'Saya ingin menanyakan tentang prosedur pendaftaran untuk anak saya. Bisakah dijelaskan persyaratan dan biayanya?',
      date: '2024-01-15',
      status: 'replied',
      reply: 'Terima kasih atas pertanyaannya. Untuk informasi pendaftaran, silakan datang langsung ke kantor TPQ atau hubungi nomor yang tertera.',
      replyDate: '2024-01-15'
    },
    {
      id: 'C002',
      name: 'Siti Nurhaliza',
      email: 'siti@email.com',
      phone: '085987654321',
      subject: 'Jadwal Kegiatan',
      message: 'Mohon informasi jadwal kegiatan mengaji dan program tambahan yang tersedia.',
      date: '2024-01-14',
      status: 'read'
    },
    {
      id: 'C003',
      name: 'Budi Santoso',
      email: 'budi@email.com',
      phone: '087765432100',
      subject: 'Keluhan Fasilitas',
      message: 'Saya ingin menyampaikan keluhan terkait fasilitas toilet yang perlu diperbaiki.',
      date: '2024-01-13',
      status: 'new'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { settings, updateSettings } = useTpq();
  const [contactSettings, setContactSettings] = useState({
    whatsapp: '',
    whatsapp_message: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setContactSettings({
        whatsapp: settings.whatsapp || '',
        whatsapp_message: settings.whatsapp_message || 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ'
      });
    }
  }, [settings]);

  const handleSaveContactSettings = async () => {
    setIsSavingSettings(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactSettings),
      });

      if (response.ok) {
        updateSettings(contactSettings);
        setSaveMessage('✅ Pengaturan WhatsApp berhasil disimpan!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('❌ Gagal menyimpan pengaturan WhatsApp');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('❌ Terjadi kesalahan saat menyimpan');
    }
    setIsSavingSettings(false);
  };

  const contactViaWhatsApp = (contact: Contact) => {
    let phone = contact.phone.replace(/^0+/, '');
    if (!phone.startsWith('62')) {
      phone = '62' + phone;
    }
    
    const message = encodeURIComponent(`Halo ${contact.name}, terima kasih telah menghubungi ${settings.site_name}. Terkait pertanyaan Anda tentang "${contact.subject}", kami siap membantu.`);
    const url = `https://wa.me/${phone}?text=${message}`;
    
    window.open(url, '_blank');
    
    // Update status to read if it's new
    if (contact.status === 'new') {
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, status: 'read' } : c
      ));
    }
  };

  const filteredContacts = filterStatus === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Baru';
      case 'read': return 'Dibaca';
      case 'replied': return 'Dibalas';
      default: return status;
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'new') {
      // Mark as read
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, status: 'read' as const } : c
      ));
    }
  };

  const handleReply = () => {
    if (selectedContact && replyMessage.trim()) {
      const updatedContact = {
        ...selectedContact,
        status: 'replied' as const,
        reply: replyMessage,
        replyDate: new Date().toISOString().split('T')[0]
      };
      
      setContacts(contacts.map(c => 
        c.id === selectedContact.id ? updatedContact : c
      ));
      
      setSelectedContact(updatedContact);
      setReplyMessage('');
      setShowReplyForm(false);
    }
  };

  const newContactsCount = contacts.filter(c => c.status === 'new').length;
  const readContactsCount = contacts.filter(c => c.status === 'read').length;
  const repliedContactsCount = contacts.filter(c => c.status === 'replied').length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manajemen Kontak</h1>
        </div>

        {/* WhatsApp Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">⚙️ Pengaturan WhatsApp</h2>
            <button
              onClick={handleSaveContactSettings}
              disabled={isSavingSettings}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                isSavingSettings 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSavingSettings ? '⏳ Menyimpan...' : '💾 Simpan'}
            </button>
          </div>
          
          {/* Save Message */}
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg ${
              saveMessage.includes('berhasil') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {saveMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp *
              </label>
              <input
                type="text"
                value={contactSettings.whatsapp}
                onChange={(e) => setContactSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="628123456789 (dengan kode negara)"
              />
              <p className="text-sm text-gray-500 mt-1">Nomor ini akan ditampilkan sebagai tombol floating WhatsApp di website publik</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan Default WhatsApp
              </label>
              <textarea
                value={contactSettings.whatsapp_message}
                onChange={(e) => setContactSettings(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Pesan yang akan muncul saat pengunjung klik tombol WhatsApp"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">👁️ Preview WhatsApp</h4>
            <div className="text-green-700">
              <p><strong>Nomor:</strong> {contactSettings.whatsapp || 'Belum diisi'}</p>
              <p><strong>Pesan:</strong> {contactSettings.whatsapp_message || 'Belum diisi'}</p>
              {contactSettings.whatsapp && (
                <div className="mt-2">
                  <a
                    href={`https://wa.me/${contactSettings.whatsapp}?text=${encodeURIComponent(contactSettings.whatsapp_message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    💬 Test WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Pesan</h3>
            <p className="text-2xl font-bold text-blue-600">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Pesan Baru</h3>
            <p className="text-2xl font-bold text-red-600">{newContactsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Sudah Dibaca</h3>
            <p className="text-2xl font-bold text-yellow-600">{readContactsCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Sudah Dibalas</h3>
            <p className="text-2xl font-bold text-green-600">{repliedContactsCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="font-medium">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="new">Pesan Baru</option>
              <option value="read">Sudah Dibaca</option>
              <option value="replied">Sudah Dibalas</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contacts List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Daftar Pesan</h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredContacts.length} pesan
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleViewContact(contact)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {getStatusLabel(contact.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1">{contact.subject}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{contact.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">{contact.email}</span>
                    <span className="text-xs text-gray-400">{contact.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Detail */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Detail Pesan</h2>
            </div>
            <div className="p-6">
              {selectedContact ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{selectedContact.name}</h3>
                        <p className="text-gray-600">{selectedContact.email}</p>
                        <p className="text-gray-600">{selectedContact.phone}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedContact.status)}`}>
                        {getStatusLabel(selectedContact.status)}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Subjek:</h4>
                      <p className="text-gray-700">{selectedContact.subject}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Pesan:</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Dikirim pada: {selectedContact.date}
                    </div>
                  </div>

                  {/* Reply Section */}
                  {selectedContact.reply && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Balasan:</h4>
                      <p className="text-green-700 whitespace-pre-wrap">{selectedContact.reply}</p>
                      <div className="text-sm text-green-600 mt-2">
                        Dibalas pada: {selectedContact.replyDate}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {showReplyForm ? (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Balas Pesan:</h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tulis balasan Anda..."
                      ></textarea>
                      <div className="flex gap-2">
                        <button
                          onClick={handleReply}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Kirim Balasan
                        </button>
                        <button
                          onClick={() => {
                            setShowReplyForm(false);
                            setReplyMessage('');
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4 flex gap-2">
                      {selectedContact.phone && (
                        <button
                          onClick={() => contactViaWhatsApp(selectedContact)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          💬 Chat WhatsApp
                        </button>
                      )}
                      {selectedContact.status !== 'replied' && (
                        <button
                          onClick={() => setShowReplyForm(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          📧 Balas Email
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Pilih pesan untuk melihat detail
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}