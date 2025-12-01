'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data testimoni
    setTestimonials([
      {
        id: 1,
        name: 'Ibu Siti Nurhaliza',
        role: 'Wali Santri',
        child: 'Ahmad Faiz',
        rating: 5,
        message: 'Alhamdulillah, sejak belajar di TPQ Al-Hikmah, anak saya semakin rajin sholat dan sudah hafal beberapa surat pendek. Metode pengajarannya sangat baik dan ustadz-ustadzahnya sabar.',
        date: '2024-01-15',
        photo: '/api/placeholder/60/60'
      },
      {
        id: 2,
        name: 'Bapak Muhammad Rizki',
        role: 'Wali Santri',
        child: 'Aisyah Putri',
        rating: 5,
        message: 'TPQ Al-Hikmah sangat membantu dalam pembentukan karakter anak. Aisyah sekarang lebih disiplin dan sopan. Program tahfidznya juga sangat bagus.',
        date: '2024-01-10',
        photo: '/api/placeholder/60/60'
      },
      {
        id: 3,
        name: 'Ibu Fatimah Azzahra',
        role: 'Wali Santri',
        child: 'Abdullah',
        rating: 5,
        message: 'Saya sangat puas dengan kualitas pengajaran di TPQ Al-Hikmah. Anak saya yang tadinya sulit diatur, sekarang lebih patuh dan rajin mengaji.',
        date: '2024-01-05',
        photo: '/api/placeholder/60/60'
      },
      {
        id: 4,
        name: 'Bapak Ahmad Sobirin',
        role: 'Wali Santri',
        child: 'Khadijah',
        rating: 5,
        message: 'Lingkungan belajar di TPQ Al-Hikmah sangat kondusif. Para ustadz dan ustadzah sangat kompeten dan memberikan perhatian yang baik kepada setiap santri.',
        date: '2024-01-01',
        photo: '/api/placeholder/60/60'
      },
      {
        id: 5,
        name: 'Ibu Maryam Solicha',
        role: 'Wali Santri',
        child: 'Umar bin Khattab',
        rating: 5,
        message: 'Program pembelajaran di TPQ Al-Hikmah sangat terstruktur. Anak saya sudah bisa membaca Al-Quran dengan lancar dalam waktu yang relatif singkat.',
        date: '2023-12-25',
        photo: '/api/placeholder/60/60'
      },
      {
        id: 6,
        name: 'Bapak Ibrahim Khalil',
        role: 'Wali Santri',
        child: 'Zainab',
        rating: 4,
        message: 'Fasilitas di TPQ Al-Hikmah cukup lengkap dan nyaman. Anak saya senang belajar di sini karena suasana yang menyenangkan.',
        date: '2023-12-20',
        photo: '/api/placeholder/60/60'
      }
    ]);
    setLoading(false);
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <PublicLayout currentPage="/testimonials">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/testimonials">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Testimoni Wali Santri
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dengarkan langsung pengalaman para wali santri tentang pendidikan di TPQ Al-Hikmah
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
              <div className="text-gray-600">Santri Aktif</div>
            </div>
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.9</div>
              <div className="text-gray-600">Rating Kepuasan</div>
            </div>
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Tingkat Kepuasan</div>
            </div>
            <div className="text-center bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">10</div>
              <div className="text-gray-600">Tahun Berpengalaman</div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-green-600">Wali dari {testimonial.child}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({testimonial.rating}/5)
                  </span>
                </div>

                {/* Message */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.message}"
                </p>

                {/* Date */}
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
                  {new Date(testimonial.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bergabunglah dengan Keluarga Besar TPQ Al-Hikmah
              </h2>
              <p className="text-gray-600 mb-6">
                Jadilah bagian dari komunitas yang telah merasakan manfaat pendidikan berkualitas di TPQ Al-Hikmah
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                  Daftar Sekarang
                </button>
                <button className="border-2 border-green-500 text-green-500 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-300">
                  Konsultasi Gratis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}