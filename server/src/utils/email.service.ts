import * as nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isTestAccount = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    // If real SMTP credentials are provided in the environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('📧 Email Service initialized with real SMTP credentials.');
    } else {
      // Fallback to Ethereal Email (a free fake SMTP service for testing)
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.isTestAccount = true;
        console.log('📧 Email Service initialized with Ethereal Test Account (Check console for preview URLs).');
      } catch (error) {
        console.error('Failed to create Ethereal test account:', error);
      }
    }
  }

  async sendWelcomeEmail(toEmail: string, employeeName: string, temporaryPassword: string, loginUrl: string) {
    if (!this.transporter) {
      console.warn('Cannot send email: Transporter not initialized.');
      return;
    }

    const mailOptions = {
      from: '"HR Management Portal" <noreply@hrms-portal.com>',
      to: toEmail,
      subject: 'Welcome to the HR Management Portal - Your Login Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Welcome to the Team, ${employeeName}!</h2>
          </div>
          <div style="padding: 30px; color: #334155; line-height: 1.6;">
            <p>Your HR profile and portal account have been successfully created.</p>
            <p>You can now log in to the portal to view your dashboard, request leaves, and manage your profile.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${toEmail}</p>
              <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</code></p>
            </div>
            
            <p style="color: #ef4444; font-size: 0.9em;"><strong>Important:</strong> Please change your password immediately after logging in for the first time.</p>
            
            <p style="margin-top: 30px;">Best regards,<br/><strong>The HR Team</strong></p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📩 Welcome email sent to ${toEmail}. Message ID: ${info.messageId}`);
      
      // If using the Ethereal testing account, log the URL where the email can be previewed!
      if (this.isTestAccount) {
        console.log(`✉️  PREVIEW EMAIL HERE: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}

export const emailService = new EmailService();
