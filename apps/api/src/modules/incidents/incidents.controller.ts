import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('incidents')
@Controller('incidents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: 'List incidents' })
  findAll(
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.incidentsService.findAll({
      severity, status, assignedTo,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get incident statistics' })
  getStats() {
    return this.incidentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create incident' })
  create(@Body() body: {
    title: string;
    description?: string;
    severity: string;
    source: string;
    assignedTo?: string;
    affectedAssetIds?: string[];
    relatedEventIds?: string[];
    mitreTechnique?: string;
  }) {
    return this.incidentsService.create(body);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update incident status' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string; userId?: string },
  ) {
    return this.incidentsService.updateStatus(id, body.status as any, body.userId, body.notes);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident' })
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; severity?: string; assignedTo?: string },
  ) {
    return this.incidentsService.update(id, body);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to incident' })
  addNote(
    @Param('id') id: string,
    @Body() body: { user: string; content: string },
  ) {
    return this.incidentsService.addNote(id, body.user, body.content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident' })
  delete(@Param('id') id: string) {
    return this.incidentsService.delete(id);
  }
}
