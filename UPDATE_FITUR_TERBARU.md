# Fitur Tambahan - TPQ AN-NABA Management System

## 🎯 Update Fitur Terbaru

### 1. **📅 Penjadwalan Kegiatan dengan Export PDF**

Fitur lengkap untuk mengelola jadwal kegiatan TPQ dengan export PDF profesional.

#### Fitur Utama:
- **Tambah/Edit/Hapus Jadwal**
- **Filter berdasarkan bulan**
- **Export ke PDF dengan format profesional**

#### Informasi yang Dicatat:
- Judul kegiatan
- Jenis kegiatan (Pembelajaran, Hafalan, Ujian, dll)
- Tanggal dan waktu (mulai - selesai)
- Lokasi
- Penanggung jawab
- Peserta
- Deskripsi dan catatan

#### Format PDF:
- Header dengan logo dan nama TPQ
- Tabel jadwal lengkap dengan data terstruktur
- Footer dengan tanggal cetak
- Layout profesional dengan warna

**Lokasi:** `/admin/schedules`

---

### 2. **💰 Laporan Keuangan Export PDF & Excel**

Laporan keuangan dapat dicetak dalam format PDF dan Excel dengan desain profesional.

#### Fitur Export PDF:
- **Header Profesional** dengan nama TPQ
- **Ringkasan Keuangan** (Total Pemasukan, Pengeluaran, Saldo)
- **Tabel Transaksi Lengkap**
- **Bagian Tanda Tangan:**
  ```
  [Tanggal cetak]
  
  YANG BERTANDA TANGAN,
  KEPALA TPQ
  
  (_______________________)
  ```

#### Fitur Export Excel:
- **Tabel Transaksi** dengan format rapi
- **Summary otomatis** di akhir tabel
- **Format siap print**
- Dapat diedit lebih lanjut

#### Format Laporan:
- Filter berdasarkan bulan dan tahun
- Tipe transaksi (Pemasukan/Pengeluaran)
- Detail lengkap setiap transaksi
- Ringkasan otomatis

**Lokasi:** `/admin/finances`
**Tombol:** 
- 📄 Export PDF - Menghasilkan PDF profesional dengan tanda tangan
- 📊 Export Excel - Menghasilkan file .xlsx

---

### 3. **✅ Perbaikan Dropdown Kelas di Form Materi**

Form input materi pengajar kini menggunakan dropdown otomatis.

#### Perubahan:
- ❌ **Sebelumnya:** Input text manual untuk nama kelas
- ✅ **Sekarang:** Dropdown yang menampilkan list kelas yang sudah ditambahkan

#### Manfaat:
- Konsistensi nama kelas
- Tidak ada typo
- Lebih user-friendly
- Data lebih terstruktur

**Lokasi:** `/admin/teachers/materials`

---

### 4. **📊 Perbaikan Grafik Performa Pengajar**

Grafik performa pengajar diperbaiki untuk menampilkan data real-time dan menghindari error NaN.

#### Perbaikan:
- ✅ **Grafik Kehadiran:**
  - Hanya menampilkan data yang ada (> 0)
  - Menangani kasus ketika belum ada data
  - Persentase ditampilkan dengan benar (0% jika tidak ada data)

- ✅ **Grafik Materi:**
  - Progress bar menggunakan perhitungan yang aman
  - Menangani nilai 0 dengan baik
  - Display "0" daripada "NaN"

- ✅ **Statistik:**
  - Semua angka menggunakan fallback ke 0
  - Rata-rata dihitung dengan pengecekan pembagi
  - Persentase selalu valid

#### Before & After:
**Before:**
- Menampilkan "NaN%" saat tidak ada data
- Error pada grafik kosong
- Perhitungan bermasalah

**After:**
- Menampilkan "0%" dengan benar
- Grafik menangani data kosong dengan graceful
- Semua perhitungan aman dan valid

**Lokasi:** `/admin/teachers/performance`

---

## 📂 File Baru yang Dibuat

### Database Migrations:
1. `/migrations/add-schedules-table.sql` - Tabel untuk penjadwalan
2. `/run-schedules-migration.js` - Script migrasi schedules

### Pages:
1. `/app/admin/schedules/page.tsx` - Halaman penjadwalan kegiatan

### APIs:
1. `/app/api/admin/schedules/route.ts` - API endpoint untuk schedules

### Updated Files:
1. `/app/admin/finances/page.tsx` - Tambah export PDF & Excel
2. `/app/admin/teachers/materials/page.tsx` - Fix dropdown kelas
3. `/app/admin/teachers/performance/page.tsx` - Fix grafik NaN

---

## 🗂️ Struktur Database Baru

