import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from '../../database/entities/alert.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('correlation')
@Controller('correlation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CorrelationController {
  constructor(@InjectRepository(Alert) private alertRepo: Repository<Alert>) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Get correlation alerts' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'severity', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Alerts returned' })
  async getAlerts(
    @Query('status') status?: string,
    @Query('severity') severity?: string,
    @Query('limit') limit?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await this.alertRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: parseInt(limit || '50', 10),
    });

    return alerts;
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get correlation rules' })
  @ApiResponse({ status: 200, description: 'Rules returned' })
  async getRules() {
    const { CorrelationRule } =
      await import('../../database/entities/audit-log.entity');
    return this.alertRepo.manager.find(CorrelationRule);
  }
}
