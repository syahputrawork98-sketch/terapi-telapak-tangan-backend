import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { failure } from '../utils/envelope';
import { verifyToken } from '../utils/token';

interface RequestWithUser {
  headers: Record<string, string | string[] | undefined>;
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeaderRaw = request.headers.authorization;
    const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

    if (!authHeader) {
      throw new HttpException(failure('Unauthorized', 'AUTH_UNAUTHORIZED'), HttpStatus.UNAUTHORIZED);
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new HttpException(failure('Unauthorized', 'AUTH_UNAUTHORIZED'), HttpStatus.UNAUTHORIZED);
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new HttpException(failure('Unauthorized', 'AUTH_UNAUTHORIZED'), HttpStatus.UNAUTHORIZED);
    }

    request.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    return true;
  }
}
