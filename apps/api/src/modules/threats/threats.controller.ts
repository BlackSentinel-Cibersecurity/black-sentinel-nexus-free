import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ThreatsService } from './threats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('threats')
@UseGuards(JwtAuthGuard)
export class ThreatsController {
  constructor(private readonly threatsService: ThreatsService) {}

  @Get()
  findAll(@Query('type') type?: string, @Query('severity') severity?: string) {
    return this.threatsService.findAllIndicators({ type, severity });
  }

  @Get('feeds')
  getFeeds() { return this.threatsService.getFeeds(); }

  @Get('indicators')
  getIndicators(@Query('type') type?: string, @Query('severity') severity?: string) {
    return this.threatsService.findAllIndicators({ type, severity });
  }

  @Get('indicators/search')
  searchIndicators(@Query('q') query: string) {
    return this.threatsService.searchIndicators(query || '');
  }

  @Get('stats')
  getStats() { return this.threatsService.getStats(); }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Return IOC by ID - use search as fallback
    return this.threatsService.searchIndicators(id);
  }

  @Post('correlate')
  correlateIOC(@Body() body: { ioc: string }) {
    return this.threatsService.correlateIOC(body.ioc);
  }
}
