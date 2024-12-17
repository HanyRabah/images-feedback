// src/components/Navbar.tsx
'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()
  const { data: session } = useSession();
  const isAdmin  = session?.user.role === 'ADMIN'
  const isClient = session?.user.role === 'CLIENT'

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">
            <Image src="/logo-light.webp" alt="Logo" className="h-8" />
          </h1>
          {isAdmin && (
            <div className="flex gap-4">
              <Link 
                href="/admin" 
                className="hover:text-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              {/* <Link 
                href="/client" 
                className="hover:text-gray-300 transition-colors"
              >
                Client View
              </Link> */}
            </div>
          )}
          {isClient && (
           <>
            {/* <Link 
              href="/client" 
              className="hover:text-gray-300 transition-colors"
            >
              My Images
            </Link> */}
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">
            {session?.user.email}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}