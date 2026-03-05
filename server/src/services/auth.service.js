const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');
const { generateToken, generateRefreshToken } = require('../utils/token.util');

const prisma = new PrismaClient();

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get auto-approve setting
    const autoApproveSetting = await prisma.systemSettings.findUnique({
      where: { key: 'AUTO_APPROVE_USERS' }
    });
    const autoApprove = autoApproveSetting?.value === 'true';

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'USER',
        isApproved: autoApprove
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isApproved: true,
        createdAt: true
      }
    });

    // Generate tokens
    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if banned
    if (user.isBanned) {
      throw new AppError('Your account has been banned. Please contact support.', 403);
    }

    // Generate tokens
    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  async refreshTokens(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: { refreshToken }
    });

    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const newAccessToken = generateToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // Save new refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImage: true,
        role: true,
        isApproved: true,
        createdAt: true,
        _count: {
          select: {
            songRequests: true,
            comments: true,
            rsvps: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new AuthService();