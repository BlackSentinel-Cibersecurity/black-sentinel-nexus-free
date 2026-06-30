import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'blacksentinel-nexus-secret-key-2024';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers?.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const token = authHeader.substring(7);
          const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as any;
          const fallbackUser = { id: payload.sub, email: payload.email, role: payload.role };
          request.user = fallbackUser;
          return fallbackUser;
        } catch (e) {
          // fall through
        }
      }
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class RolesGuard {
  constructor(private readonly allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      return false;
    }

    return this.allowedRoles.includes(user.role);
  }
}
