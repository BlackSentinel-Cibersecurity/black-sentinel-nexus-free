import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Request() req: any,
  ) {
    return this.authService.login(body.email, body.password, req.ip);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      role?: string;
    },
  ) {
    return this.authService.register(
      body.email,
      body.name,
      body.password,
      body.role,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.authService.findAllUsers();
  }
}
