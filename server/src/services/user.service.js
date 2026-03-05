const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');

const prisma = new PrismaClient();

class UserService {
  async getAllUsers(query) {
    const features = new APIFeatures(prisma.user, query)
      .filter()
      .sort()
      .paginate();

    const users = await features.query({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isApproved: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            songRequests: true,
            comments: true
          }
        }
      }
    });

    const total = await prisma.user.count();

    return {
      users,
      total,
      page: parseInt(query.page) || 1,
      limit: parseInt(query.limit) || 10
    };
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isApproved: true,
        isBanned: true,
        createdAt: true,
        songRequests: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            song: true
          }
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            post: {
              select: { title: true, slug: true }
            }
          }
        },
        rsvps: {
          include: {
            event: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const { firstName, lastName, phone, profileImage } = updateData;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        profileImage
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true
      }
    });

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Password changed successfully' };
  }

  // Admin functions
  async approveUser(userId) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true }
    });

    return user;
  }

  async banUser(userId) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true }
    });

    return user;
  }

  async unbanUser(userId) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false }
    });

    return user;
  }

  async changeUserRole(userId, role) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    return user;
  }

  async deleteUser(userId) {
    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }

  async getUserStats() {
    const total = await prisma.user.count();
    const approved = await prisma.user.count({ where: { isApproved: true } });
    const pending = await prisma.user.count({ where: { isApproved: false } });
    const banned = await prisma.user.count({ where: { isBanned: true } });
    const admins = await prisma.user.count({ 
      where: { 
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      } 
    });

    return {
      total,
      approved,
      pending,
      banned,
      admins
    };
  }
}

module.exports = new UserService();