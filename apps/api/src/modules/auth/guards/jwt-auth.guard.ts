import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // SECURITY FIX: this used to catch any error/missing-user from the passport
  // 'jwt' strategy (JwtStrategy.validate(), which checks the user still
  // exists and isActive) and fall back to manually re-verifying the raw JWT
  // itself — trusting whatever `sub`/`email`/`role` was in the token's stale
  // claims with NO re-check that the user is still active or even exists.
  // That meant a deactivated or deleted user's still-unexpired token kept
  // working forever, completely bypassing the isActive/exists check the
  // primary strategy exists to enforce. There is no legitimate case where
  // this fallback should grant access that the primary strategy denied, so
  // it's removed rather than reproduced with an extra check bolted on.
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
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
