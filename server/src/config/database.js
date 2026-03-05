const { PrismaClient } = require('@prisma/client');

// Database configuration
const dbConfig = {
  url: process.env.DATABASE_URL,
  options: {
    // Connection pool settings
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
    // Query logging in development
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
    // Error formatting
    errorFormat: 'pretty',
  },
};

// Create Prisma client with configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.url,
    },
  },
  log: dbConfig.options.log,
  errorFormat: dbConfig.options.errorFormat,
});

// Database health check
const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { status: 'unhealthy', message: error.message };
  }
};

// Get database stats
const getDatabaseStats = async () => {
  try {
    const stats = await prisma.$queryRaw`
      SELECT 
        (SELECT count(*) FROM "User") as total_users,
        (SELECT count(*) FROM "SongRequest") as total_requests,
        (SELECT count(*) FROM "BlogPost") as total_posts,
        (SELECT count(*) FROM "Event") as total_events,
        pg_database_size(current_database()) as database_size
    `;
    return stats[0];
  } catch (error) {
    console.error('Failed to get database stats:', error);
    throw error;
  }
};

// Graceful shutdown
const disconnectDatabase = async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
  console.log('Database disconnected');
};

// Handle connection errors
prisma.$on('error', (error) => {
  console.error('Prisma Client error:', error);
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

module.exports = {
  prisma,
  dbConfig,
  checkDatabaseHealth,
  getDatabaseStats,
  disconnectDatabase,
};