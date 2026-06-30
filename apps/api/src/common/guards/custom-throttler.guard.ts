import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return Promise.resolve(req.ips?.length ? req.ips[0] : req.ip);
  }

  protected throwThrottlingException(): Promise<void> {
    throw new Error('Demasiadas solicitudes. Intenta de nuevo en un minuto.');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    // Excluir rutas de autenticación del rate limiting
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return true;
    }

    return super.canActivate(context);
  }
}
