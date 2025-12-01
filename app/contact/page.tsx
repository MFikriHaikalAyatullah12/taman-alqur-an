'use client';

import { useState, useEffect } from 'react';
import PublicLayout from '@/components/PublicLayout';

interface ContactSettings {
  whatsapp: string;
  whatsappMessage: string;
  phone: string;
  email: string;
  address: string;
  operationalHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapEmbed?: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data kontak dari admin settings API
    fetch('/api/public/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          whatsapp: data.whatsapp || '6281234567890',
          whatsappMessage: data.whatsappMessage || 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
          phone: data.phone || '(021) 123-4567',
          email: data.email || 'info@tpq.com',
          address: data.address || 'Jl. Masjid Raya No. 123',
          operationalHours: {
            weekdays: data.weekdaysHours || 'Senin - Jumat: 15:00 - 17:00',
            saturday: data.saturdayHours || 'Sabtu: 08:00 - 10:00',
            sunday: data.sundayHours || 'Minggu: Libur'
          },
          mapEmbed: data.mapEmbed
        });
      })
      .catch(() => {
        // Fallback data jika API gagal
        setSettings({
          whatsapp: '6281234567890',
          whatsappMessage: 'Assalamu\'alaikum, saya ingin bertanya tentang TPQ',
          phone: '(021) 123-4567',
          email: 'info@tpq.com',
          address: 'Jl. Masjid Raya No. 123',
          operationalHours: {
            weekdays: 'Senin - Jumat: 15:00 - 17:00',
            saturday: 'Sabtu: 08:00 - 10:00',
            sunday: 'Minggu: Libur'
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleWhatsAppChat = () => {
    if (settings?.whatsapp) {
      const message = encodeURIComponent(settings.whatsappMessage);
      const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handlePhoneCall = () => {
    if (settings?.phone) {
      window.location.href = `tel:${settings.phone}`;
    }
  };

  const handleEmailSend = () => {
    if (settings?.email) {
      window.location.href = `mailto:${settings.email}`;
    }
  };

  if (loading) {
    return (
      <PublicLayout currentPage="/contact">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout currentPage="/contact">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl text-gray-600">
              Silakan hubungi kami untuk informasi lebih lanjut
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Quick Contact Buttons */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hubungi Langsung</h2>
                
                <div className="space-y-4">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppChat}
                    className="w-full flex items-center space-x-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h3 className="font-bold">Chat WhatsApp</h3>
                      <p className="text-sm opacity-90">Respon cepat & mudah</p>
                    </div>
                    <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
                  </button>

                  {/* Phone */}
                  <button
                    onClick={handlePhoneCall}
                    className="w-full flex items-center space-x-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h3 className="font-bold">Telepon</h3>
                      <p className="text-sm opacity-90">{settings?.phone}</p>
                    </div>
                    <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleEmailSend}
                    className="w-full flex items-center space-x-4 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <div className="flex-grow text-left">
                      <h3 className="font-bold">Email</h3>
                      <p className="text-sm opacity-90">{settings?.email}</p>
                    </div>
                    <div className="text-2xl group-hover:translate-x-1 transition-transform">→</div>
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Alamat</h3>
                      <p className="text-gray-600">{settings?.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Jam Operasional</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>{settings?.operationalHours.weekdays}</p>
                        <p>{settings?.operationalHours.saturday}</p>
                        <p>{settings?.operationalHours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lokasi Kami</h2>
              <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Peta Lokasi TPQ Al-Hikmah</p>
                  <p className="text-sm mt-1">{settings?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}