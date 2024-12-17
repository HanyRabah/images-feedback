// src/components/ClientNavbar.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ClientNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Client Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}