import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DigitalTwinService } from './digital-twin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('digital-twin')
@Controller('digital-twin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DigitalTwinController {
  constructor(private readonly digitalTwinService: DigitalTwinService) {}

  @Get('graph')
  @ApiOperation({ summary: 'Get Digital Twin graph' })
  @ApiResponse({ status: 200, description: 'Graph returned' })
  async getGraph() {
    return this.digitalTwinService.getGraph();
  }

  @Get('node/:id')
  @ApiOperation({ summary: 'Get node details' })
  @ApiResponse({ status: 200, description: 'Node details returned' })
  async getNodeDetails(@Param('id') id: string) {
    return this.digitalTwinService.getNodeDetails(id);
  }

  @Get('topology')
  @ApiOperation({ summary: 'Get topology overview' })
  @ApiResponse({ status: 200, description: 'Topology returned' })
  async getTopology() {
    return this.digitalTwinService.getTopology();
  }
}
