const nodemailer = require('nodemailer');
const AppError = require('./AppError');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    // Only initialize if email credentials are provided
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service connection failed:', error);
        } else {
          console.log('✅ Email service ready to send messages');
        }
      });
    } else {
      console.log('⚠️ Email credentials not provided. Emails will be logged to console.');
    }
  }

  async sendEmail(options) {
    const { to, subject, html, text } = options;

    // If no transporter, log to console (development)
    if (!this.transporter) {
      console.log('\n📧 EMAIL (development mode):');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${html || text}`);
      console.log('---\n');
      return { messageId: 'dev-mode-' + Date.now() };
    }

    try {
      const mailOptions = {
        from: `"New Band Fellowship" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  // Welcome email
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { 
            background: #f97316; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to New Band Fellowship!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Thank you for joining our worship community. We're excited to have you on this journey of faith and worship!</p>
            
            <h3>What you can do now:</h3>
            <ul>
              <li>🎵 Request songs for fellowship sessions</li>
              <li>💬 Comment on blog posts</li>
              <li>🗳️ Vote for song requests</li>
              <li>📅 View upcoming events</li>
              <li>📖 Read our blog</li>
            </ul>
            
            <p>Your account is currently pending approval from an administrator. You'll receive another email once your account is approved.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}" class="button">Visit Our Website</a>
            </div>
            
            <p>In the meantime, feel free to explore our public content and get a feel for our community.</p>
            
            <p>Blessings,<br>
            <strong>The New Band Fellowship Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} New Band Fellowship. All rights reserved.</p>
            <p>Ruiru Town, Kenya</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to New Band Fellowship!',
      html
    });
  }

  // Account approved email
  async sendAccountApprovedEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { 
            background: #f97316; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Approved! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Great news! Your account has been approved. You can now fully participate in our fellowship platform.</p>
            
            <h3>Now you can:</h3>
            <ul>
              <li>🎤 Request songs for worship sessions</li>
              <li>👍 Vote on song requests</li>
              <li>💬 Comment on blog posts</li>
              <li>📝 RSVP for events</li>
              <li>👥 Connect with the community</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/songs" class="button">Start Requesting Songs</a>
            </div>
            
            <p>We can't wait to worship with you!</p>
            
            <p>Blessings,<br>
            <strong>The New Band Fellowship Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Your New Band Fellowship Account is Approved!',
      html
    });
  }

  // Password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { 
            background: #f97316; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
          }
          .warning { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p class="warning">This link will expire in 1 hour.</p>
            
            <p>If you didn't request this, please ignore this email and make sure you can still access your account.</p>
            
            <hr>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            
            <p>Blessings,<br>
            <strong>The New Band Fellowship Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request - New Band Fellowship',
      html
    });
  }

  // Song request status update
  async sendSongRequestStatusEmail(user, request, status) {
    const statusMessages = {
      SCHEDULED: 'Your song request has been scheduled!',
      SUNG: 'Your song request has been sung!',
      REJECTED: 'Your song request status update'
    };

    const statusColors = {
      SCHEDULED: '#3b82f6',
      SUNG: '#22c55e',
      REJECTED: '#ef4444'
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${statusColors[status]}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .song-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusMessages[status]}</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>Your song request status has been updated:</p>
            
            <div class="song-details">
              <h3>Song: ${request.songTitle}</h3>
              ${request.stanzaNumber ? `<p>Stanza: ${request.stanzaNumber}</p>` : ''}
              <p>Status: <strong style="color: ${statusColors[status]}">${status}</strong></p>
              ${request.scheduledDate ? `<p>Scheduled for: ${new Date(request.scheduledDate).toLocaleString()}</p>` : ''}
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/songs" class="button">View All Requests</a>
            </div>
            
            <p>Blessings,<br>
            <strong>The New Band Fellowship Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Song Request ${status} - New Band Fellowship`,
      html
    });
  }

  // Event reminder
  async sendEventReminderEmail(user, event) {
    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .event-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName},</h2>
            <p>This is a reminder for an upcoming event:</p>
            
            <div class="event-details">
              <h3>${event.title}</h3>
              <p><strong>Date:</strong> ${formattedDate}</p>
              ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
            </div>
            
            <p>We look forward to seeing you there!</p>
            
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/events/${event.id}" class="button">View Event Details</a>
            </div>
            
            <p>Blessings,<br>
            <strong>The New Band Fellowship Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Reminder: ${event.title} - New Band Fellowship`,
      html
    });
  }

  // Contact form submission
  async sendContactFormEmail(data) {
    const { name, email, subject, message } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f97316; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            
            <div class="message-box">
              <h3>Message:</h3>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html
    });
  }
}

module.exports = new EmailService();