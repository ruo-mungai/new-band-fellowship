const nodemailer = require('nodemailer');
const AppError = require('../utils/AppError');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"New Band Fellowship" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email error:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <h1>Welcome to New Band Fellowship!</h1>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for joining our worship community. We're excited to have you!</p>
      <p>You can now:</p>
      <ul>
        <li>Request songs for fellowship sessions</li>
        <li>Comment on blog posts</li>
        <li>Vote for song requests</li>
        <li>View upcoming events</li>
      </ul>
      <p>Your account is pending approval from an administrator. You'll receive another email once your account is approved.</p>
      <p>Blessings,<br>New Band Fellowship Team</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to New Band Fellowship!',
      html
    });
  }

  async sendAccountApprovedEmail(user) {
    const html = `
      <h1>Account Approved!</h1>
      <p>Dear ${user.firstName},</p>
      <p>Great news! Your account has been approved. You can now fully participate in our fellowship platform.</p>
      <p><a href="${process.env.CLIENT_URL}/songs">Click here to start requesting songs</a></p>
      <p>Blessings,<br>New Band Fellowship Team</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Your New Band Fellowship Account is Approved!',
      html
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>Dear ${user.firstName},</p>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Blessings,<br>New Band Fellowship Team</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - New Band Fellowship',
      html
    });
  }
}

module.exports = new EmailService();