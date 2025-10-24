import { emailConfig } from '@/shared/config/email.config';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { Logger } from '@/shared/utils/logger';
import { tryCatch } from '@/shared/utils/try-catch';
import nodemailer from 'nodemailer';

const logger = new Logger(AUTH_SERVICE);

const transporter = nodemailer.createTransport({
  host: emailConfig.SMTP_HOST,
  port: 587,
  auth: {
    user: emailConfig.SMTP_USER,
    pass: emailConfig.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  content: string,
): Promise<void> {
  await tryCatch(
    transporter.sendMail({
      from: emailConfig.SMTP_USER,
      to,
      subject,
      text: content,
    }),
  );
}

export async function verifyEmailTransport(): Promise<void> {
  const { error } = await tryCatch(transporter.verify());

  if (error) {
    logger.error('Failed to connect to SMTP server');
  }

  logger.info('Connected to SMTP server and ready to send messages');
}
