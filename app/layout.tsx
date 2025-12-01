import './globals.css'
import { Inter } from 'next/font/google'
import { TpqProvider } from '@/lib/TpqContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TPQ Al-Hikmah - Taman Pendidikan Al-Quran',
  description: 'Website resmi TPQ Al-Hikmah untuk pendaftaran santri, informasi kegiatan, dan pembelajaran Al-Quran',
  keywords: 'TPQ, Taman Pendidikan Al-Quran, Mengaji, Iqra, Tahfidz, Pendidikan Islam',
  authors: [{ name: 'TPQ Al-Hikmah' }],
  openGraph: {
    title: 'TPQ Al-Hikmah',
    description: 'Taman Pendidikan Al-Quran untuk generasi Qurani',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={inter.className}>
        <TpqProvider>
          {children}
        </TpqProvider>
      </body>
    </html>
  )
}