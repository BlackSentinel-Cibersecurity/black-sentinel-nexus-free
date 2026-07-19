export interface EditionLimits {
  maxUsers: number;
  maxConnectors: number;
  maxCorrelationRules: number;
  languages: string[];
  maxDigitalTwinNodes: number;
  maxReportTemplates: number;
  pdfExport: boolean;
  aiCorrelation: 'basic' | 'advanced';
  threatIntelligence: 'basic' | 'full';
}

export const FREE_LIMITS: EditionLimits = {
  maxUsers: 3,
  maxConnectors: 10,
  maxCorrelationRules: 2,
  languages: ['en', 'es'],
  maxDigitalTwinNodes: 4,
  maxReportTemplates: 3,
  pdfExport: false,
  aiCorrelation: 'basic',
  threatIntelligence: 'basic',
};

export const ENTERPRISE_LIMITS: EditionLimits = {
  maxUsers: Infinity,
  maxConnectors: 64,
  maxCorrelationRules: 5,
  languages: ['en', 'es', 'pt', 'de', 'fr'],
  maxDigitalTwinNodes: 8,
  maxReportTemplates: 6,
  pdfExport: true,
  aiCorrelation: 'advanced',
  threatIntelligence: 'full',
};

export const editionConfig = {
  edition: 'free' as const,
  version: '1.0.0-free',
  limits: FREE_LIMITS,
};
