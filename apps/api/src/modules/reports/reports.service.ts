import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  async generateReport(type: string, _parameters: Record<string, unknown>) {
    const reportId = uuidv4();

    // FREE VERSION: Only 3 report types (vs 6 in full version)
    const templates: Record<string, any> = {
      executive: {
        id: reportId,
        type: 'executive',
        title: 'Executive Security Report [FREE]',
        description: 'High-level security posture summary for C-level executives',
        sections: [
          { title: 'Security Score', content: 'Overall security score: 87/100' },
          { title: 'Key Metrics', content: 'Incidents: 23 (-15%), MTTR: 4.2h (-8%)' },
          { title: 'Risk Assessment', content: 'Current risk level: Medium-High' },
          { title: 'Recommendations', content: '1. Implement Zero Trust, 2. Patch critical CVEs' },
        ],
        format: 'json',
        generatedAt: new Date(),
        watermark: 'FREE VERSION - Upgrade to Enterprise for PDF export',
      },
      technical: {
        id: reportId,
        type: 'technical',
        title: 'Technical Security Report [FREE]',
        description: 'Detailed technical analysis for security teams',
        sections: [
          { title: 'Vulnerabilities', content: '47 active, 12 critical' },
          { title: 'Incidents', content: '23 incidents, 5 under investigation' },
          { title: 'Threat Intelligence', content: '3 active threat campaigns detected' },
          { title: 'IOCs', content: '156 IOCs correlated with internal data' },
        ],
        format: 'json',
        generatedAt: new Date(),
        watermark: 'FREE VERSION - Upgrade to Enterprise for PDF export',
      },
      incident: {
        id: reportId,
        type: 'incident',
        title: 'Incident Report [FREE]',
        description: 'Detailed incident investigation report',
        sections: [
          { title: 'Summary', content: 'Ransomware attempt contained' },
          { title: 'Timeline', content: '6 phases identified and documented' },
          { title: 'Impact', content: '2 servers affected, no data loss' },
          { title: 'Lessons Learned', content: '5 improvement areas identified' },
        ],
        format: 'json',
        generatedAt: new Date(),
        watermark: 'FREE VERSION - Upgrade to Enterprise for PDF export',
      },
    };

    return templates[type] || templates.executive;
  }

  async generatePdfBuffer(_type: string, _data: any): Promise<Buffer> {
    // FREE VERSION: PDF export not available
    throw new Error('PDF export is only available in the Enterprise version. Upgrade to unlock this feature.');
  }

  async getReportTemplates() {
    // FREE VERSION: Only 3 templates (vs 6 in full version)
    return [
      { id: 'executive', name: 'Executive Report', description: 'C-level summary' },
      { id: 'technical', name: 'Technical Report', description: 'Detailed technical analysis' },
      { id: 'incident', name: 'Incident Report', description: 'Incident investigation' },
    ];
  }

  async listReports() {
    return [
      { id: uuidv4(), type: 'executive', title: 'Monthly Executive Report - June 2024', generatedAt: new Date(), status: 'completed' },
      { id: uuidv4(), type: 'incident', title: 'Incident Report - INC-2024-001', generatedAt: new Date(Date.now() - 86400000), status: 'completed' },
    ];
  }
}
