import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add error handling for connection issues
prisma.$on('error', (e: any) => {
  console.error('Prisma error:', e)
})

prisma.$on('query', (e: any) => {
  console.log('Prisma query:', e.query)
  console.log('Prisma params:', e.params)
  console.log('Prisma duration:', e.duration)
}) 