### Tabel `schedules`
```sql
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  activity_type VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  teacher_in_charge VARCHAR(255),
  participants TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📦 Dependencies Tambahan

```json
{
  "jspdf": "^2.x.x",
  "jspdf-autotable": "^3.x.x",
  "xlsx": "^0.18.x"
}
```

**Cara Install:**
```bash
npm install jspdf jspdf-autotable xlsx
```

---

## 🚀 Cara Menggunakan Fitur Baru

### 1. Penjadwalan Kegiatan

1. **Akses Menu:** Login → Sidebar → **Penjadwalan** (atau URL: `/admin/schedules`)
2. **Tambah Jadwal:** Klik tombol "➕ Tambah Jadwal"
3. **Isi Form:**
   - Judul kegiatan (wajib)
   - Jenis kegiatan (dropdown)
   - Tanggal mulai (wajib)
   - Waktu, lokasi, dll (opsional)
4. **Simpan:** Klik "Simpan"
5. **Export PDF:** Klik tombol "📄 Export PDF" untuk mengunduh jadwal dalam format PDF profesional

### 2. Laporan Keuangan

1. **Akses:** `/admin/finances`
2. **Filter Data:** Pilih bulan dan tahun yang diinginkan
3. **Export:**
   - **PDF:** Klik "📄 Export PDF" → File PDF dengan tanda tangan otomatis terdownload
   - **Excel:** Klik "📊 Export Excel" → File .xlsx terdownload

**Format PDF Laporan Keuangan:**
- Header TPQ AN-NABA
- Ringkasan (Total Pemasukan, Pengeluaran, Saldo)
- Tabel detail transaksi
- Footer dengan tanggal cetak dan tanda tangan:
  ```
  Jakarta, [tanggal hari ini]
  
  YANG BERTANDA TANGAN,
  KEPALA TPQ
  
  (_______________________)
  ```

### 3. Input Materi dengan Dropdown Kelas

1. **Akses:** `/admin/teachers/materials`
2. **Pilih Pengajar:** Dropdown pengajar
3. **Klik "➕ Tambah Materi"**
4. **Form Materi:**
   - Tanggal (wajib)
   - Topik materi (wajib)
   - **Kelas:** Pilih dari dropdown (otomatis menampilkan kelas yang sudah dibuat)
   - Durasi
5. **Simpan**

### 4. Lihat Performa Pengajar (Fixed)

1. **Akses:** `/admin/teachers/performance`
2. **Pilih Pengajar & Bulan**
3. **Grafik akan menampilkan:**
   - Pie chart kehadiran (hanya data yang ada)
   - Progress bar materi
   - Persentase yang valid (tanpa NaN)
   - Statistik lengkap dengan angka yang benar

---

## 🎨 Contoh Output PDF

### Jadwal Kegiatan:
```
╔══════════════════════════════════════════╗
║         TPQ AN-NABA                      ║
║      JADWAL KEGIATAN                     ║
║   Periode: Januari 2026                  ║
╠══════════════════════════════════════════╣
║ No │ Tanggal │ Waktu │ Kegiatan │ ...   ║
║  1 │ 5 Jan   │08:00  │ Tahfidz  │ ...   ║
║  2 │ 6 Jan   │09:00  │ Hafalan  │ ...   ║
╚══════════════════════════════════════════╝
Dicetak pada: 3 Januari 2026

         Mengetahui,
      Kepala TPQ AN-NABA
      
      (___________________)
```

### Laporan Keuangan:
```
╔══════════════════════════════════════════╗
║         TPQ AN-NABA                      ║
║      LAPORAN KEUANGAN                    ║
║   Periode: Januari 2026                  ║
╠══════════════════════════════════════════╣
║ RINGKASAN                                ║
║ Total Pemasukan: Rp 10.000.000          ║
║ Total Pengeluaran: Rp 7.500.000         ║
║ Saldo Akhir: Rp 2.500.000               ║
╠══════════════════════════════════════════╣
║ [Tabel Detail Transaksi]                 ║
╚══════════════════════════════════════════╝

Dicetak pada: 3 Januari 2026

3 Januari 2026
YANG BERTANDA TANGAN,
KEPALA TPQ

(_______________________)
```

---

## ✨ Keunggulan Fitur

### Penjadwalan:
✅ UI modern dan user-friendly
✅ Filter berdasarkan bulan
✅ PDF dengan layout profesional
✅ Data terstruktur rapi

### Laporan Keuangan:
✅ Export PDF dengan tanda tangan otomatis
✅ Export Excel untuk editing lebih lanjut
✅ Ringkasan otomatis
✅ Format siap print dan distribusi

### Form Materi:
✅ Dropdown mencegah typo
✅ Data konsisten
✅ Auto-sync dengan data kelas

### Grafik Performa:
✅ Tidak ada lagi error NaN
✅ Handling data kosong dengan baik
✅ Display angka yang akurat
✅ Grafik responsif dan informatif

---

## 🔧 Troubleshooting

**Q: PDF tidak terdownload?**
A: Pastikan browser mengizinkan download. Cek popup blocker.

**Q: Excel tidak bisa dibuka?**
A: Pastikan menggunakan Microsoft Excel atau Google Sheets.

**Q: Dropdown kelas kosong?**
A: Tambahkan kelas terlebih dahulu di menu Kelas.

**Q: Grafik masih NaN?**
A: Clear cache browser dan refresh halaman.

---

**Developed for TPQ AN-NABA Management System**
**Last Updated: January 3, 2026**
