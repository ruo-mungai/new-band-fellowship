import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create a global prisma instance (prevents too many connections in development)
const globalForPrisma = global

export const prisma = globalForPrisma.prisma || 
  new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma