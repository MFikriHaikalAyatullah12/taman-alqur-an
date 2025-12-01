'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';

interface RegistrationForm {
  // Student Information
  full_name: string;
  nick_name: string;
  birth_date: string;
  birth_place: string;
  gender: 'male' | 'female' | '';
  address: string;
  previous_education: string;
  
  // Parent Information
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  parent_occupation: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  
  // Health Information
  health_conditions: string;
  allergies: string;
  medications: string;
  
  // Program Selection
  desired_program: string;
  preferred_schedule: string;
  
  // Additional Information
  motivation: string;
  previous_islamic_education: string;
  special_needs: string;
}

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationForm>({
    full_name: '',
    nick_name: '',
    birth_date: '',
    birth_place: '',
    gender: '',
    address: '',
    previous_education: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_occupation: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    health_conditions: '',
    allergies: '',
    medications: '',
    desired_program: '',
    preferred_schedule: '',
    motivation: '',
    previous_islamic_education: '',
    special_needs: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const totalSteps = 5;
  const stepTitles = [
    'Informasi Santri',
    'Informasi Orang Tua',
    'Kontak Darurat & Kesehatan',
    'Program & Jadwal',
    'Informasi Tambahan'
  ];

  const updateFormData = (field: keyof RegistrationForm, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.full_name.trim()) newErrors.full_name = 'Nama lengkap harus diisi';
        if (!formData.birth_date) newErrors.birth_date = 'Tanggal lahir harus diisi';
        if (!formData.birth_place.trim()) newErrors.birth_place = 'Tempat lahir harus diisi';
        if (!formData.gender) newErrors.gender = 'Jenis kelamin harus dipilih';
        if (!formData.address.trim()) newErrors.address = 'Alamat harus diisi';
        break;
      
      case 2:
        if (!formData.parent_name.trim()) newErrors.parent_name = 'Nama orang tua harus diisi';
        if (!formData.parent_phone.trim()) newErrors.parent_phone = 'Nomor HP orang tua harus diisi';
        if (formData.parent_email && !/\S+@\S+\.\S+/.test(formData.parent_email)) {
          newErrors.parent_email = 'Format email tidak valid';
        }
        break;
      
      case 3:
        if (!formData.emergency_contact_name.trim()) newErrors.emergency_contact_name = 'Nama kontak darurat harus diisi';
        if (!formData.emergency_contact_phone.trim()) newErrors.emergency_contact_phone = 'Nomor kontak darurat harus diisi';
        if (!formData.emergency_contact_relation.trim()) newErrors.emergency_contact_relation = 'Hubungan kontak darurat harus diisi';
        break;
      
      case 4:
        if (!formData.desired_program) newErrors.desired_program = 'Program harus dipilih';
        if (!formData.preferred_schedule) newErrors.preferred_schedule = 'Jadwal harus dipilih';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/student-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Pendaftaran berhasil! Nomor registrasi Anda: ${result.registration_number}`);
        router.push('/registration/success?number=' + result.registration_number);
      } else {
        const error = await response.json();
        alert('Pendaftaran gagal: ' + (error.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Santri</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => updateFormData('full_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.full_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap santri"
                />
                {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={formData.nick_name}
                  onChange={(e) => updateFormData('nick_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nama panggilan sehari-hari"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => updateFormData('birth_date', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.birth_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Lahir *
                </label>
                <input
                  type="text"
                  value={formData.birth_place}
                  onChange={(e) => updateFormData('birth_place', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.birth_place ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Kota tempat lahir"
                />
                {errors.birth_place && <p className="text-red-500 text-sm mt-1">{errors.birth_place}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin *
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => updateFormData('gender', e.target.value as 'male' | 'female')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Laki-laki</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => updateFormData('gender', e.target.value as 'male' | 'female')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Perempuan</span>
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Alamat lengkap tempat tinggal"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan Sebelumnya
              </label>
              <input
                type="text"
                value={formData.previous_education}
                onChange={(e) => updateFormData('previous_education', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="TK/SD/SMP/SMA atau lainnya"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Orang Tua/Wali</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Orang Tua/Wali *
                </label>
                <input
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => updateFormData('parent_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.parent_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nama lengkap orang tua/wali"
                />
                {errors.parent_name && <p className="text-red-500 text-sm mt-1">{errors.parent_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={formData.parent_occupation}
                  onChange={(e) => updateFormData('parent_occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Pekerjaan orang tua/wali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor HP/WhatsApp *
                </label>
                <input
                  type="tel"
                  value={formData.parent_phone}
                  onChange={(e) => updateFormData('parent_phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.parent_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.parent_phone && <p className="text-red-500 text-sm mt-1">{errors.parent_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => updateFormData('parent_email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.parent_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com (opsional)"
                />
                {errors.parent_email && <p className="text-red-500 text-sm mt-1">{errors.parent_email}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontak Darurat & Kesehatan</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Kontak Darurat</h3>
              <p className="text-sm text-yellow-700">
                Mohon isi kontak darurat selain orang tua/wali yang dapat dihubungi sewaktu-waktu.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kontak Darurat *
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) => updateFormData('emergency_contact_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nama lengkap"
                />
                {errors.emergency_contact_name && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor HP Kontak Darurat *
                </label>
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => updateFormData('emergency_contact_phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.emergency_contact_phone && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hubungan dengan Santri *
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact_relation}
                  onChange={(e) => updateFormData('emergency_contact_relation', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.emergency_contact_relation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Kakek/Nenek/Paman/Tante/dll"
                />
                {errors.emergency_contact_relation && <p className="text-red-500 text-sm mt-1">{errors.emergency_contact_relation}</p>}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Informasi Kesehatan</h3>
              <p className="text-sm text-blue-700">
                Mohon isi informasi kesehatan santri untuk membantu kami memberikan perawatan yang tepat.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Riwayat Penyakit/Kondisi Kesehatan
                </label>
                <textarea
                  value={formData.health_conditions}
                  onChange={(e) => updateFormData('health_conditions', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Tulis 'Tidak ada' jika tidak ada riwayat penyakit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergi
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => updateFormData('allergies', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Alergi makanan, obat, atau lainnya. Tulis 'Tidak ada' jika tidak ada alergi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obat-obatan yang Dikonsumsi
                </label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Obat-obatan rutin yang dikonsumsi. Tulis 'Tidak ada' jika tidak ada"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilihan Program & Jadwal</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program yang Diinginkan *
              </label>
              <select
                value={formData.desired_program}
                onChange={(e) => updateFormData('desired_program', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.desired_program ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Program</option>
                <option value="iqra_1">Iqra 1 - Pengenalan Huruf Hijaiyah</option>
                <option value="iqra_2">Iqra 2 - Harakat Dasar</option>
                <option value="iqra_3">Iqra 3 - Bacaan Panjang</option>
                <option value="iqra_4">Iqra 4 - Tajwid Dasar</option>
                <option value="iqra_5">Iqra 5 - Bacaan Gharib</option>
                <option value="iqra_6">Iqra 6 - Persiapan Al-Quran</option>
                <option value="alquran">Al-Quran - Tartil 30 Juz</option>
                <option value="tahfidz">Tahfidz - Menghafal Al-Quran</option>
                <option value="tahsin">Tahsin - Perbaikan Bacaan</option>
              </select>
              {errors.desired_program && <p className="text-red-500 text-sm mt-1">{errors.desired_program}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jadwal Preferensi *
              </label>
              <div className="space-y-3">
                {[
                  { value: 'senin_rabu_15', label: 'Senin & Rabu, 15:30-17:00' },
                  { value: 'selasa_kamis_15', label: 'Selasa & Kamis, 15:30-17:00' },
                  { value: 'sabtu_pagi', label: 'Sabtu, 08:00-10:00' },
                  { value: 'minggu_pagi', label: 'Minggu, 08:00-10:00' },
                  { value: 'sabtu_sore', label: 'Sabtu, 15:30-17:00' },
                  { value: 'minggu_sore', label: 'Minggu, 15:30-17:00' }
                ].map((schedule) => (
                  <label key={schedule.value} className="flex items-center">
                    <input
                      type="radio"
                      name="preferred_schedule"
                      value={schedule.value}
                      checked={formData.preferred_schedule === schedule.value}
                      onChange={(e) => updateFormData('preferred_schedule', e.target.value)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{schedule.label}</span>
                  </label>
                ))}
              </div>
              {errors.preferred_schedule && <p className="text-red-500 text-sm mt-1">{errors.preferred_schedule}</p>}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">📋 Informasi Program</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p>• Durasi pembelajaran: 8-12 minggu per jilid (disesuaikan kemampuan santri)</p>
                <p>• Metode pembelajaran: Ummi dan Baghdadiyah</p>
                <p>• Maksimal 15 santri per kelas</p>
                <p>• Ujian kenaikan jilid setiap akhir periode</p>
                <p>• Laporan progress bulanan untuk orang tua</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Tambahan</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivasi Masuk TPQ
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => updateFormData('motivation', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Ceritakan motivasi dan harapan masuk TPQ Al-Hikmah"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pengalaman Pendidikan Islam Sebelumnya
              </label>
              <textarea
                value={formData.previous_islamic_education}
                onChange={(e) => updateFormData('previous_islamic_education', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Apakah pernah belajar mengaji sebelumnya? Di mana? Sampai tingkat apa?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kebutuhan Khusus
              </label>
              <textarea
                value={formData.special_needs}
                onChange={(e) => updateFormData('special_needs', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Ada kebutuhan khusus dalam pembelajaran? Tulis 'Tidak ada' jika tidak ada"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">💰 Informasi Biaya</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <div className="flex justify-between">
                  <span>Biaya Pendaftaran:</span>
                  <span className="font-semibold">Rp 150.000</span>
                </div>
                <div className="flex justify-between">
                  <span>SPP Bulanan:</span>
                  <span className="font-semibold">Rp 100.000</span>
                </div>
                <div className="border-t border-blue-300 pt-2 mt-2">
                  <p className="text-xs">
                    * Biaya sudah termasuk modul pembelajaran dan sertifikat
                  </p>
                  <p className="text-xs">
                    * Pembayaran dapat dilakukan secara tunai atau transfer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">📝 Langkah Selanjutnya</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>1. Formulir pendaftaran akan diverifikasi tim TPQ (1-2 hari kerja)</p>
                <p>2. Orang tua akan dihubungi untuk konfirmasi dan wawancara singkat</p>
                <p>3. Pembayaran biaya pendaftaran</p>
                <p>4. Tes penempatan level untuk santri</p>
                <p>5. Mulai pembelajaran sesuai jadwal</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicLayout currentPage="/registration" showAuth={false}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pendaftaran Santri Baru
            </h1>
            <p className="text-lg text-gray-600">
              TPQ Al-Hikmah Tahun Ajaran 2024/2025
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Step {currentStep} dari {totalSteps}: {stepTitles[currentStep - 1]}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Sebelumnya
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Selanjutnya →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </div>
                  ) : (
                    'Kirim Pendaftaran'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Butuh bantuan? Hubungi kami di{' '}
              <a href="https://wa.me/628123456789" className="text-green-600 hover:underline">
                WhatsApp: 0812-3456-789
              </a>{' '}
              atau email{' '}
              <a href="mailto:info@tpqalhikmah.com" className="text-green-600 hover:underline">
                info@tpqalhikmah.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}