// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin1234', 10)

  try {
    const admin = await prisma.user.upsert({
      where: { 
        email: 'hany.rabah+admin@gmail.com' 
      },
      update: {
        password: hashedPassword
      },
      create: {
        email: 'hany.rabah+admin@gmail.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: hashedPassword
      },
    })
    
    console.log('Admin user created successfully:')
    console.log({
      email: admin.email,
      role: admin.role,
      name: admin.name
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
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