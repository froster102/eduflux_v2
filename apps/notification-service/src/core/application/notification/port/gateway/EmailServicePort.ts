export interface EmailServicePort {
  sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void>;
}
