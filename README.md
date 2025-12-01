# TPQ Al-Hikmah Website

Website resmi Taman Pendidikan Al-Quran (TPQ) Al-Hikmah dengan sistem manajemen lengkap untuk admin dan dashboard santri.

## 🌟 Fitur Utama

### 📱 Website Publik
- **Beranda**: Informasi umum TPQ, hero slider, statistik
- **Profil TPQ**: Sejarah, visi-misi, struktur organisasi, prestasi
- **Program Pembelajaran**: Iqra 1-6, Al-Quran, Tahfidz, Tahsin
- **Pengajar**: Profil ustadz/ustadzah, jadwal mengajar
- **Pendaftaran Online**: Formulir multi-step dengan validasi lengkap
- **Berita & Artikel**: Informasi terkini dan artikel islami
- **Galeri**: Foto dan video kegiatan TPQ
- **Testimoni**: Review dari orang tua dan alumni
- **Kontak**: Peta lokasi, form pesan, info kontak

### 🔧 Panel Admin
- **Dashboard**: Statistik, aktivitas terbaru, overview
- **Manajemen Santri**: Data santri, progress belajar, pendaftaran
- **Manajemen Pengajar**: Data ustadz/ustadzah, jadwal
- **Kurikulum**: Program pembelajaran, materi, metode
- **Jadwal & Kalender**: Mengaji, ujian, event, kalender akademik  
- **Galeri**: Upload dan manajemen media
- **Berita**: Publikasi artikel dan pengumuman
- **Pembayaran**: SPP, donasi, laporan keuangan
- **Testimoni**: Moderasi dan publikasi
- **Pengaturan**: Konfigurasi sistem

### 👨‍🎓 Dashboard Santri
- **Progress Belajar**: Tracking kemajuan per jilid
- **Jadwal**: Kelas hari ini dan minggu ini  
- **Nilai**: Hasil ujian dan penilaian
- **Pembayaran**: Status SPP dan riwayat
- **Pengumuman**: Info khusus santri
- **Berita**: Artikel dan tips belajar

## 🛠️ Teknologi

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **Authentication**: Custom JWT + NextAuth
- **Language**: TypeScript
- **Deployment**: Vercel Ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- PostgreSQL database (Neon)

### Installation

1. **Clone & Setup**
   ```bash
   # Windows
   setup.bat
   
   # Linux/Mac  
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Environment Setup**
   ```bash
   # Rename .env.local.example to .env.local
   cp .env.local.example .env.local
   ```

3. **Database Setup**
   - Akses PostgreSQL Neon Console
   - Jalankan script `lib/init-db.sql`
   - Atau import via psql:
   ```bash
   psql 'postgresql://neondb_owner:npg_eZCUM10hAdKH@ep-gentle-forest-a1rs74a5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -f lib/init-db.sql
   ```

4. **Run Development**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Website: `http://localhost:3000`
   - Admin: `http://localhost:3000/admin/dashboard`

## 🔑 Default Accounts

### Admin
- **Email**: admin@tpq.com
- **Password**: admin123

### Demo Santri
- **Email**: santri@tpq.com  
- **Password**: santri123

## 📱 Mobile Responsive

Website dioptimalkan untuk:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+) 
- ✅ Desktop (1024px+)
- ✅ Large screens (1440px+)

## 🎨 Design System

### Colors
- **Primary**: Green (#22c55e) to Blue (#0ea5e9)
- **Secondary**: Islamic Gold (#D4AF37)
- **Neutral**: Gray scale
- **Status**: Success, Warning, Error, Info

### Components
- Modern card layouts
- Gradient backgrounds
- Smooth animations
- Interactive elements
- Form validations
- Loading states

## 📊 Database Schema

```sql
-- Core Tables
users               -- Authentication
tpq_profile        -- TPQ information
students           -- Student data  
teachers           -- Teacher data
curriculum         -- Learning programs

-- Academic  
student_progress   -- Learning tracking
schedules          -- Events & classes
student_registrations -- New applications

-- Content
news               -- Articles & news
gallery            -- Media files
testimonials       -- Reviews
contact_messages   -- Contact forms

-- Financial
payments           -- Transactions
settings           -- Configurations
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import project di Vercel
   - Set environment variables
   - Deploy

3. **Environment Variables**
   ```
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   ```

### Other Platforms
- Netlify
- Railway  
- Digital Ocean
- VPS/Dedicated Server

## 📂 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel
│   ├── student/           # Student dashboard  
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utilities & configs
│   ├── db.js             # Database connection
│   ├── types.ts          # Type definitions
│   └── init-db.sql       # Database schema
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🔐 Security Features

- JWT Authentication
- Password hashing (bcrypt)
- Input sanitization
- CSRF protection
- SQL injection prevention
- File upload validation
- Role-based access control

## 🧪 Testing

```bash
# Run tests
npm test

# E2E testing  
npm run test:e2e

# Lighthouse audit
npm run audit
```

## 📈 Performance

- Server-side rendering (SSR)
- Static generation (SSG) 
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch  
5. Create Pull Request

## 📝 License

MIT License - see LICENSE file for details.

## 📞 Support

- **Email**: dev@tpqalhikmah.com
- **WhatsApp**: +62 812-3456-789
- **Documentation**: [Wiki](link-to-wiki)

## 🙏 Acknowledgments

- Next.js Team
- Tailwind CSS
- PostgreSQL Community
- Islamic Community

---

**TPQ Al-Hikmah** - Membentuk Generasi Qurani Berakhlak Mulia 🕌