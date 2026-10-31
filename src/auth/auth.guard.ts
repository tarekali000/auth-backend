import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies?.Auth || request.headers.authorization?.split(' ')[1];

    if (!token) 
      throw new UnauthorizedException('Token is required.');
    

    try {
      const { userId } = verify(token, process.env.JWT_KEY!) as any;

      request.user = { userId };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
