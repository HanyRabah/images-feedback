// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div>
      {children}
    </div>
  )
}