import { IEmailService } from '@/application/services/email.service';
import nodemailer from 'nodemailer';
import { emailConfig } from '@/shared/config/email.config';
import { Logger } from '@/shared/utils/logger';
import { EMAIL_SERVICE } from '@/shared/constants/services';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class NodeMailerService implements IEmailService {
  private _transporter: nodemailer.Transporter;
  private _logger = new Logger(EMAIL_SERVICE);

  constructor() {
    const smtpOptions: SMTPTransport.Options = {
      host: emailConfig.SMTP_HOST,
      auth: {
        user: emailConfig.SMTP_USER,
        pass: emailConfig.SMTP_PASS,
      },
    };
    this._transporter = nodemailer.createTransport(smtpOptions);

    void this._transporter
      .verify()
      .then(() => {
        this._logger.info(
          'Connected to SMTP server and ready to send messages',
        );
      })
      .catch(() => {
        this._logger.error('Failed to connect to SMTP server');
      });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    await this._transporter.sendMail({
      from: emailConfig.SMTP_USER,
      to,
      subject,
      text: content,
    });
  }
}
