import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new user' })
  async create(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      role?: string;
    },
  ) {
    return this.usersService.create({ ...body, role: body.role as any });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a user' })
  async update(
    @Param('id') id: string,
    @Body()
    body: { name?: string; email?: string; role?: string; isActive?: boolean },
  ) {
    return this.usersService.update(id, { ...body, role: body.role as any });
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Param('id') id: string,
    @Body() body: { currentPassword: string; newPassword: string },
    @Request() req: any,
  ) {
    if (req.user?.id !== id && req.user?.role !== 'admin') {
      throw new ForbiddenException('You can only change your own password');
    }
    await this.usersService.changePassword(
      id,
      body.currentPassword,
      body.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  @Patch(':id/reset-password')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Reset user password (admin)' })
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    await this.usersService.resetPassword(id, body.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted' };
  }
}
