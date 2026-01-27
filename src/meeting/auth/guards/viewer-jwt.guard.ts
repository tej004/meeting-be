import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ViewerJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (payload?.data?.role !== 'viewer') {
      throw new UnauthorizedException('Not a viewer token');
    }

    (request as any).user = payload.data;
    return !!payload;
  }
}
