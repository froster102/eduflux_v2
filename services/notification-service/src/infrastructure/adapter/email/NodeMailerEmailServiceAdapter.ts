import { inject } from "inversify";
import nodemailer from "nodemailer";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { EmailServicePort } from "@core/application/notification/port/gateway/EmailServicePort";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { NodeMailerConfig } from "@shared/config/NodeMailerConfig";

export class NodeMailerEmailServiceAdapter implements EmailServicePort {
  private transporter: nodemailer.Transporter;
  private SMTP_HOST = NodeMailerConfig.SMTP_HOST;
  private SMTP_PORT = NodeMailerConfig.SMTP_PORT;
  private SMTP_USER = NodeMailerConfig.SMTP_USER;
  private SMTP_PASS = NodeMailerConfig.SMTP_PASS;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.SMTP_HOST,
      port: this.SMTP_PORT,
      secure: this.SMTP_PORT === 465,
      auth: {
        user: this.SMTP_USER,
        pass: this.SMTP_PASS,
      },
    });
    this.logger = logger.fromContext(NodeMailerEmailServiceAdapter.name);

    void this.transporter
      .verify()
      .then(() => {
        this.logger.info(`Successfully verified nodemail transport`);
      })
      .catch((error: Error) => {
        this.logger.error(
          `Failed to verify nodemailer transport error:${error?.message}`,
        );
      });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void> {
    const { to, subject, html, from = "no-reply@eduflux.com" } = options;

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error)?.message}`,
      );
    }
  }
}
