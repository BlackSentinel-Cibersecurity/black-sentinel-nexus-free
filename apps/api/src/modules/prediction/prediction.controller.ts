import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PredictionService } from './prediction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('predictions')
@Controller('predictions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Get('attacks')
  @ApiOperation({ summary: 'Get attack predictions' })
  @ApiResponse({ status: 200, description: 'Predictions returned' })
  async getAttackPredictions() {
    return this.predictionService.getAttackPredictions();
  }

  @Get('risks')
  @ApiOperation({ summary: 'Get risk trends' })
  @ApiResponse({ status: 200, description: 'Risk trends returned' })
  async getRiskTrends() {
    return this.predictionService.getRiskTrends();
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Get detected anomalies' })
  @ApiResponse({ status: 200, description: 'Anomalies returned' })
  async getAnomalies() {
    return this.predictionService.getAnomalies();
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate custom prediction' })
  @ApiResponse({ status: 200, description: 'Prediction generated' })
  async generatePrediction(@Body() body: { type: string; parameters: Record<string, unknown> }) {
    return this.predictionService.generatePrediction(body.type, body.parameters);
  }
}
