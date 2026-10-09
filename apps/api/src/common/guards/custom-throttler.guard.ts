import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return Promise.resolve(req.ips?.length ? req.ips[0] : req.ip);
  }

  protected throwThrottlingException(): Promise<void> {
    // A plain Error surfaced as a 500; this answers 429 Too Many Requests.
    throw new ThrottlerException('Too many requests. Try again in a minute.');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // SECURITY FIX: /auth/login and /auth/register used to be exempt, which
    // left password guessing unlimited. They are rate-limited like the rest.
    return super.canActivate(context);
  }
}
