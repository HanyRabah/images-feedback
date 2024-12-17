import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import UploadClient from './UploadClient'


type Params = Promise<{ clientId: string; }>

const UploadPage = async ({ params }: { params: Params }) => {
  const { clientId } = await params
  const session = await getServerSession(authOptions)

  if (!session || session?.user?.role !== 'ADMIN') {
    redirect('/login')
  }

  const client = await prisma.user.findUnique({
    where: { id: clientId },
    include: {
      folders: {
        include: {
          client: true,
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
          }
        }
      }
    }
  })

  if (!client) {
    redirect('/admin')
  }

  return <UploadClient client={client} />
}

export default UploadPage
