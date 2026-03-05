const { PrismaClient } = require('@prisma/client');

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Middleware for soft deletes (if needed)
// prisma.$use(async (params, next) => {
//   if (params.model === 'User' && params.action === 'delete') {
//     // Change to soft delete
//     params.action = 'update';
//     params.args.data = { deletedAt: new Date() };
//   }
//   return next(params);
// });

// Helper function to check connection
prisma.$on('beforeExit', async () => {
  console.log('🔌 Prisma client disconnecting...');
});

// Test connection on startup
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
})();

module.exports = prisma;