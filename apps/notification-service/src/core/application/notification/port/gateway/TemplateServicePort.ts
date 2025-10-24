export interface TemplateServicePort {
  render(templateName: string, data: Record<string, string>): string;
}
