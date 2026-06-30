import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AIAnalysisRequest, NaturalLanguageQuery } from '@bsn/types';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze using AI' })
  @ApiResponse({ status: 200, description: 'Analysis completed' })
  async analyze(@Body() request: AIAnalysisRequest) {
    return this.aiService.analyze(request);
  }

  @Post('query')
  @ApiOperation({ summary: 'Process natural language query' })
  @ApiResponse({ status: 200, description: 'Query processed' })
  async processQuery(@Body() query: NaturalLanguageQuery) {
    return this.aiService.analyze({
      type: 'natural_language_query',
      input: query.query,
      context: query.context,
    });
  }

  @Post('translate')
  @ApiOperation({ summary: 'Translate natural language to query language' })
  @ApiResponse({ status: 200, description: 'Query translated' })
  async translateQuery(
    @Body() body: { query: string; targetLanguage: string }
  ) {
    return this.aiService.translateQuery(body.query, body.targetLanguage);
  }

  @Get('predictions')
  @ApiOperation({ summary: 'Get AI predictions' })
  @ApiResponse({ status: 200, description: 'Predictions returned' })
  async getPredictions() {
    return this.aiService.predict();
  }

  @Post('rule')
  @ApiOperation({ summary: 'Generate detection rule' })
  @ApiResponse({ status: 200, description: 'Rule generated' })
  async generateRule(@Body() body: { description: string }) {
    return this.aiService.analyze({
      type: 'rule_generation',
      input: body.description,
    });
  }

  @Post('playbook')
  @ApiOperation({ summary: 'Generate SOAR playbook' })
  @ApiResponse({ status: 200, description: 'Playbook generated' })
  async generatePlaybook(@Body() body: { scenario: string }) {
    return this.aiService.analyze({
      type: 'playbook_generation',
      input: body.scenario,
    });
  }
}
