// src/app/admin/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from '@/components/AdminDashboardClient'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: {
      folders: {
        include: {
          _count: {
            select: { images: true }
          }
        }
      }
    }
  })

  return <AdminDashboardClient initialClients={clients} />
}