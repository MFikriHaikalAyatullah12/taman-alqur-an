import './globals.css'
import { Inter } from 'next/font/google'
import { TpqProvider } from '@/lib/TpqContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TAMAN PENDIDIKAN ALQUR\'AN - Admin Panel',
  description: 'Sistem Manajemen TAMAN PENDIDIKAN ALQUR\'AN',
  keywords: 'TPQ, Admin, Management System',
  authors: [{ name: 'TAMAN PENDIDIKAN ALQUR\'AN' }],
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