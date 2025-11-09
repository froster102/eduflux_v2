import { nodemailerConfig } from '@/shared/config/nodemailerConfig';
import { logger } from '@/shared/utils/logger';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: nodemailerConfig.SMTP_HOST,
  port: 587,
  auth: {
    user: nodemailerConfig.SMTP_USER,
    pass: nodemailerConfig.SMTP_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  content: string,
): Promise<void> {
  await tryCatch(
    transporter.sendMail({
      from: nodemailerConfig.SMTP_USER,
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
