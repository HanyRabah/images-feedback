// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('client123', 10)

  try {
    const admin = await prisma.user.upsert({
      where: { 
        email: 'client@example.com' 
      },
      update: {
        password: hashedPassword
      },
      create: {
        email: 'client@example.com',
        name: 'client User',
        role: 'CLIENT',
        password: hashedPassword
      },
    })
    
    console.log('client user created successfully:')
    console.log({
      email: admin.email,
      role: admin.role,
      name: admin.name
    })
  } catch (error) {
    console.error('Error creating client user:', error)
    process.exit(1)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })