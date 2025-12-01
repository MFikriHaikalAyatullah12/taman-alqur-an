'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  email?: string;
  phone?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 'T001',
      name: 'Ahmad Wijaya',
      role: 'Wali Murid',
      avatar: '/images/avatar-1.jpg',
      content: 'TPQ ini sangat bagus untuk pendidikan agama anak-anak. Guru-gurunya sabar dan metode pengajarannya mudah dipahami.',
      rating: 5,
      date: '2024-01-15',
      status: 'approved',
      email: 'ahmad@email.com',
      phone: '081234567890'
    },
    {
      id: 'T002',
      name: 'Siti Nurhaliza',
      role: 'Alumni',
      avatar: '/images/avatar-2.jpg',
      content: 'Saya sangat berterima kasih kepada TPQ ini. Ilmu yang saya dapatkan sangat bermanfaat hingga sekarang.',
      rating: 5,
      date: '2024-01-10',
      status: 'approved',
      email: 'siti@email.com'
    },
    {
      id: 'T003',
      name: 'Budi Santoso',
      role: 'Wali Murid',
      avatar: '/images/avatar-3.jpg',
      content: 'Fasilitas yang disediakan cukup lengkap dan lingkungan belajar yang kondusif.',
      rating: 4,
      date: '2024-01-08',
      status: 'pending',
      email: 'budi@email.com',
      phone: '087765432100'
    },
    {
      id: 'T004',
      name: 'Rina Marlina',
      role: 'Wali Murid',
      avatar: '/images/avatar-4.jpg',
      content: 'Kurang puas dengan pelayanan administrasi yang lambat.',
      rating: 2,
      date: '2024-01-05',
      status: 'rejected'
    }
  ]);

  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTestimonials = filterStatus === 'all' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'approved': return 'Disetujui';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const handleStatusChange = (testimonialId: string, newStatus: 'approved' | 'rejected') => {
    setTestimonials(testimonials.map(t => 
      t.id === testimonialId ? { ...t, status: newStatus } : t
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const pendingCount = testimonials.filter(t => t.status === 'pending').length;
  const approvedCount = testimonials.filter(t => t.status === 'approved').length;
  const rejectedCount = testimonials.filter(t => t.status === 'rejected').length;
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manajemen Testimoni</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tambah Testimoni
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Testimoni</h3>
            <p className="text-2xl font-bold text-blue-600">{testimonials.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Menunggu Review</h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Disetujui</h3>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Ditolak</h3>
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Rating Rata-rata</h3>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-purple-600 mr-2">{averageRating.toFixed(1)}</p>
              <div className="flex">{renderStars(Math.round(averageRating))}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="font-medium">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Review</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Add Testimonial Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Tambah Testimoni Baru</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Masukkan nama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Peran</label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option value="Wali Murid">Wali Murid</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Masyarakat">Masyarakat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Masukkan email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">No. Telepon</label>
                  <input
                    type="tel"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Masukkan no. telepon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <select className="w-full border rounded-lg px-3 py-2">
                    <option value="5">5 Bintang - Sangat Puas</option>
                    <option value="4">4 Bintang - Puas</option>
                    <option value="3">3 Bintang - Cukup</option>
                    <option value="2">2 Bintang - Kurang</option>
                    <option value="1">1 Bintang - Sangat Kurang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Testimoni</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={4}
                    placeholder="Tulis testimoni..."
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3B82F6&color=fff`;
                    }}
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                  {getStatusLabel(testimonial.status)}
                </span>
              </div>

              <div className="flex items-center mb-3">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-500">({testimonial.rating}/5)</span>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {testimonial.content}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>{testimonial.date}</span>
                {testimonial.email && (
                  <span>{testimonial.email}</span>
                )}
              </div>

              {testimonial.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(testimonial.id, 'approved')}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleStatusChange(testimonial.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700"
                  >
                    Tolak
                  </button>
                </div>
              )}

              {testimonial.status !== 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTestimonial(testimonial)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Lihat Detail
                  </button>
                  <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-400">
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedTestimonial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Detail Testimoni</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={selectedTestimonial.avatar}
                    alt={selectedTestimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTestimonial.name)}&background=3B82F6&color=fff`;
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-medium">{selectedTestimonial.name}</h3>
                    <p className="text-gray-600">{selectedTestimonial.role}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(selectedTestimonial.rating)}
                      <span className="ml-2 text-sm text-gray-500">({selectedTestimonial.rating}/5)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Testimoni:</h4>
                  <p className="text-gray-700">{selectedTestimonial.content}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p>{selectedTestimonial.email || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Telepon:</span>
                      <p>{selectedTestimonial.phone || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tanggal:</span>
                      <p>{selectedTestimonial.date}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p>{getStatusLabel(selectedTestimonial.status)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTestimonial(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}