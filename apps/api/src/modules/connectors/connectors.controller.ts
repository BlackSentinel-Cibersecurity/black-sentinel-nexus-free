import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConnectorsService } from './connectors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('connectors')
@Controller('connectors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all connectors' })
  findAll() {
    return this.connectorsService.findAll();
  }

  @Get('definitions')
  @ApiOperation({ summary: 'Get connector type definitions' })
  getDefinitions() {
    return this.connectorsService.getTemplates();
  }

  @Get('definitions/by-category')
  @ApiOperation({ summary: 'Get connector templates grouped by category' })
  getDefinitionsByCategory() {
    return this.connectorsService.getTemplatesByCategory();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get connector statistics' })
  getStats() {
    return this.connectorsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get connector by ID' })
  findOne(@Param('id') id: string) {
    return this.connectorsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a connector' })
  create(@Body() body: any) {
    return this.connectorsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a connector' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.connectorsService.update(id, body);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle connector enabled/disabled' })
  toggle(@Param('id') id: string) {
    return this.connectorsService.toggle(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test connector connection' })
  testConnection(@Param('id') id: string) {
    return this.connectorsService.testConnection(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a connector' })
  delete(@Param('id') id: string) {
    return this.connectorsService.delete(id);
  }
}
