import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlaybooksService } from './playbooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('playbooks')
@UseGuards(JwtAuthGuard)
export class PlaybooksController {
  constructor(private readonly playbooksService: PlaybooksService) {}

  @Get()
  findAll() { return this.playbooksService.findAll(); }

  @Get('stats')
  getStats() { return this.playbooksService.getStats(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.playbooksService.findById(id); }

  @Post()
  create(@Body() body: any) { return this.playbooksService.create(body); }

  @Post(':id/execute')
  execute(@Param('id') id: string, @Body() body?: { triggeredBy?: any }) {
    return this.playbooksService.execute(id, body?.triggeredBy);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.playbooksService.update(id, body); }

  @Delete(':id')
  delete(@Param('id') id: string) { return this.playbooksService.delete(id); }
}
