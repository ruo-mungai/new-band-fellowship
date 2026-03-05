// server/approve-all-users.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveAllUsers() {
  try {
    const result = await prisma.user.updateMany({
      data: { isApproved: true }
    });
    
    console.log(`✅ Approved ${result.count} users`);
    
  } catch (error) {
    console.error('❌ Error approving users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

approveAllUsers();