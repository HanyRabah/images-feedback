// src/app/client/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ClientDashboardView from '@/components/ClientDashboardView'

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions)
  
  const folders = await prisma.folder.findMany({
    where: { clientId: session.user.id },
    include: {
      images: {
        include: {
          feedback: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      },
    }
  })

  return <ClientDashboardView folders={folders} />
}