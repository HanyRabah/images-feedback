import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import Navbar from '@/components/NavBar'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
      </body>
    </html>
  )
}
