import prisma from '../config/database';

export type NotificationChannel = 'IN_APP' | 'EMAIL';

export interface NotificationPayload {
  employeeId: string;
  notificationType: string;
  message: string;
  triggerEvent?: string;
  channels?: NotificationChannel[];
}

class NotificationDispatcher {
  /**
   * Creates an in-app notification and optionally fires an email.
   * Email sending is a best-effort no-throw side effect — if env vars
   * are missing or SMTP fails, we log and move on so the core workflow
   * is never disrupted.
   */
  async dispatch(payload: NotificationPayload): Promise<void> {
    const channels = payload.channels ?? ['IN_APP'];

    // Always persist in-app if requested
    if (channels.includes('IN_APP')) {
      try {
        await prisma.notification.create({
          data: {
            notificationType: payload.notificationType as any,
            message: payload.message,
            triggerEvent: payload.triggerEvent,
            deliveryChannel: 'IN_APP',
            recipientId: payload.employeeId,
          }
        });
      } catch (err) {
        console.error('[Notification] Failed to persist in-app notification:', err);
      }
    }

    // Email is best-effort
    if (channels.includes('EMAIL')) {
      this.sendEmail(payload.employeeId, payload.message, payload.triggerEvent).catch((err) => {
        console.warn('[Notification] Email dispatch failed (non-fatal):', err?.message);
      });
    }
  }

  private async sendEmail(employeeId: string, message: string, subject?: string): Promise<void> {
    // Only attempt if SMTP is configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'noreply@hrms.com';

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.info('[Notification] SMTP not configured — skipping email for employee:', employeeId);
      return;
    }

    const emp = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { email: true, firstName: true }
    });
    if (!emp?.email) return;

    // Dynamic require so nodemailer is optional
    let nodemailer: any;
    try {
      nodemailer = await import('nodemailer' as string as any);
    } catch {
      nodemailer = null;
    }
    if (!nodemailer) {
      console.warn('[Notification] nodemailer not installed — skipping email');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: emp.email,
      subject: subject || 'HR Management Notification',
      text: `Dear ${emp.firstName},\n\n${message}\n\nRegards,\nHR Team`,
      html: `<p>Dear ${emp.firstName},</p><p>${message}</p><p>Regards,<br>HR Team</p>`
    });

    console.info('[Notification] Email sent to:', emp.email);
  }
}

export const notificationDispatcher = new NotificationDispatcher();
