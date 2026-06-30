import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RiskService } from './risk.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('risk')
@Controller('risk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate risk score for an asset' })
  @ApiResponse({ status: 200, description: 'Risk score calculated' })
  async calculateRisk(@Body() assetData: any) {
    return this.riskService.calculateAssetRisk(assetData);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get risk overview' })
  @ApiResponse({ status: 200, description: 'Risk overview returned' })
  async getRiskOverview() {
    return this.riskService.getRiskOverview();
  }
}
