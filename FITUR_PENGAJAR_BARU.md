# Fitur Baru - Sistem Manajemen Pengajar TPQ AN-NABA

## 🎯 Ringkasan Fitur yang Ditambahkan

### 1. **Absensi Pengajar Terintegrasi**
- Absensi pengajar otomatis mengikuti data pengajar yang ditambahkan/dihapus
- Ketika pengajar baru ditambahkan, akan otomatis muncul di daftar absensi
- Ketika pengajar dihapus, semua data absensinya juga ikut terhapus

**Lokasi:**
- Halaman: `/admin/teachers/attendance`
- API: `/api/admin/teacher-attendance`

### 2. **Performa Bulanan Pengajar dengan Grafik**
Setiap pengajar memiliki halaman performa yang menampilkan:

#### Grafik & Visualisasi:
- **Grafik Lingkaran Kehadiran** dengan 3 kategori:
  - ✅ Hadir (Hijau)
  - 📝 Izin (Kuning)
  - ❌ Alfa (Merah)
- **Grafik Materi** menampilkan berapa banyak materi yang diajarkan dalam 1 bulan

#### Kategori Evaluasi:
Sistem otomatis mengevaluasi performa dengan 4 kategori:
- 🌟 **Sempurna**: Kehadiran ≥ 95% & Materi ≥ 20
- 👍 **Baik**: Kehadiran ≥ 85% & Materi ≥ 15
- 👌 **Cukup**: Kehadiran ≥ 70% & Materi ≥ 10
- 📉 **Kurang**: Di bawah standar cukup

#### Statistik yang Ditampilkan:
- Total hari hadir, izin, dan alfa
- Jumlah materi yang diajarkan
- Persentase kehadiran
- Rata-rata materi per hari
- Status kategori performa bulanan

**Lokasi:**
- Halaman: `/admin/teachers/performance`
- API: `/api/admin/teacher-attendance/performance`

**Akses:**
- Dari menu utama Pengajar → Tombol "📊 Performa"
- Dari card pengajar individual → Tombol ikon 📊

### 3. **Manajemen Materi Pengajar**
Fitur untuk mencatat materi yang diajarkan setiap hari:

#### Fitur:
- Tambah materi dengan informasi:
  - Tanggal pengajaran
  - Topik materi
  - Deskripsi detail
  - Nama kelas
  - Durasi (dalam menit)
- View berdasarkan pengajar dan bulan
- Delete materi
- Total count materi per bulan

**Lokasi:**
- Halaman: `/admin/teachers/materials`
- API: `/api/admin/teacher-materials`
- Database: Tabel `teacher_materials`

### 4. **Form Kelas dengan Dropdown Pengajar**
Saat membuat/edit kelas baru:
- Field "Penanggung Jawab" sekarang menggunakan **dropdown**
- Dropdown berisi daftar pengajar yang sudah diinput
- Menampilkan nama dan spesialisasi pengajar
- Validasi wajib diisi (required)

**Lokasi:**
- Halaman: `/admin/students/classes`
- Perubahan pada komponen `ClassModal`

## 📊 Struktur Database Baru

### Tabel `teacher_materials`
```sql
CREATE TABLE teacher_materials (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES admins(id),
  teacher_id INTEGER NOT NULL REFERENCES teachers(id),
  material_date DATE NOT NULL,
  material_topic VARCHAR(255) NOT NULL,
  material_description TEXT,
  class_name VARCHAR(100),
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Alur Kerja Baru

### Workflow Manajemen Pengajar:
1. **Tambah Pengajar** → Otomatis muncul di daftar absensi
2. **Input Absensi Harian** → Data tersimpan untuk perhitungan performa
3. **Input Materi yang Diajarkan** → Data tersimpan untuk evaluasi performa
4. **Lihat Performa Bulanan** → Sistem otomatis menghitung dan menampilkan grafik + kategori
5. **Hapus Pengajar** → Data absensi dan materi ikut terhapus otomatis

### Workflow Manajemen Kelas:
1. **Tambah Kelas Baru**
2. **Pilih Penanggung Jawab** dari dropdown pengajar
3. **Simpan** → Nama pengajar tersimpan di kelas

## 🎨 Fitur UI/UX

### Menu Pengajar Utama:
Tombol di header:
- 📚 **Materi** → Kelola materi yang diajarkan
- 📋 **Absen** → Input absensi harian
- 📊 **Performa** → Lihat evaluasi performa
- ➕ **Tambah Pengajar** → Tambah pengajar baru

### Card Pengajar:
Setiap card memiliki 3 tombol:
- 📊 **Performa** → Langsung ke halaman performa pengajar tersebut
- ✏️ **Edit** → Edit data pengajar
- 🗑️ **Hapus** → Hapus pengajar (konfirmasi terlebih dahulu)

## 📦 Dependencies Baru
- `recharts`: Library untuk membuat grafik interaktif

## 🚀 Cara Menggunakan

### 1. Setup Database
Jalankan migrasi untuk membuat tabel baru:
```bash
node run-materials-migration.js
```

### 2. Install Dependencies
```bash
npm install recharts
```

### 3. Akses Fitur
1. Login sebagai admin
2. Navigasi ke menu **Pengajar**
3. Gunakan tombol-tombol yang tersedia untuk mengakses fitur baru

## 📱 Responsive Design
Semua fitur baru sudah responsive dan dapat diakses dengan baik di:
- Desktop
- Tablet
- Mobile

## 🔐 Keamanan
- Semua API menggunakan JWT authentication
- Data hanya bisa diakses oleh admin yang login
- Validasi data di backend
- Konfirmasi sebelum delete

## 📈 Manfaat
1. **Evaluasi Objektif**: Sistem otomatis mengevaluasi performa berdasarkan data konkret
2. **Visualisasi Jelas**: Grafik memudahkan pemahaman performa pengajar
3. **Tracking Materi**: Dapat melihat materi apa saja yang sudah diajarkan
4. **Integrasi Seamless**: Semua fitur terintegrasi dengan baik
5. **Efisiensi**: Proses input data lebih cepat dengan dropdown

## 📝 Notes
- Performa dihitung per bulan
- Kategori evaluasi dapat disesuaikan sesuai kebutuhan
- Materi dapat diinput manual atau otomatis berdasarkan kehadiran
- Data historis tersimpan untuk analisis jangka panjang

---
**Developed for TPQ AN-NABA Management System**
**Date: January 3, 2026**
