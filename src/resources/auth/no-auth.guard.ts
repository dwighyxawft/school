import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'] || request.cookies['instructor_token'] || request.cookies['admin_token'];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        if (decoded) {
          throw new UnauthorizedException('You are already logged in');
        }
      } catch (e) {
        // If token verification fails, proceed to the login endpoint
        return true;
      }
    }

    return true;
  }
}
