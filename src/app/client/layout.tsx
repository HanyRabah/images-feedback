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
  const user = session?.user
  const isClient = user?.role === 'CLIENT'

  if (!session || !isClient ) {
    redirect('/login')
  }

  return (
    <div>
      {children}
    </div>
  )
}