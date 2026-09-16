import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.assetsService.findAll({
      type,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 100,
    });
  }

  @Get('digital-twin')
  getDigitalTwin() {
    return this.assetsService.getDigitalTwin();
  }

  @Get('stats')
  getStats() {
    return this.assetsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.assetsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.assetsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.assetsService.delete(id);
  }
}
