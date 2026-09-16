import { Controller, Get, Post, Body, UseGuards, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  @ApiResponse({ status: 200, description: 'Reports returned' })
  async listReports() {
    return this.reportsService.listReports();
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get report templates' })
  @ApiResponse({ status: 200, description: 'Templates returned' })
  async getTemplates() {
    return this.reportsService.getReportTemplates();
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a report' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateReport(
    @Body() body: { type: string; parameters?: Record<string, unknown> },
  ) {
    return this.reportsService.generateReport(body.type, body.parameters || {});
  }

  @Post('generate/pdf')
  @ApiOperation({ summary: 'Generate and download a PDF report' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  async generatePdf(
    @Body() body: { type: string; parameters?: Record<string, unknown> },
    @Res() res: Response,
  ) {
    const report = await this.reportsService.generateReport(
      body.type,
      body.parameters || {},
    );
    const pdfBuffer = await this.reportsService.generatePdfBuffer(
      body.type,
      report,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.title.replace(/\s+/g, '_')}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }
}
