// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable all logs
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add a test function
export async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`
    console.log('Database connection successful:', result)
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}