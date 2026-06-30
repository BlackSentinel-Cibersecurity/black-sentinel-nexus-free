import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('ingest')
  async ingestEvent(@Body() body: any) {
    return this.eventsService.ingestEvent(body);
  }

  @Post('ingest/batch')
  async ingestBatch(@Body() body: any[]) {
    return this.eventsService.ingestBatch(body);
  }

  @Get()
  async queryEvents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categories') categories?: string,
    @Query('severities') severities?: string,
    @Query('sources') sources?: string,
    @Query('sourceIp') sourceIp?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.queryEvents({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categories: categories?.split(','),
      severities: severities?.split(','),
      sources: sources?.split(','),
      sourceIp, search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 100,
    });
  }

  @Get('stats')
  async getStats() { return this.eventsService.getStats(); }

  @Get('timeline')
  async getTimeline(@Query('minutes') minutes?: string) {
    return this.eventsService.getTimeline(minutes ? parseInt(minutes, 10) : 60);
  }

  @Get('top-ips')
  async getTopIps(@Query('limit') limit?: string) {
    return this.eventsService.getTopSourceIps(limit ? parseInt(limit, 10) : 10);
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
