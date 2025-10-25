import { readFileSync } from 'fs';
import { join } from 'path';
import type { TemplateServicePort } from '@core/application/notification/port/gateway/TemplateServicePort';
import { TemplateRenderingException } from '@infrastructure/exceptions/TemplateRenderingExecption';

export class HtmlTemplateServiceAdapter implements TemplateServicePort {
  private templatesDir = join(__dirname, '/html');

  constructor() {}

  render(templateName: string, data: Record<string, string>): string {
    try {
      const templatePath = join(this.templatesDir, `${templateName}.html`);
      let templateContent = readFileSync(templatePath, 'utf-8');

      Object.entries(data).forEach(([key, value]) => {
        templateContent = templateContent.replace(
          new RegExp(`{{${key}}}`, 'g'),
          value.toString(),
        );
      });

      return templateContent;
    } catch (error) {
      throw new TemplateRenderingException(
        `Template rendering failed: ${templateName}, Error ${(error as Error)?.message}`,
      );
    }
  }
}
