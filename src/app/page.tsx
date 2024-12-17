// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Navbar from '@/components/NavBar'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // if (session.user.role === 'ADMIN') {
  //   redirect('/admin')
  // } else {
  //   redirect('/client')
  // }
  return <div><Navbar /></div>
}