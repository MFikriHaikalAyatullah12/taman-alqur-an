'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTpq } from '@/lib/TpqContext';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useTpq();

  const slides = [
    {
      title: `Taman Pendidikan Al-Quran ${settings.site_name}`,
      subtitle: "Membentuk Generasi Qurani Berakhlak Mulia",
      description: `${settings.site_name} memberikan pendidikan Al-Quran yang berkualitas dengan metode modern dan pengajar berpengalaman.`,
      image: "/images/hero1.jpg"
    },
    {
      title: "Pendaftaran Santri Baru",
      subtitle: "Tahun Ajaran 2024/2025",
      description: `Ayo bergabung dengan keluarga besar ${settings.site_name}. Daftarkan putra-putri Anda sekarang juga!`,
      image: "/images/hero2.jpg"
    },
    {
      title: "Program Tahfidz Quran",
      subtitle: "Menghafal Al-Quran dengan Metode Terpadu",
      description: "Program tahfidz dengan bimbingan ustadz berpengalaman dan suasana pembelajaran yang kondusif.",
      image: "/images/hero3.jpg"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "📖",
      title: "Kurikulum Terpadu",
      description: "Iqra, Tahsin, Tahfidz, dan Adab Islami"
    },
    {
      icon: "👨‍🏫",
      title: "Pengajar Berkualitas",
      description: "Ustadz dan Ustadzah berpengalaman"
    },
    {
      icon: "🏫",
      title: "Fasilitas Lengkap",
      description: "Ruang belajar nyaman dan perpustakaan"
    },
    {
      icon: "📱",
      title: "Sistem Digital",
      description: "Monitoring progress secara online"
    }
  ];

  const programs = [
    {
      level: "Iqra 1-6",
      description: "Pengenalan huruf hijaiyah hingga bacaan dasar",
      duration: "8-12 minggu per jilid",
      icon: "🅰️"
    },
    {
      level: "Al-Quran",
      description: "Membaca Al-Quran 30 Juz dengan tartil",
      duration: "2 tahun",
      icon: "📚"
    },
    {
      level: "Tahfidz",
      description: "Program menghafal Al-Quran mulai Juz 30",
      duration: "Sesuai kemampuan",
      icon: "🧠"
    },
    {
      level: "Tahsin",
      description: "Perbaikan bacaan dan tajwid",
      duration: "6 bulan",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-800">{settings.site_name}</h1>
                <p className="text-xs text-gray-600">Taman Pendidikan Al-Quran</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
                Beranda
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
                Tentang
              </Link>
              <Link href="#programs" className="text-gray-700 hover:text-green-600 transition-colors">
                Program
              </Link>
              <Link href="#gallery" className="text-gray-700 hover:text-green-600 transition-colors">
                Galeri
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Kontak
              </Link>
              <Link href="/admin/login" className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                Admin
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                <Link href="#home" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Beranda
                </Link>
                <Link href="#about" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Tentang
                </Link>
                <Link href="#programs" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Program
                </Link>
                <Link href="#gallery" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Galeri
                </Link>
                <Link href="#contact" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                  Kontak
                </Link>
                <Link href="/admin/login" className="block px-3 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg mx-3 text-center">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10"></div>
        
        {/* Background slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
          </div>
        ))}

        <div className="relative z-20 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              {slides[currentSlide].title}
            </h1>
            <h2 className="text-xl md:text-3xl mb-6 animate-slide-up">
              {slides[currentSlide].subtitle}
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in">
              {slides[currentSlide].description}
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/registration"
                className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="#about"
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Keunggulan {settings.site_name}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pendidikan Al-Quran terbaik dengan fasilitas dan metode pembelajaran yang modern
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Tentang {settings.site_name}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  {settings.site_name} didirikan pada tahun 2010 dengan visi menjadi lembaga pendidikan Al-Quran terdepan yang menghasilkan generasi Qurani, berakhlak mulia, dan berprestasi.
                </p>
                <p>
                  Kami menyelenggarakan pendidikan Al-Quran yang berkualitas dengan menggunakan metode pembelajaran yang terpadu dan modern, didukung oleh pengajar yang berpengalaman dan bersertifikat.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">500+</div>
                    <div className="text-sm text-gray-600">Santri Aktif</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">Pengajar</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">13+</div>
                    <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">100+</div>
                    <div className="text-sm text-gray-600">Alumni</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 w-full h-96 rounded-2xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🕌</div>
                  <h3 className="text-2xl font-bold mb-2">{settings.site_name}</h3>
                  <p className="text-lg">Rumah Kedua Para Santri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Program Pembelajaran
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai program pembelajaran Al-Quran yang disesuaikan dengan tingkat kemampuan santri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {program.level}
                </h3>
                <p className="text-gray-600 mb-3">{program.description}</p>
                <div className="text-sm text-green-600 font-medium">
                  Durasi: {program.duration}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/curriculum"
              className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Lihat Detail Kurikulum
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bergabunglah dengan Keluarga Besar {settings.site_name}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan Al-Quran terbaik
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/registration"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Daftar Santri Baru
            </Link>
            <Link
              href="#contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg text-gray-600">
              Kami siap membantu Anda dengan informasi lebih lanjut tentang {settings.site_name}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Alamat</h3>
                    <p className="text-gray-600">Jl. Pendidikan No. 123, Jakarta Selatan</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Telepon</h3>
                    <p className="text-gray-600">021-12345678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                    <p className="text-gray-600">+62 812-3456-789</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">info@tpqalhikmah.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">🕐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Jam Operasional</h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 15.00 - 17.00<br />
                      Sabtu - Minggu: 08.00 - 10.00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Nomor WhatsApp"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Pesan Anda"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{settings.site_name}</h3>
                  <p className="text-sm text-gray-300">Taman Pendidikan Al-Quran</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Memberikan pendidikan Al-Quran berkualitas untuk membentuk generasi yang berakhlak mulia dan berprestasi.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  <span className="sr-only">YouTube</span>
                  📹
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Program</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-green-400 transition-colors">Iqra 1-6</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Al-Quran</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Tahfidz</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Tahsin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-green-400 transition-colors">Tentang Kami</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Pengajar</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Galeri</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Berita</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {settings.site_name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}