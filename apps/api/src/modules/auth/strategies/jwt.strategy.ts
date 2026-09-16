import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');

  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['HS256'],
      secretOrKey:
        process.env.JWT_SECRET || 'blacksentinel-nexus-secret-key-2024',
    });
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload sub: ${payload.sub}`);
    const user = await this.authService.validateUser(payload.sub);
    if (!user) {
      this.logger.warn(`User not found for id: ${payload.sub}`);
      throw new UnauthorizedException();
    }
    if (!user.isActive) {
      this.logger.warn(`User ${user.email} is inactive`);
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
