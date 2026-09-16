import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user settings' })
  async getSettings(@Request() req: any) {
    return this.settingsService.getOrCreate(req.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  async updateSettings(@Request() req: any, @Body() body: any) {
    return this.settingsService.update(req.user.id, body);
  }

  @Patch('language')
  @ApiOperation({ summary: 'Update language' })
  async updateLanguage(
    @Request() req: any,
    @Body() body: { language: string },
  ) {
    return this.settingsService.updateLanguage(req.user.id, body.language);
  }

  @Patch('timezone')
  @ApiOperation({ summary: 'Update timezone' })
  async updateTimezone(
    @Request() req: any,
    @Body() body: { timezone: string },
  ) {
    return this.settingsService.updateTimezone(req.user.id, body.timezone);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update notification preferences' })
  async updateNotifications(@Request() req: any, @Body() body: any) {
    return this.settingsService.updateNotifications(req.user.id, body);
  }

  @Patch('security')
  @ApiOperation({ summary: 'Update security settings' })
  async updateSecurity(@Request() req: any, @Body() body: any) {
    return this.settingsService.updateSecurity(req.user.id, body);
  }
}
